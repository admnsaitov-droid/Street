import dynamic from 'next/dynamic'

const ProductScene = dynamic(() => import('./ProductScene').then(mod => ({ default: mod.ProductScene })), {
    ssr: false
})

export { ProductScene as DynamicProductScene }
