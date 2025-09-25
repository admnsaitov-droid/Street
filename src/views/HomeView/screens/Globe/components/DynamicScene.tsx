import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./Scene').then(mod => ({ default: mod.Scene })), {
    ssr: false
})

export { Scene as DynamicScene }
