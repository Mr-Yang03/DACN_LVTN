// Google Maps API loader
import { useLoadScript, Libraries } from '@react-google-maps/api';

// Define the libraries we want to use
const libraries: Libraries = ["places"];

// Default options for loading the Google Maps API
export const defaultLoadScriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
  libraries,
  id: 'google-maps-script' // Consistent ID prevents multiple script tags
};

// A hook that provides consistent Google Maps API loading across the application
export function useGoogleMapsScript(options: typeof defaultLoadScriptOptions = defaultLoadScriptOptions) {
  return useLoadScript(options);
}
