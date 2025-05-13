import { DirectionsRenderer } from "@react-google-maps/api";
import React from "react";

interface DirectionsLayerProps {
  directions: google.maps.DirectionsResult | null;
}

const DirectionsLayer: React.FC<DirectionsLayerProps> = ({ directions }) => {
  if (!directions) return null;
  return <DirectionsRenderer directions={directions} />;
};

export default DirectionsLayer;
