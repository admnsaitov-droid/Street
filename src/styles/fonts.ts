export const fontOnest = (weight: number) => `
    \nfont-family: var(--font-onest);
    font-optical-sizing: auto;
    font-weight: ${weight};
    font-style: normal;\n
`

export const fontGolosText = (weight: number) => `
    \nfont-family: var(--font-golos-text);
    font-optical-sizing: auto;
    font-weight: ${weight};
    font-style: normal;\n
`

export const fontSageGrotesk = (weight: number) => `
    \nfont-family: var(--font-sage-grotesk);
    font-optical-sizing: auto;
    font-weight: ${weight};
    font-style: normal;\n
`

export const fonts = {
    fontOnest,
    fontGolosText,
    fontSageGrotesk
}