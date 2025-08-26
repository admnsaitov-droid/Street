import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { ProductModel } from "./components/ProductModel"
import { OrbitControls } from "@react-three/drei"

export const ProductScene = () => {
    return (
        <StyledCanvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 1, 1]} intensity={10} />
            <directionalLight position={[-1, -1, -1]} intensity={10} />
            <OrbitControls enableZoom={false} />
            <ProductModel model="/models/productModel.glb" params={{
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: 1.4
            }} />
        </StyledCanvas>
    )
}

const StyledCanvas = styled(Canvas)`
    width: 100%;
    height: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: grab;
    background-color: #F8F9FC;
`