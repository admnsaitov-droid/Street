# Google Maps Integration Setup

This document explains how to set up and use the Google Maps integration in your Next.js project.

## Prerequisites

1. **Google Cloud Platform Account**: You need a Google Cloud Platform (GCP) account
2. **Google Maps JavaScript API**: Enable the Google Maps JavaScript API in your GCP project
3. **API Key**: Generate an API key with the appropriate restrictions

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for Google Maps API)

### 2. Enable Google Maps JavaScript API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Maps JavaScript API"
3. Click on it and press "Enable"

### 3. Create an API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Recommended) Click "Restrict Key" to add restrictions:
   - **Application restrictions**: HTTP referrers (web sites)
   - Add your domain(s): `localhost:3000/*`, `yourdomain.com/*`
   - **API restrictions**: Restrict to "Maps JavaScript API"

### 4. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important**: Never commit your API key to version control. The `.env.local` file should be in your `.gitignore`.

## Usage

### Basic Usage

```tsx
import { ProjectsMap } from '@/views/ProjectsView/components/ProjectsMap'

export default function MyPage() {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ProjectsMap />
    </div>
  )
}
```

### Advanced Usage with Custom Props

```tsx
import { ProjectsMap } from '@/views/ProjectsView/components/ProjectsMap'

export default function MyPage() {
  const mapCenter = { lat: 40.7128, lng: -74.0060 } // New York City
  const mapMarkers = [
    {
      position: { lat: 40.7128, lng: -74.0060 },
      title: "New York City",
      content: "<h3>New York City</h3><p>The Big Apple!</p>"
    },
    {
      position: { lat: 40.7589, lng: -73.9851 },
      title: "Times Square",
      content: "<h3>Times Square</h3><p>The Crossroads of the World</p>"
    }
  ]

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ProjectsMap 
        center={mapCenter}
        zoom={13}
        markers={mapMarkers}
      />
    </div>
  )
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `{ lat: number; lng: number }` | `{ lat: 40.7128, lng: -74.0060 }` | Map center coordinates |
| `zoom` | `number` | `12` | Initial zoom level (1-20) |
| `markers` | `Array<MarkerData>` | `[]` | Array of markers to display |

### MarkerData Interface

```tsx
interface MarkerData {
  position: { lat: number; lng: number }
  title?: string
  content?: string // HTML content for info window
}
```

## Customization

### Map Styling

The component includes a custom dark theme. To modify the styling, edit the `mapStyles` array in `ProjectsMap.tsx`. You can:

1. Use [Google Maps Style Wizard](https://mapstyle.withgoogle.com/) to generate custom styles
2. Use [Snazzy Maps](https://snazzymaps.com/) for pre-made themes
3. Manually edit the `mapStyles` array

### Map Controls

The component includes these controls by default:
- Zoom control: ✅ Enabled
- Map type control: ❌ Disabled
- Scale control: ✅ Enabled
- Street View control: ❌ Disabled
- Rotate control: ❌ Disabled
- Fullscreen control: ✅ Enabled

To modify controls, edit the map options in the `ProjectsMap.tsx` component.

## Troubleshooting

### Common Issues

1. **"Google Maps API key is not configured"**
   - Make sure you've added `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your `.env.local`
   - Restart your development server after adding environment variables

2. **"RefererNotAllowedMapError"**
   - Add your domain to the API key restrictions in Google Cloud Console
   - For development, add `localhost:3000/*`

3. **"This page can't load Google Maps correctly"**
   - Check if billing is enabled on your Google Cloud project
   - Verify the API key has the correct permissions
   - Check the browser console for specific error messages

4. **Map not loading**
   - Check your internet connection
   - Verify the API key is correct
   - Check the browser console for JavaScript errors

### API Costs

Google Maps JavaScript API has a pay-as-you-go pricing model:
- First 28,000 map loads per month are free
- After that, it's $7 per 1,000 additional requests
- Set up billing alerts to monitor usage

## Security Best Practices

1. **Restrict your API key**: Always add application and API restrictions
2. **Use environment variables**: Never hardcode API keys in your source code
3. **Monitor usage**: Set up billing alerts and quotas
4. **Rotate keys**: Periodically rotate your API keys

## Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
