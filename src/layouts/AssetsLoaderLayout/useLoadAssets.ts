import React from "react";

interface Params {
    images?: string[]
    videos?: string[]
    path?: string
}
export const useLoadAssets = (
    { 
        images,
        videos, 
        path
    }: Params = { images: [], videos: [], path: '/' },
    callback?: () => void,
): [boolean, number, string] => {
    const [loading, setLoading] = React.useState(true)
    const [progress, setProgress] = React.useState(0)
    const [currentFile, setCurrentFile] = React.useState("")
    const mounted = React.useRef(false)
    React.useEffect(() => {
        if (mounted.current) { return }
        mounted.current = true

        callback && callback()

        const assets = [...(images || []), /*...fonts,*/ ...(videos || [])];

        const loadAssets = async () => {
            let loadedCount = 0;
            
            const assetPromises = assets.map(
                (asset, index) =>
                    new Promise((resolve, reject) => {
                        let element;
        
                        if (images?.includes(asset)) {
                            element = new Image();
                            element.loading = 'eager'; // Force immediate loading
                            element.decoding = 'async'; // Non-blocking decode
                            element.src = `${path || '/'}${asset}`;
                        } else /* if (videos.includes(asset)) */ {
                            element = document.createElement("video");
                            element.preload = 'metadata'; // Only load metadata initially
                            element.src = `${path || '/'}${asset}`;
                            element.oncanplaythrough = () => {
                                loadedCount++;
                                setCurrentFile(asset);
                                setProgress((loadedCount / assets.length) * 100);
                                resolve(undefined);
                            };
                            element.onerror = reject;
                            return; // Early return for videos
                        }
        
                        element.onload = () => {
                            loadedCount++;
                            setCurrentFile(asset);
                            setProgress((loadedCount / assets.length) * 100);
                            resolve(undefined);
                        };
                        element.onerror = () => {
                            console.warn(`Failed to load asset: ${asset}`);
                            loadedCount++; // Still count as processed
                            setProgress((loadedCount / assets.length) * 100);
                            resolve(undefined); // Don't reject, just continue
                        };
                    })
            );
        
            await Promise.allSettled(assetPromises); // Use allSettled to handle failures gracefully
            setProgress(100);
            setLoading(false);
        }
        loadAssets()
    }, [])

    return [loading, progress, currentFile]
}