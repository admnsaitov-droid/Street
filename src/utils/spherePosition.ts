/**
 * Calculate a position on the surface of a sphere
 * @param radius - The radius of the sphere
 * @param latitude - Latitude in degrees (-90 to 90)
 * @param longitude - Longitude in degrees (-180 to 180)
 * @returns [x, y, z] position on the sphere surface
 */
export const getSpherePosition = (
  radius: number,
  latitude: number,
  longitude: number
): [number, number, number] => {
  // Convert degrees to radians
  const latRad = (latitude * Math.PI) / 180
  const lonRad = (longitude * Math.PI) / 180

  // Calculate position on sphere surface
  const x = radius * Math.cos(latRad) * Math.cos(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.sin(lonRad)

  return [x, y, z]
}

/**
 * Generate multiple random positions on a sphere surface
 * @param radius - The radius of the sphere
 * @param count - Number of positions to generate
 * @returns Array of [x, y, z] positions
 */
export const getRandomSpherePositions = (
  radius: number,
  count: number
): [number, number, number][] => {
  const positions: [number, number, number][] = []
  
  for (let i = 0; i < count; i++) {
    // Generate random latitude and longitude
    const latitude = (Math.random() - 0.5) * 180 // -90 to 90
    const longitude = (Math.random() - 0.5) * 360 // -180 to 180
    
    positions.push(getSpherePosition(radius, latitude, longitude))
  }
  
  return positions
}

/**
 * Generate specific positions on a sphere surface (useful for predefined locations)
 * @param radius - The radius of the sphere
 * @param coordinates - Array of [latitude, longitude] pairs
 * @returns Array of [x, y, z] positions
 */
export const getSpecificSpherePositions = (
  radius: number,
  coordinates: [number, number][]
): [number, number, number][] => {
  return coordinates.map(([lat, lon]) => getSpherePosition(radius, lat, lon))
}
