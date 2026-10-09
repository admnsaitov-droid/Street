'use client'

import { createContext, useContext } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'

/**
 * The robot form of a page (crawlers and lab tools — Googlebot, Lighthouse,
 * PageSpeed): the same content at rest. No loader curtain, every reveal at its
 * end state, the 3D scene as a still. `src/middleware.ts` sends bot user agents
 * to `/[locale]/robot-view/[device]` and serves that document without its
 * scripts, so everything here must be right in the **server** render — nothing
 * on the robot form ever hydrates. People never see this route (ADR-0121).
 */
export const ROBOT_SEGMENT = 'robot-view'

export type RobotMode = false | 'desktop' | 'phone'

const RobotContext = createContext<RobotMode>(false)

/**
 * Lives in the `[locale]` layout. The layout can't see its page, but its
 * client children can: the selected segments below it are
 * `['robot-view', 'phone' | 'desktop']` on the robot form, during SSR too.
 */
export const RobotProvider = ({ children }: { children: React.ReactNode }) => {
    const segments = useSelectedLayoutSegments()
    const mode: RobotMode = segments[0] === ROBOT_SEGMENT
        ? (segments[1] === 'phone' ? 'phone' : 'desktop')
        : false

    return <RobotContext.Provider value={mode}>{children}</RobotContext.Provider>
}

/** `false` for people; `'desktop'` / `'phone'` on the robot form. */
export const useRobot = (): RobotMode => useContext(RobotContext)

/**
 * `useMounted()` + `useWindowWidth()` as the robot form needs them. Width-gated
 * markup renders the wide layout until mount; the robot form never mounts, so
 * its phone document asks for the phone layout here instead.
 */
export const useRobotViewport = (mounted: boolean, width: number) => {
    const robot = useRobot()
    if (robot === 'phone') return { mounted: true, width: 390 }
    return { mounted, width }
}
