import dynamic from 'next/dynamic'
import { PackageScene } from './PackageScene'

interface DynamicPackageSceneProps {
    packageType: 'large' | 'medium' | 'small'
}

export const DynamicPackageScene = ({ packageType }: DynamicPackageSceneProps) => {
    return <PackageScene packageType={packageType} />
}
