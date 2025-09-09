export interface Location {
  id: string
  name: string
  address: string
  email: string
  coordinates: [number, number] // [latitude, longitude]
  position: [number, number, number] // 3D position for tracker
  country: string
  region: string
}

export interface Filter {
  id: string
  name: string
  locations: Location[]
}

export const distributionData: Filter[] = [
  {
    id: 'all',
    name: 'All',
    locations: [
      {
        id: 'barzflex-austria',
        name: 'BARZFLEX',
        address: 'Sparbach 80, 2393 Sparbach, Österreich',
        email: 'david.jandrisevits@barzflex.com',
        coordinates: [48.2082, 16.3738],
        position: [1.3, 0.6, 3.35],
        country: 'Austria',
        region: 'Europe'
      },
      {
        id: 'location-2',
        name: 'Distribution Center 2',
        address: '123 Main St, New York, NY 10001, USA',
        email: 'contact@location2.com',
        coordinates: [40.7128, -74.0060],
        position: [-0.5, 1.6, 3.25],
        country: 'United States',
        region: 'America'
      },
      {
        id: 'location-3',
        name: 'Distribution Center 3',
        address: '456 Business Ave, Tokyo, Japan',
        email: 'info@location3.jp',
        coordinates: [35.6762, 139.6503],
        position: [0.3, 1, 3.49],
        country: 'Japan',
        region: 'Asia'
      },
      {
        id: 'location-4',
        name: 'Distribution Center 4',
        address: '789 Industrial Blvd, Lagos, Nigeria',
        email: 'support@location4.ng',
        coordinates: [6.5244, 3.3792],
        position: [0.8, -0.3, 3.2],
        country: 'Nigeria',
        region: 'Africa'
      },
      {
        id: 'location-5',
        name: 'Distribution Center 5',
        address: '321 Commerce St, São Paulo, Brazil',
        email: 'sales@location5.com.br',
        coordinates: [-23.5505, -46.6333],
        position: [-1.2, -0.8, 3.1],
        country: 'Brazil',
        region: 'America'
      },
      {
        id: 'location-6',
        name: 'Distribution Center 6',
        address: '654 Trade Ave, Berlin, Germany',
        email: 'info@location6.de',
        coordinates: [52.5200, 13.4050],
        position: [0.9, 1.2, 3.4],
        country: 'Germany',
        region: 'Europe'
      }
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    locations: [
      {
        id: 'location-4',
        name: 'Distribution Center 4',
        address: '789 Industrial Blvd, Lagos, Nigeria',
        email: 'support@location4.ng',
        coordinates: [6.5244, 3.3792],
        position: [0.8, -0.3, 3.2],
        country: 'Nigeria',
        region: 'Africa'
      },
      {
        id: 'location-7',
        name: 'Distribution Center 7',
        address: '987 Market St, Cairo, Egypt',
        email: 'contact@location7.eg',
        coordinates: [30.0444, 31.2357],
        position: [1.1, 0.2, 3.3],
        country: 'Egypt',
        region: 'Africa'
      }
    ]
  },
  {
    id: 'america',
    name: 'America',
    locations: [
      {
        id: 'location-2',
        name: 'Distribution Center 2',
        address: '123 Main St, New York, NY 10001, USA',
        email: 'contact@location2.com',
        coordinates: [40.7128, -74.0060],
        position: [-0.5, 1.6, 3.25],
        country: 'United States',
        region: 'America'
      },
      {
        id: 'location-5',
        name: 'Distribution Center 5',
        address: '321 Commerce St, São Paulo, Brazil',
        email: 'sales@location5.com.br',
        coordinates: [-23.5505, -46.6333],
        position: [-1.2, -0.8, 3.1],
        country: 'Brazil',
        region: 'America'
      },
      {
        id: 'location-8',
        name: 'Distribution Center 8',
        address: '555 Business Park, Toronto, Canada',
        email: 'info@location8.ca',
        coordinates: [43.6532, -79.3832],
        position: [-0.2, 1.4, 3.15],
        country: 'Canada',
        region: 'America'
      }
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    locations: [
      {
        id: 'location-3',
        name: 'Distribution Center 3',
        address: '456 Business Ave, Tokyo, Japan',
        email: 'info@location3.jp',
        coordinates: [35.6762, 139.6503],
        position: [0.3, 1, 3.49],
        country: 'Japan',
        region: 'Asia'
      },
      {
        id: 'location-9',
        name: 'Distribution Center 9',
        address: '888 Industrial Zone, Shanghai, China',
        email: 'contact@location9.cn',
        coordinates: [31.2304, 121.4737],
        position: [0.6, 0.9, 3.45],
        country: 'China',
        region: 'Asia'
      },
      {
        id: 'location-10',
        name: 'Distribution Center 10',
        address: '777 Trade Center, Mumbai, India',
        email: 'support@location10.in',
        coordinates: [19.0760, 72.8777],
        position: [0.4, 0.1, 3.25],
        country: 'India',
        region: 'Asia'
      }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    locations: [
      {
        id: 'barzflex-austria',
        name: 'BARZFLEX',
        address: 'Sparbach 80, 2393 Sparbach, Österreich',
        email: 'david.jandrisevits@barzflex.com',
        coordinates: [48.2082, 16.3738],
        position: [1.3, 0.6, 3.35],
        country: 'Austria',
        region: 'Europe'
      },
      {
        id: 'location-6',
        name: 'Distribution Center 6',
        address: '654 Trade Ave, Berlin, Germany',
        email: 'info@location6.de',
        coordinates: [52.5200, 13.4050],
        position: [0.9, 1.2, 3.4],
        country: 'Germany',
        region: 'Europe'
      },
      {
        id: 'location-11',
        name: 'Distribution Center 11',
        address: '999 Business Plaza, London, UK',
        email: 'contact@location11.co.uk',
        coordinates: [51.5074, -0.1278],
        position: [0.7, 1.1, 3.3],
        country: 'United Kingdom',
        region: 'Europe'
      }
    ]
  }
]

// Helper function to get locations by filter
export const getLocationsByFilter = (filterId: string): Location[] => {
  const filter = distributionData.find(f => f.id === filterId)
  return filter ? filter.locations : []
}

// Helper function to get all unique locations (for "All" filter)
export const getAllLocations = (): Location[] => {
  return distributionData.find(f => f.id === 'all')?.locations || []
}

// Helper function to get filter names
export const getFilterNames = (): string[] => {
  return distributionData.map(filter => filter.name)
}
