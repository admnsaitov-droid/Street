'use client'

import { useEffect } from 'react'
import useAnimationStore, { SceneType } from '@/animationStore/animationStore'

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
        if (!enabled) return

        requireScene(sceneType)
        return () => releaseScene(sceneType)
    }, [enabled, releaseScene, requireScene, sceneType])
}
