/**
 * The Draco decoder is served from this project's own static root, not from
 * Google's CDN (which is drei's default and was hardcoded in both PlanetModels).
 * A third-party round-trip in front of the decoder delays every compressed
 * model on the page before a single triangle can be decoded.
 *
 * The files come from `three/examples/jsm/libs/draco/gltf` and must be kept in
 * step with the installed `three` version.
 */
export const DRACO_DECODER_PATH = '/draco/'
