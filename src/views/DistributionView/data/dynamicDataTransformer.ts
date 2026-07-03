import { Location, Filter } from './distributionData'
import { getMediaStrapiPath } from '@/utils/getMediaStrapiPath'

// Interface for the dynamic data structure
export interface DynamicLocation {
  id: number
  continent: string
  countryText: string
  locationItem: string
  websiteItem: string
  centerName: string
  description: string
  scenePosition: {
    id: number
    x: number
    y: number
    z: number
  }
  fromRotation: {
    id: number
    x: number
    y: number
    z: number
  }
  toRotation: {
    id: number
    x: number
    y: number
    z: number
  }
  rotationAdjustment: {
    id: number
    x: number
    y: number
    z: number
  }
  button?: {
    id: number
    link: string
    text: string
  }
  images?: Array<{
    id: number
    url: string
    name: string
    alternativeText?: string
    caption?: string
    width: number
    height: number
    formats?: {
      thumbnail?: {
        url: string
        width: number
        height: number
      }
    }
  }>
  logo?: {
    id: number
    url: string
    name: string
    alternativeText?: string
    width: number
    height: number
  }
}

export interface DynamicDistributionData {
  distributionPage: {
    title: {
      textFirst: string
      textSecond: string
    }
    locations: DynamicLocation[]
    locationText: string
    websiteText: string
  }
}

// Helper function to convert continent to region
const continentToRegion = (continent: string): string => {
  const mapping: { [key: string]: string } = {
    'europe': 'Europe',
    'africa': 'Africa', 
    'america': 'America',
    'asia': 'Asia'
  }
  return mapping[continent.toLowerCase()] || 'Europe'
}

// Helper function to generate coordinates from location name (fallback)
const generateCoordinates = (locationItem: string): [number, number] => {
  // This is a simplified mapping - in a real implementation, you'd want to use a geocoding service
  const coordinateMap: { [key: string]: [number, number] } = {
    'Vienna, Austria': [48.2082, 16.3738],
    'Baku, Azerbaijan': [40.4093, 49.8671],
    'Manama, Bahrain': [26.0667, 50.5577],
    'Lochem, Netherlands': [52.1599, 6.4116],
    'Sofia, Bulgaria': [42.6977, 23.3219],
    'Skanderborg, Denmark': [56.0367, 9.9272],
    'Kaštel Novi, Croatia': [43.5500, 16.3833],
    'Sukorady, Czech Republic': [50.0755, 14.4378],
    'Cairo, Egypt': [30.0444, 31.2357],
    'Noisy-le-Grand, France': [48.8566, 2.3522],
    'Harju, Estonia': [59.4370, 24.7536],
    'Berlin, Germany': [52.5200, 13.4050],
    'Biharkeresztes; Hajdu-Bihar': [47.4979, 19.0402],
    'Tel Aviv, Israel': [32.0853, 34.7818],
    'Rome, Italy': [41.9028, 12.4964],
    'Riga, Latvia': [56.9496, 24.1052],
    'Valletta, Malta': [35.8989, 14.5146],
    'Mexico City, Mexico': [19.4326, -99.1332],
    'Casablanca, Morocco': [33.5731, -7.5898],
    'Oslo, Norway': [59.9139, 10.7522],
    'Lublin, Poland': [52.2297, 21.0122],
    'Doha, Qatar': [25.2854, 51.5310],
    'Riyadh, Saudi Arabia': [24.7136, 46.6753],
    'Valencia, Spain': [40.4168, -3.7038],
    'Helsingborg, Sweden': [59.3293, 18.0686],
    'Pfäffikon, Switzerland': [47.3769, 8.5417],
    'Taipei, Taiwan': [25.0330, 121.5654],
    'Abu Dhabi, UAE': [25.2048, 55.2708],
    'London, UK': [51.5074, -0.1278],
    'Wilmington, USA': [40.7128, -74.0060],
    'Victoria, Seychelles': [-4.6191, 55.4513],
    'San Juan, Puerto Rico': [18.4655, -66.1057],
    'Toronto, Canada': [43.6532, -79.3832],
    'Buenos Aires, Argentina': [-34.6118, -58.3960],
    'São Paulo, Brazil': [-23.5505, -46.6333],
    'Santiago, Chile': [-33.4489, -70.6693],
    'Lima, Peru': [-12.0464, -77.0428],
    'Bogotá, Colombia': [4.7110, -74.0721],
    'Seoul, South Korea': [37.5665, 126.9780],
    'Santo Domingo, Dominican Republic': [18.4861, -69.9312],
    'Tokyo, Japan': [35.6762, 139.6503]
  }
  
  return coordinateMap[locationItem] || [0, 0] // Default to [0, 0] if not found
}

// Helper function to get image URL from dynamic location
const getImageUrl = (dynamicLocation: DynamicLocation): string => {
  // Check if images exist and have at least one image
  if (dynamicLocation.images && dynamicLocation.images.length > 0) {
    const firstImage = dynamicLocation.images[0]
    // Use getMediaStrapiPath to properly handle Strapi media URLs
    return getMediaStrapiPath(firstImage)
  }
  
  // Fallback to mock images based on continent
  const mockImages: { [key: string]: string } = {
    'europe': '/distTest1.png',
    'africa': '/distTest2.png', 
    'america': '/distTest3.png',
    'asia': '/distTest1.png'
  }
  
  return mockImages[dynamicLocation.continent.toLowerCase()] || '/distTest1.png'
}

// Transform dynamic location to static location format
export const transformDynamicLocation = (dynamicLocation: DynamicLocation): Location => {
  const coordinates = generateCoordinates(dynamicLocation.locationItem)
  
  return {
    id: dynamicLocation.id.toString(),
    name: dynamicLocation.countryText,
    displayName: dynamicLocation.centerName,
    address: dynamicLocation.locationItem,
    websiteItem: dynamicLocation.websiteItem,
    coordinates,
    position: [
      dynamicLocation.scenePosition.x,
      dynamicLocation.scenePosition.y, 
      dynamicLocation.scenePosition.z
    ] as [number, number, number],
    targetRotation: [
      dynamicLocation.fromRotation.x,
      dynamicLocation.fromRotation.y,
      dynamicLocation.fromRotation.z
    ] as [number, number, number],
    country: dynamicLocation.countryText,
    region: continentToRegion(dynamicLocation.continent),
    description: dynamicLocation.description,
    image: getImageUrl(dynamicLocation),
    logo: dynamicLocation.logo ? getMediaStrapiPath(dynamicLocation.logo) : undefined
  }
}

// Transform dynamic data to static data format
export const transformDynamicData = (dynamicData: DynamicDistributionData): Filter[] => {
  const allLocations = dynamicData.distributionPage.locations.map(transformDynamicLocation)
  
  // Sort all locations alphabetically by countryText (name)
  allLocations.sort((a, b) => a.name.localeCompare(b.name))
  
  // Group locations by continent
  const locationsByContinent: { [key: string]: Location[] } = {}
  
  allLocations.forEach(location => {
    const continent = location.region.toLowerCase()
    if (!locationsByContinent[continent]) {
      locationsByContinent[continent] = []
    }
    locationsByContinent[continent].push(location)
  })
  
  // Sort locations within each continent alphabetically
  Object.keys(locationsByContinent).forEach(continent => {
    locationsByContinent[continent].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  // Create filter structure
  const filters: Filter[] = [
    {
      id: 'all',
      name: 'All',
      locations: allLocations
    }
  ]
  
  // Add continent-specific filters (sorted by continent name)
  Object.entries(locationsByContinent)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort continents alphabetically
    .forEach(([continent, locations]) => {
      const capitalizedContinent = continent.charAt(0).toUpperCase() + continent.slice(1)
      filters.push({
        id: continent,
        name: capitalizedContinent,
        locations
      })
    })
  
  return filters
}

// Helper function to get locations by filter from dynamic data
export const getDynamicLocationsByFilter = (dynamicData: DynamicDistributionData, filterId: string): Location[] => {
  const transformedData = transformDynamicData(dynamicData)
  const filter = transformedData.find(f => f.id === filterId)
  return filter ? filter.locations : []
}

// Helper function to get all locations from dynamic data
export const getAllDynamicLocations = (dynamicData: DynamicDistributionData): Location[] => {
  return dynamicData.distributionPage.locations.map(transformDynamicLocation)
}

// Helper function to get filter names from dynamic data
export const getDynamicFilterNames = (dynamicData: DynamicDistributionData): string[] => {
  const transformedData = transformDynamicData(dynamicData)
  return transformedData.map(filter => filter.name)
}
