import dynamic from 'next/dynamic'
import { PackageScene } from './PackageScene'

interface DynamicPackageSceneProps {
    packageType: 'large' | 'medium' | 'small'
    packageModelPath: string
}

export const DynamicPackageScene = ({ packageType, packageModelPath }: DynamicPackageSceneProps) => {
    return <PackageScene packageType={packageType} packageModelPath={packageModelPath} />
}
