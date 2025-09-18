import dynamic from 'next/dynamic'
import { SceneSkeleton } from '@/components/Skeleton/SceneSkeleton'

const PackageScene = dynamic(() => import('./PackageScene').then(mod => ({ default: mod.PackageScene })), {
    loading: () => <SceneSkeleton isLoading={true} />,
    ssr: false
})

export { PackageScene as DynamicPackageScene }
