import dynamic from 'next/dynamic'
import { SceneSkeleton } from '@/components/Skeleton/SceneSkeleton'

const Scene = dynamic(() => import('./Scene').then(mod => ({ default: mod.Scene })), {
    loading: () => <SceneSkeleton isLoading={true} />,
    ssr: false
})

export { Scene as DynamicScene }
