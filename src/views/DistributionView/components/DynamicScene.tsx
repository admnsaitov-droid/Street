import dynamic from 'next/dynamic'
import { Location as DistributionLocation } from "../data/distributionData"

interface DynamicDistributionSceneProps {
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
    data?: any
}

const DistributionScene = dynamic(() => import('./Scene').then(mod => ({ default: mod.DistributionScene })), {
    ssr: false
})

export const DynamicDistributionScene = (props: DynamicDistributionSceneProps) => {
    return <DistributionScene {...props} />
}
