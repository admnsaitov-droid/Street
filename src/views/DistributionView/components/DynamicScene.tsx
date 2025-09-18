import dynamic from 'next/dynamic'
import { SceneSkeleton } from '@/components/Skeleton/SceneSkeleton'
import { Location as DistributionLocation } from "../data/distributionData"

interface DynamicDistributionSceneProps {
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation) => void
    selectedLocation?: DistributionLocation | null
}

const DistributionScene = dynamic(() => import('./Scene').then(mod => ({ default: mod.DistributionScene })), {
    loading: () => <SceneSkeleton isLoading={true} />,
    ssr: false
})

export const DynamicDistributionScene = (props: DynamicDistributionSceneProps) => {
    return <DistributionScene {...props} />
}
