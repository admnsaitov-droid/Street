export const getMediaStrapiPath = (media: any) => {
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${media?.url}`;
}