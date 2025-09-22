export interface Location {
  id: string
  name: string
  displayName?: string // Optional display name for LocationCard title
  address: string
  email: string
  coordinates: [number, number] // [latitude, longitude]
  position: [number, number, number] // 3D position for tracker
  targetRotation: [number, number, number] // Target rotation for planet [x, y, z]
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
      // Europe
      {
        id: 'austria',
        name: 'Austria',
        displayName: 'Austrian Distribution Center',
        address: 'Vienna, Austria',
        email: 'austria@distributor.com',
        coordinates: [48.2082, 16.3738],
        position: [-2.23, 0.97, 3.08],
        targetRotation: [-0.2, -0.4, 0],
        country: 'Austria',
        region: 'Europe'
      },
      {
        id: 'benelux',
        name: 'Benelux',
        displayName: 'Benelux Regional Office',
        address: 'Brussels, Belgium',
        email: 'benelux@distributor.com',
        coordinates: [50.8503, 4.3517],
        position: [-2.46, 1.30, 2.77],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Belgium',
        region: 'Europe'
      },
      {
        id: 'bulgaria',
        name: 'Bulgaria',
        displayName: 'Bulgarian Distribution Hub',
        address: 'Sofia, Bulgaria',
        email: 'bulgaria@distributor.com',
        coordinates: [42.6977, 23.3219],
        position: [-1.80, 0.63, 3.43],
        targetRotation: [-0.1, -0.3, 0],
        country: 'Bulgaria',
        region: 'Europe'
      },
      {
        id: 'denmark',
        name: 'Denmark',
        displayName: 'Danish Distribution Center',
        address: 'Copenhagen, Denmark',
        email: 'denmark@distributor.com',
        coordinates: [55.6761, 12.5683],
        position: [-2.19, 1.47, 2.91],
        targetRotation: [-0.2, -0.1, 0],
        country: 'Denmark',
        region: 'Europe'
      },
      {
        id: 'croatia',
        name: 'Croatia',
        displayName: 'Croatian Distribution Hub',
        address: 'Zagreb, Croatia',
        email: 'croatia@distributor.com',
        coordinates: [45.8150, 15.9819],
        position: [-2.25, 0.76, 3.13],
        targetRotation: [-0.2, -0.3, 0],
        country: 'Croatia',
        region: 'Europe'
      },
      {
        id: 'czech-republic',
        name: 'Czech Republic',
        displayName: 'Czech Distribution Center',
        address: 'Prague, Czech Republic',
        email: 'czech@distributor.com',
        coordinates: [50.0755, 14.4378],
        position: [-2.06, 1.15, 3.15],
        targetRotation: [-0.2, -0.2, 0],
        country: 'Czech Republic',
        region: 'Europe'
      },
      {
        id: 'france',
        name: 'France',
        displayName: 'French Distribution Center',
        address: 'Paris, France',
        email: 'france@distributor.com',
        coordinates: [48.8566, 2.3522],
        position: [-2.70, 1.02, 2.66],
        targetRotation: [-0.3, -0.1, 0],
        country: 'France',
        region: 'Europe'
      },
      {
        id: 'estonia',
        name: 'Estonia',
        displayName: 'Estonian Distribution Hub',
        address: 'Tallinn, Estonia',
        email: 'estonia@distributor.com',
        coordinates: [59.4370, 24.7536],
        position: [-1.64, 1.60, 3.21],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Estonia',
        region: 'Europe'
      },
      {
        id: 'germany',
        name: 'Germany',
        displayName: 'German Distribution Center',
        address: 'Berlin, Germany',
        email: 'germany@distributor.com',
        coordinates: [52.5200, 13.4050],
        position: [-2.41, 1.10, 2.90],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Germany',
        region: 'Europe'
      },
      {
        id: 'hungary',
        name: 'Hungary',
        displayName: 'Hungarian Distribution Hub',
        address: 'Budapest, Hungary',
        email: 'hungary@distributor.com',
        coordinates: [47.4979, 19.0402],
        position: [-2.05, 0.85, 3.24],
        targetRotation: [-0.2, -0.3, 0],
        country: 'Hungary',
        region: 'Europe'
      },
      {
        id: 'italy',
        name: 'Italy',
        displayName: 'Italian Distribution Center',
        address: 'Rome, Italy',
        email: 'italy@distributor.com',
        coordinates: [41.9028, 12.4964],
        position: [-2.41, 0.70, 3.02],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Italy',
        region: 'Europe'
      },
      {
        id: 'latvia',
        name: 'Latvia',
        displayName: 'Latvian Distribution Hub',
        address: 'Riga, Latvia',
        email: 'latvia@distributor.com',
        coordinates: [56.9496, 24.1052],
        position: [-1.71, 1.48, 3.21],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Latvia',
        region: 'Europe'
      },
      {
        id: 'malta',
        name: 'Malta',
        displayName: 'Maltese Distribution Center',
        address: 'Valletta, Malta',
        email: 'malta@distributor.com',
        coordinates: [35.8989, 14.5146],
        position: [-2.43, 0.21, 3.07],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Malta',
        region: 'Europe'
      },
      {
        id: 'norway',
        name: 'Norway',
        displayName: 'Norwegian Distribution Center',
        address: 'Oslo, Norway',
        email: 'norway@distributor.com',
        coordinates: [59.9139, 10.7522],
        position: [-2.15, 1.74, 2.78],
        targetRotation: [-0.2, -0.1, 0],
        country: 'Norway',
        region: 'Europe'
      },
      {
        id: 'poland',
        name: 'Poland',
        displayName: 'Polish Distribution Center',
        address: 'Warsaw, Poland',
        email: 'poland@distributor.com',
        coordinates: [52.2297, 21.0122],
        position: [-1.89, 1.27, 3.21],
        targetRotation: [-0.2, -0.2, 0],
        country: 'Poland',
        region: 'Europe'
      },
      {
        id: 'spain',
        name: 'Spain',
        displayName: 'Spanish Distribution Center',
        address: 'Madrid, Spain',
        email: 'spain@distributor.com',
        coordinates: [40.4168, -3.7038],
        position: [-2.96, 0.77, 2.46],
        targetRotation: [-0.4, -0.1, 0],
        country: 'Spain',
        region: 'Europe'
      },
      {
        id: 'sweden',
        name: 'Sweden',
        displayName: 'Swedish Distribution Center',
        address: 'Stockholm, Sweden',
        email: 'sweden@distributor.com',
        coordinates: [59.3293, 18.0686],
        position: [-2.01, 1.61, 2.96],
        targetRotation: [-0.2, -0.1, 0],
        country: 'Sweden',
        region: 'Europe'
      },
      {
        id: 'switzerland',
        name: 'Switzerland',
        displayName: 'Swiss Distribution Center',
        address: 'Zurich, Switzerland',
        email: 'switzerland@distributor.com',
        coordinates: [47.3769, 8.5417],
        position: [-2.42, 0.91, 2.96],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Switzerland',
        region: 'Europe'
      },
      {
        id: 'uk',
        name: 'UK',
        displayName: 'UK Distribution Center',
        address: 'London, UK',
        email: 'uk@distributor.com',
        coordinates: [51.5074, -0.1278],
        position: [-2.60, 1.46, 2.55],
        targetRotation: [-0.3, -0.1, 0],
        country: 'United Kingdom',
        region: 'Europe'
      },

      // Africa
      {
        id: 'egypt',
        name: 'Egypt',
        displayName: 'Egyptian Distribution Hub',
        address: 'Cairo, Egypt',
        email: 'egypt@distributor.com',
        coordinates: [30.0444, 31.2357],
        position: [-1.66, -0.46, 3.53],
        targetRotation: [-0.1, -0.2, 0],
        country: 'Egypt',
        region: 'Africa'
      },
      {
        id: 'morocco',
        name: 'Morocco',
        displayName: 'Moroccan Distribution Hub',
        address: 'Casablanca, Morocco',
        email: 'morocco@distributor.com',
        coordinates: [33.5731, -7.5898],
        position: [-3.15, 0.34, 2.32],
        targetRotation: [-0.4, -0.1, 0],
        country: 'Morocco',
        region: 'Africa'
      },
      {
        id: 'seychelles',
        name: 'Seychelles',
        displayName: 'Seychelles Distribution Hub',
        address: 'Victoria, Seychelles',
        email: 'seychelles@distributor.com',
        coordinates: [-4.6191, 55.4513],
        position: [0.02, -2.47, 3.05],
        targetRotation: [0.0, -0.3, 0],
        country: 'Seychelles',
        region: 'Africa'
      },

      // America
      {
        id: 'mexico',
        name: 'Mexico',
        displayName: 'Mexican Distribution Center',
        address: 'Mexico City, Mexico',
        email: 'mexico@distributor.com',
        coordinates: [19.4326, -99.1332],
        position: [-2.08, 2.46, -2.24],
        targetRotation: [-0.3, 0.3, 0],
        country: 'Mexico',
        region: 'America'
      },
      {
        id: 'usa',
        name: 'USA',
        displayName: 'USA Distribution Center',
        address: 'New York, USA',
        email: 'usa@distributor.com',
        coordinates: [40.7128, -74.0060],
        position: [-2.39, 2.85, -1.25],
        targetRotation: [-0.3, 0.4, 0],
        country: 'United States',
        region: 'America'
      },
      {
        id: 'puerto-rico',
        name: 'Puerto-Rico',
        displayName: 'Puerto Rico Distribution Center',
        address: 'San Juan, Puerto Rico',
        email: 'puerto@distributor.com',
        coordinates: [18.4655, -66.1057],
        position: [-3.47, 1.37, -1.25],
        targetRotation: [-0.4, 0.2, 0],
        country: 'Puerto Rico',
        region: 'America'
      },
      {
        id: 'canada',
        name: 'Canada',
        displayName: 'Canadian Distribution Center',
        address: 'Toronto, Canada',
        email: 'canada@distributor.com',
        coordinates: [43.6532, -79.3832],
        position: [-2.02, 3.31, -0.67],
        targetRotation: [-0.3, 0.5, 0],
        country: 'Canada',
        region: 'America'
      },
      {
        id: 'argentina',
        name: 'Argentina',
        displayName: 'Argentine Distribution Hub',
        address: 'Buenos Aires, Argentina',
        email: 'argentina@distributor.com',
        coordinates: [-34.6118, -58.3960],
        position: [-2.89, -1.17, -2.38],
        targetRotation: [-0.4, -0.2, 0],
        country: 'Argentina',
        region: 'America'
      },
      {
        id: 'brasil',
        name: 'Brasil',
        displayName: 'Brazilian Distribution Center',
        address: 'São Paulo, Brazil',
        email: 'brasil@distributor.com',
        coordinates: [-23.5505, -46.6333],
        position: [-3.57, -0.70, -1.46],
        targetRotation: [-0.5, -0.1, 0],
        country: 'Brazil',
        region: 'America'
      },
      {
        id: 'chile',
        name: 'Chile',
        displayName: 'Chilean Distribution Center',
        address: 'Santiago, Chile',
        email: 'chile@distributor.com',
        coordinates: [-33.4489, -70.6693],
        position: [-2.60, -0.82, -2.82],
        targetRotation: [-0.4, -0.1, 0],
        country: 'Chile',
        region: 'America'
      },
      {
        id: 'peru',
        name: 'Peru',
        displayName: 'Peruvian Distribution Hub',
        address: 'Lima, Peru',
        email: 'peru@distributor.com',
        coordinates: [-12.0464, -77.0428],
        position: [-2.78, 0.23, -2.76],
        targetRotation: [-0.4, 0.0, 0],
        country: 'Peru',
        region: 'America'
      },
      {
        id: 'columbia',
        name: 'Columbia',
        displayName: 'Colombian Distribution Center',
        address: 'Bogotá, Colombia',
        email: 'columbia@distributor.com',
        coordinates: [4.7110, -74.0721],
        position: [-3.06, 0.81, -2.32],
        targetRotation: [-0.4, 0.1, 0],
        country: 'Colombia',
        region: 'America'
      },
      {
        id: 'dominican-republic',
        name: 'Dominican Republic',
        displayName: 'Dominican Distribution Center',
        address: 'Santo Domingo, Dominican Republic',
        email: 'dominican@distributor.com',
        coordinates: [18.4861, -69.9312],
        position: [-3.33, 1.55, -1.37],
        targetRotation: [-0.4, 0.2, 0],
        country: 'Dominican Republic',
        region: 'America'
      },

      // Asia
      {
        id: 'azerbaijan',
        name: 'Azerbaijan',
        displayName: 'Azerbaijan Distribution Hub',
        address: 'Baku, Azerbaijan',
        email: 'azerbaijan@distributor.com',
        coordinates: [40.4093, 49.8671],
        position: [-0.75, 0.50, 3.82],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Azerbaijan',
        region: 'Asia'
      },
      {
        id: 'bahrain',
        name: 'Bahrain',
        displayName: 'Bahrain Distribution Center',
        address: 'Manama, Bahrain',
        email: 'bahrain@distributor.com',
        coordinates: [26.0667, 50.5577],
        position: [-0.50, -0.42, 3.88],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Bahrain',
        region: 'Asia'
      },
      {
        id: 'israel',
        name: 'Israel',
        displayName: 'Israeli Distribution Center',
        address: 'Tel Aviv, Israel',
        email: 'israel@distributor.com',
        coordinates: [32.0853, 34.7818],
        position: [-1.40, -0.06, 3.67],
        targetRotation: [-0.2, 0.0, 0],
        country: 'Israel',
        region: 'Asia'
      },
      {
        id: 'qatar',
        name: 'Qatar',
        displayName: 'Qatari Distribution Hub',
        address: 'Doha, Qatar',
        email: 'qatar@distributor.com',
        coordinates: [25.2854, 51.5310],
        position: [-0.47, -0.49, 3.86],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Qatar',
        region: 'Asia'
      },
      {
        id: 'saudi-arabia',
        name: 'Saudi Arabia',
        displayName: 'Saudi Distribution Center',
        address: 'Riyadh, Saudi Arabia',
        email: 'saudi@distributor.com',
        coordinates: [24.7136, 46.6753],
        position: [-0.88, -0.49, 3.79],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Saudi Arabia',
        region: 'Asia'
      },
      {
        id: 'taiwan',
        name: 'Taiwan',
        displayName: 'Taiwanese Distribution Hub',
        address: 'Taipei, Taiwan',
        email: 'taiwan@distributor.com',
        coordinates: [25.0330, 121.5654],
        position: [2.91, 1.25, 2.32],
        targetRotation: [0.4, -0.2, 0],
        country: 'Taiwan',
        region: 'Asia'
      },
      {
        id: 'uae',
        name: 'UAE',
        displayName: 'UAE Distribution Center',
        address: 'Dubai, UAE',
        email: 'uae@distributor.com',
        coordinates: [25.2048, 55.2708],
        position: [-0.35, -0.61, 3.87],
        targetRotation: [-0.1, -0.1, 0],
        country: 'United Arab Emirates',
        region: 'Asia'
      },
      {
        id: 'south-korea',
        name: 'South Korea',
        displayName: 'Korean Distribution Center',
        address: 'Seoul, South Korea',
        email: 'korea@distributor.com',
        coordinates: [37.5665, 126.9780],
        position: [2.53, 2.03, 2.21],
        targetRotation: [0.3, -0.3, 0],
        country: 'South Korea',
        region: 'Asia'
      },
      {
        id: 'japan',
        name: 'Japan',
        displayName: 'Japanese Distribution Center',
        address: 'Tokyo, Japan',
        email: 'japan@distributor.com',
        coordinates: [35.6762, 139.6503],
        position: [2.66, 2.25, 1.88],
        targetRotation: [0.4, -0.3, 0],
        country: 'Japan',
        region: 'Asia'
      }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    locations: [
      {
        id: 'austria',
        name: 'Austria',
        displayName: 'Austrian Distribution Center',
        address: 'Vienna, Austria',
        email: 'austria@distributor.com',
        coordinates: [48.2082, 16.3738],
        position: [-2.23, 0.97, 3.08],
        targetRotation: [-0.2, -0.4, 0],
        country: 'Austria',
        region: 'Europe'
      },
      {
        id: 'benelux',
        name: 'Benelux',
        displayName: 'Benelux Regional Office',
        address: 'Brussels, Belgium',
        email: 'benelux@distributor.com',
        coordinates: [50.8503, 4.3517],
        position: [-2.46, 1.30, 2.77],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Belgium',
        region: 'Europe'
      },
      {
        id: 'bulgaria',
        name: 'Bulgaria',
        displayName: 'Bulgarian Distribution Hub',
        address: 'Sofia, Bulgaria',
        email: 'bulgaria@distributor.com',
        coordinates: [42.6977, 23.3219],
        position: [-1.80, 0.63, 3.43],
        targetRotation: [-0.1, -0.3, 0],
        country: 'Bulgaria',
        region: 'Europe'
      },
      {
        id: 'denmark',
        name: 'Denmark',
        displayName: 'Danish Distribution Center',
        address: 'Copenhagen, Denmark',
        email: 'denmark@distributor.com',
        coordinates: [55.6761, 12.5683],
        position: [-2.19, 1.47, 2.91],
        targetRotation: [-0.2, -0.1, 0],
        country: 'Denmark',
        region: 'Europe'
      },
      {
        id: 'croatia',
        name: 'Croatia',
        displayName: 'Croatian Distribution Hub',
        address: 'Zagreb, Croatia',
        email: 'croatia@distributor.com',
        coordinates: [45.8150, 15.9819],
        position: [-2.25, 0.76, 3.13],
        targetRotation: [-0.2, -0.3, 0],
        country: 'Croatia',
        region: 'Europe'
      },
      {
        id: 'czech-republic',
        name: 'Czech Republic',
        displayName: 'Czech Distribution Center',
        address: 'Prague, Czech Republic',
        email: 'czech@distributor.com',
        coordinates: [50.0755, 14.4378],
        position: [-2.06, 1.15, 3.15],
        targetRotation: [-0.2, -0.2, 0],
        country: 'Czech Republic',
        region: 'Europe'
      },
      {
        id: 'france',
        name: 'France',
        displayName: 'French Distribution Center',
        address: 'Paris, France',
        email: 'france@distributor.com',
        coordinates: [48.8566, 2.3522],
        position: [-2.70, 1.02, 2.66],
        targetRotation: [-0.3, -0.1, 0],
        country: 'France',
        region: 'Europe'
      },
      {
        id: 'estonia',
        name: 'Estonia',
        displayName: 'Estonian Distribution Hub',
        address: 'Tallinn, Estonia',
        email: 'estonia@distributor.com',
        coordinates: [59.4370, 24.7536],
        position: [-1.64, 1.60, 3.21],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Estonia',
        region: 'Europe'
      },
      {
        id: 'germany',
        name: 'Germany',
        displayName: 'German Distribution Center',
        address: 'Berlin, Germany',
        email: 'germany@distributor.com',
        coordinates: [52.5200, 13.4050],
        position: [-2.41, 1.10, 2.90],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Germany',
        region: 'Europe'
      },
      {
        id: 'hungary',
        name: 'Hungary',
        displayName: 'Hungarian Distribution Hub',
        address: 'Budapest, Hungary',
        email: 'hungary@distributor.com',
        coordinates: [47.4979, 19.0402],
        position: [-2.05, 0.85, 3.24],
        targetRotation: [-0.2, -0.3, 0],
        country: 'Hungary',
        region: 'Europe'
      },
      {
        id: 'italy',
        name: 'Italy',
        displayName: 'Italian Distribution Center',
        address: 'Rome, Italy',
        email: 'italy@distributor.com',
        coordinates: [41.9028, 12.4964],
        position: [-2.41, 0.70, 3.02],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Italy',
        region: 'Europe'
      },
      {
        id: 'latvia',
        name: 'Latvia',
        displayName: 'Latvian Distribution Hub',
        address: 'Riga, Latvia',
        email: 'latvia@distributor.com',
        coordinates: [56.9496, 24.1052],
        position: [-1.71, 1.48, 3.21],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Latvia',
        region: 'Europe'
      },
      {
        id: 'malta',
        name: 'Malta',
        displayName: 'Maltese Distribution Center',
        address: 'Valletta, Malta',
        email: 'malta@distributor.com',
        coordinates: [35.8989, 14.5146],
        position: [-2.43, 0.21, 3.07],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Malta',
        region: 'Europe'
      },
      {
        id: 'norway',
        name: 'Norway',
        displayName: 'Norwegian Distribution Center',
        address: 'Oslo, Norway',
        email: 'norway@distributor.com',
        coordinates: [59.9139, 10.7522],
        position: [-2.15, 1.74, 2.78],
        targetRotation: [-0.2, -0.1, 0],
        country: 'Norway',
        region: 'Europe'
      },
      {
        id: 'poland',
        name: 'Poland',
        displayName: 'Polish Distribution Center',
        address: 'Warsaw, Poland',
        email: 'poland@distributor.com',
        coordinates: [52.2297, 21.0122],
        position: [-1.89, 1.27, 3.21],
        targetRotation: [-0.2, -0.2, 0],
        country: 'Poland',
        region: 'Europe'
      },
      {
        id: 'spain',
        name: 'Spain',
        displayName: 'Spanish Distribution Center',
        address: 'Madrid, Spain',
        email: 'spain@distributor.com',
        coordinates: [40.4168, -3.7038],
        position: [-2.96, 0.77, 2.46],
        targetRotation: [-0.4, -0.1, 0],
        country: 'Spain',
        region: 'Europe'
      },
      {
        id: 'sweden',
        name: 'Sweden',
        displayName: 'Swedish Distribution Center',
        address: 'Stockholm, Sweden',
        email: 'sweden@distributor.com',
        coordinates: [59.3293, 18.0686],
        position: [-2.01, 1.61, 2.96],
        targetRotation: [-0.2, -0.1, 0],
        country: 'Sweden',
        region: 'Europe'
      },
      {
        id: 'switzerland',
        name: 'Switzerland',
        displayName: 'Swiss Distribution Center',
        address: 'Zurich, Switzerland',
        email: 'switzerland@distributor.com',
        coordinates: [47.3769, 8.5417],
        position: [-2.42, 0.91, 2.96],
        targetRotation: [-0.3, -0.2, 0],
        country: 'Switzerland',
        region: 'Europe'
      },
      {
        id: 'uk',
        name: 'UK',
        displayName: 'UK Distribution Center',
        address: 'London, UK',
        email: 'uk@distributor.com',
        coordinates: [51.5074, -0.1278],
        position: [-2.60, 1.46, 2.55],
        targetRotation: [-0.3, -0.1, 0],
        country: 'United Kingdom',
        region: 'Europe'
      }
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    locations: [
      {
        id: 'egypt',
        name: 'Egypt',
        displayName: 'Egyptian Distribution Hub',
        address: 'Cairo, Egypt',
        email: 'egypt@distributor.com',
        coordinates: [30.0444, 31.2357],
        position: [-1.66, -0.46, 3.53],
        targetRotation: [-0.1, -0.2, 0],
        country: 'Egypt',
        region: 'Africa'
      },
      {
        id: 'morocco',
        name: 'Morocco',
        displayName: 'Moroccan Distribution Hub',
        address: 'Casablanca, Morocco',
        email: 'morocco@distributor.com',
        coordinates: [33.5731, -7.5898],
        position: [-3.15, 0.34, 2.32],
        targetRotation: [-0.4, -0.1, 0],
        country: 'Morocco',
        region: 'Africa'
      },
      {
        id: 'seychelles',
        name: 'Seychelles',
        displayName: 'Seychelles Distribution Hub',
        address: 'Victoria, Seychelles',
        email: 'seychelles@distributor.com',
        coordinates: [-4.6191, 55.4513],
        position: [0.02, -2.47, 3.05],
        targetRotation: [0.0, -0.3, 0],
        country: 'Seychelles',
        region: 'Africa'
      }
    ]
  },
  {
    id: 'america',
    name: 'America',
    locations: [
      {
        id: 'mexico',
        name: 'Mexico',
        displayName: 'Mexican Distribution Center',
        address: 'Mexico City, Mexico',
        email: 'mexico@distributor.com',
        coordinates: [19.4326, -99.1332],
        position: [-2.08, 2.46, -2.24],
        targetRotation: [-0.3, 0.3, 0],
        country: 'Mexico',
        region: 'America'
      },
      {
        id: 'usa',
        name: 'USA',
        displayName: 'USA Distribution Center',
        address: 'New York, USA',
        email: 'usa@distributor.com',
        coordinates: [40.7128, -74.0060],
        position: [-2.39, 2.85, -1.25],
        targetRotation: [-0.3, 0.4, 0],
        country: 'United States',
        region: 'America'
      },
      {
        id: 'puerto-rico',
        name: 'Puerto-Rico',
        displayName: 'Puerto Rico Distribution Center',
        address: 'San Juan, Puerto Rico',
        email: 'puerto@distributor.com',
        coordinates: [18.4655, -66.1057],
        position: [-3.47, 1.37, -1.25],
        targetRotation: [-0.4, 0.2, 0],
        country: 'Puerto Rico',
        region: 'America'
      },
      {
        id: 'canada',
        name: 'Canada',
        displayName: 'Canadian Distribution Center',
        address: 'Toronto, Canada',
        email: 'canada@distributor.com',
        coordinates: [43.6532, -79.3832],
        position: [-2.02, 3.31, -0.67],
        targetRotation: [-0.3, 0.5, 0],
        country: 'Canada',
        region: 'America'
      },
      {
        id: 'argentina',
        name: 'Argentina',
        displayName: 'Argentine Distribution Hub',
        address: 'Buenos Aires, Argentina',
        email: 'argentina@distributor.com',
        coordinates: [-34.6118, -58.3960],
        position: [-2.89, -1.17, -2.38],
        targetRotation: [-0.4, -0.2, 0],
        country: 'Argentina',
        region: 'America'
      },
      {
        id: 'brasil',
        name: 'Brasil',
        displayName: 'Brazilian Distribution Center',
        address: 'São Paulo, Brazil',
        email: 'brasil@distributor.com',
        coordinates: [-23.5505, -46.6333],
        position: [-3.57, -0.70, -1.46],
        targetRotation: [-0.5, -0.1, 0],
        country: 'Brazil',
        region: 'America'
      },
      {
        id: 'chile',
        name: 'Chile',
        displayName: 'Chilean Distribution Center',
        address: 'Santiago, Chile',
        email: 'chile@distributor.com',
        coordinates: [-33.4489, -70.6693],
        position: [-2.60, -0.82, -2.82],
        targetRotation: [-0.4, -0.1, 0],
        country: 'Chile',
        region: 'America'
      },
      {
        id: 'peru',
        name: 'Peru',
        displayName: 'Peruvian Distribution Hub',
        address: 'Lima, Peru',
        email: 'peru@distributor.com',
        coordinates: [-12.0464, -77.0428],
        position: [-2.78, 0.23, -2.76],
        targetRotation: [-0.4, 0.0, 0],
        country: 'Peru',
        region: 'America'
      },
      {
        id: 'columbia',
        name: 'Columbia',
        displayName: 'Colombian Distribution Center',
        address: 'Bogotá, Colombia',
        email: 'columbia@distributor.com',
        coordinates: [4.7110, -74.0721],
        position: [-3.06, 0.81, -2.32],
        targetRotation: [-0.4, 0.1, 0],
        country: 'Colombia',
        region: 'America'
      },
      {
        id: 'dominican-republic',
        name: 'Dominican Republic',
        displayName: 'Dominican Distribution Center',
        address: 'Santo Domingo, Dominican Republic',
        email: 'dominican@distributor.com',
        coordinates: [18.4861, -69.9312],
        position: [-3.33, 1.55, -1.37],
        targetRotation: [-0.4, 0.2, 0],
        country: 'Dominican Republic',
        region: 'America'
      }
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    locations: [
      {
        id: 'azerbaijan',
        name: 'Azerbaijan',
        displayName: 'Azerbaijan Distribution Hub',
        address: 'Baku, Azerbaijan',
        email: 'azerbaijan@distributor.com',
        coordinates: [40.4093, 49.8671],
        position: [-0.75, 0.50, 3.82],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Azerbaijan',
        region: 'Asia'
      },
      {
        id: 'bahrain',
        name: 'Bahrain',
        displayName: 'Bahrain Distribution Center',
        address: 'Manama, Bahrain',
        email: 'bahrain@distributor.com',
        coordinates: [26.0667, 50.5577],
        position: [-0.50, -0.42, 3.88],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Bahrain',
        region: 'Asia'
      },
      {
        id: 'israel',
        name: 'Israel',
        displayName: 'Israeli Distribution Center',
        address: 'Tel Aviv, Israel',
        email: 'israel@distributor.com',
        coordinates: [32.0853, 34.7818],
        position: [-1.40, -0.06, 3.67],
        targetRotation: [-0.2, 0.0, 0],
        country: 'Israel',
        region: 'Asia'
      },
      {
        id: 'qatar',
        name: 'Qatar',
        displayName: 'Qatari Distribution Hub',
        address: 'Doha, Qatar',
        email: 'qatar@distributor.com',
        coordinates: [25.2854, 51.5310],
        position: [-0.47, -0.49, 3.86],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Qatar',
        region: 'Asia'
      },
      {
        id: 'saudi-arabia',
        name: 'Saudi Arabia',
        displayName: 'Saudi Distribution Center',
        address: 'Riyadh, Saudi Arabia',
        email: 'saudi@distributor.com',
        coordinates: [24.7136, 46.6753],
        position: [-0.88, -0.49, 3.79],
        targetRotation: [-0.1, -0.1, 0],
        country: 'Saudi Arabia',
        region: 'Asia'
      },
      {
        id: 'taiwan',
        name: 'Taiwan',
        displayName: 'Taiwanese Distribution Hub',
        address: 'Taipei, Taiwan',
        email: 'taiwan@distributor.com',
        coordinates: [25.0330, 121.5654],
        position: [2.91, 1.25, 2.32],
        targetRotation: [0.4, -0.2, 0],
        country: 'Taiwan',
        region: 'Asia'
      },
      {
        id: 'uae',
        name: 'UAE',
        displayName: 'UAE Distribution Center',
        address: 'Dubai, UAE',
        email: 'uae@distributor.com',
        coordinates: [25.2048, 55.2708],
        position: [-0.35, -0.61, 3.87],
        targetRotation: [-0.1, -0.1, 0],
        country: 'United Arab Emirates',
        region: 'Asia'
      },
      {
        id: 'south-korea',
        name: 'South Korea',
        displayName: 'Korean Distribution Center',
        address: 'Seoul, South Korea',
        email: 'korea@distributor.com',
        coordinates: [37.5665, 126.9780],
        position: [2.53, 2.03, 2.21],
        targetRotation: [0.3, -0.3, 0],
        country: 'South Korea',
        region: 'Asia'
      },
      {
        id: 'japan',
        name: 'Japan',
        displayName: 'Japanese Distribution Center',
        address: 'Tokyo, Japan',
        email: 'japan@distributor.com',
        coordinates: [35.6762, 139.6503],
        position: [2.66, 2.25, 1.88],
        targetRotation: [0.4, -0.3, 0],
        country: 'Japan',
        region: 'Asia'
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