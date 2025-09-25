import dynamic from 'next/dynamic'

const PackageScene = dynamic(() => import('./PackageScene').then(mod => ({ default: mod.PackageScene })), {
    ssr: false
})

export { PackageScene as DynamicPackageScene }
