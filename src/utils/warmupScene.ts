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

/**
 * Uploads one texture, and **says so when it cannot**.
 *
 * This used to be a silent `catch {}`, which hid a prewarm that was not running
 * at all — the uploads simply happened later, on the first frame that sampled
 * them, which is the stall the prewarm exists to prevent. A prewarm that fails
 * quietly is worse than no prewarm, because it reads as success.
 */
const initTextureOrWarn = (gl: THREE.WebGLRenderer, texture: THREE.Texture) => {
    try {
        gl.initTexture(texture)
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[warmupScene] initTexture failed — this upload will stall a frame later', texture, error)
        }
    }
}

/** Yields to the browser so the loader's own animation gets a frame. */
const nextFrame = () =>
    new Promise<void>((resolve) => {
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve())
        else setTimeout(resolve, 0)
    })

/**
 * Uploads every texture in `root` to the GPU, **one per frame**.
 *
 * Uploading them back to back is a single long task — four 2048² maps measured
 * ~600ms — and it runs while the loader is on screen, so the curtain's logo
 * animation visibly hitches. One upload per frame keeps each task short enough
 * that the animation keeps running; the total is the same, and it is still
 * finished before the curtain lifts because the curtain waits for it.
 */
export const initSceneTextures = async (gl: THREE.WebGLRenderer, root: THREE.Object3D) => {
    const textures = Array.from(collectSceneTextures(root))

    for (const texture of textures) {
        initTextureOrWarn(gl, texture)
        await nextFrame()
    }
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
    await initSceneTextures(gl, scene)

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

