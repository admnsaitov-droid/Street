import dynamic from 'next/dynamic'
import { SceneSkeleton } from '@/components/Skeleton/SceneSkeleton'

const ProductScene = dynamic(() => import('./ProductScene').then(mod => ({ default: mod.ProductScene })), {
    loading: () => <SceneSkeleton isLoading={true} />,
    ssr: false
})

export { ProductScene as DynamicProductScene }
