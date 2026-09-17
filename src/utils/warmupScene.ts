import * as THREE from 'three'

/**
 * Prewarm helpers — everything that would otherwise stall the first scroll.
 *
 * After the loader hands off, the frame loop must compile nothing and upload
 * nothing. These run while the loader curtain is still on screen:
 *   1. `initTexture` for every texture, so the first sampling render does not
 *      upload a multi-megabyte map mid-scroll;
 *   2. `compileAsync` for every material in the graph, off the main thread;
 *   3. one throwaway render through the full chain, so any lazily created
 *      program or render target is touched behind the curtain.
 */

const TEXTURE_SLOTS = [
    'map',
    'alphaMap',
    'aoMap',
    'bumpMap',
    'displacementMap',
    'emissiveMap',
    'envMap',
    'lightMap',
    'metalnessMap',
    'normalMap',
    'roughnessMap',
    'specularMap',
    'clearcoatMap',
    'clearcoatNormalMap',
    'clearcoatRoughnessMap',
    'iridescenceMap',
    'sheenColorMap',
    'transmissionMap',
    'thicknessMap',
] as const

const collectFromMaterial = (material: THREE.Material, into: Set<THREE.Texture>) => {
    const record = material as unknown as Record<string, unknown>

    for (const slot of TEXTURE_SLOTS) {
        const value = record[slot]
        if (value instanceof THREE.Texture) into.add(value)
    }

    // Shader materials keep their maps in uniforms rather than named slots.
    const uniforms = record.uniforms as Record<string, { value?: unknown }> | undefined
    if (uniforms) {
        for (const key of Object.keys(uniforms)) {
            const value = uniforms[key]?.value
            if (value instanceof THREE.Texture) into.add(value)
        }
    }
}

export const collectSceneTextures = (root: THREE.Object3D): Set<THREE.Texture> => {
    const textures = new Set<THREE.Texture>()

    root.traverse((object) => {
        const material = (object as THREE.Mesh).material
        if (!material) return
        if (Array.isArray(material)) material.forEach((m) => collectFromMaterial(m, textures))
        else collectFromMaterial(material, textures)
    })

    return textures
}

/** Uploads every texture in `root` to the GPU. Safe to call more than once. */
export const initSceneTextures = (gl: THREE.WebGLRenderer, root: THREE.Object3D) => {
    collectSceneTextures(root).forEach((texture) => {
        try {
            gl.initTexture(texture)
        } catch {
            // A texture whose image has not decoded yet is warmed by the
            // throwaway render below instead; never let it break the loader.
        }
    })
}

/**
 * Full prewarm: textures, then programs, then one render through the complete
 * chain. Resolves once the scene can be drawn without allocating anything.
 */
export const warmupScene = async (
    gl: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
) => {
    initSceneTextures(gl, scene)

    try {
        if (typeof gl.compileAsync === 'function') await gl.compileAsync(scene, camera)
        else gl.compile(scene, camera)
    } catch {
        // compileAsync rejects on a context loss; the render below still tries.
    }

    try {
        gl.render(scene, camera)
    } catch {
        // Nothing to draw yet — the scene's own loop takes over from here.
    }
}

/**
 * Warms a material that is about to replace one already on screen (the high-res
 * earth swap). Without this the assignment recompiles the program and uploads
 * its maps inside whatever frame happens to be running — a visible stall.
 */
export const warmupMaterial = async (
    gl: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    material: THREE.Material,
    geometry: THREE.BufferGeometry
) => {
    const textures = new Set<THREE.Texture>()
    collectFromMaterial(material, textures)
    textures.forEach((texture) => {
        try {
            gl.initTexture(texture)
        } catch {
            /* warmed by the compile below */
        }
    })

    // Compile against a throwaway mesh parented to the real scene, so the
    // program is built with the same lights, fog and environment it will run
    // under — a different light count would compile a different variant.
    const probe = new THREE.Mesh(geometry, material)
    probe.visible = false
    scene.add(probe)

    try {
        if (typeof gl.compileAsync === 'function') await gl.compileAsync(scene, camera)
        else gl.compile(scene, camera)
    } catch {
        /* context lost — the swap still works, just without the warm */
    } finally {
        scene.remove(probe)
    }
}
