'use client'

import { useEffect } from 'react'
import useAnimationStore, { SceneType } from '@/animationStore/animationStore'
import { isBot, canRenderWebGL } from '@/utils/isBot'

/**
 * Declares, from the view, that this page owns a 3D scene.
 *
 * The loader curtain reads the registry and stays up until the scene has
 * finished prewarming (see `useSceneReady`), so the GLTF parse, texture upload
 * and shader compile happen behind the curtain instead of on the first scroll.
 *
 * It has to be called from the view rather than from the scene component: the
 * scenes are `next/dynamic` chunks that mount well after the first commit, and
 * the curtain would otherwise find an empty registry and hand off early.
 *
 * @param sceneType which scene the page owns
 * @param enabled   false when the page renders no scene (e.g. a product with
 *                  no model in the CMS) — the curtain then waits for nothing
 */
export const useRequireScene = (sceneType: SceneType, enabled = true) => {
    const requireScene = useAnimationStore((state) => state.requireScene)
    const releaseScene = useAnimationStore((state) => state.releaseScene)

    useEffect(() => {
        // A bot never mounts the scene, and a client without usable WebGL can
        // never finish one — in both cases nothing would report it ready, so
        // the curtain would sit out its full cap and then reveal. Waiting for
        // something impossible is the one case where the gate is pure cost.
        if (!enabled || isBot() || !canRenderWebGL()) return

        requireScene(sceneType)
        return () => releaseScene(sceneType)
    }, [enabled, releaseScene, requireScene, sceneType])
}
