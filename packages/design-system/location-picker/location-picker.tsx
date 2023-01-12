import { useState, useRef, useCallback, useEffect } from "react";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

import { useControlledState } from "../utils/use-controlled-state";

type LocationPickerProps = {
  location?: { lat: number; lng: number };
  onLocationChange?: (location?: { lat: number; lng: number }) => void;
};

export const LocationPicker = (props: LocationPickerProps) => {
  const [location, setLocation] = useControlledState(
    props.location,
    center,
    props.onLocationChange
  );
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  const autocomplete = useRef<any>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete.current !== null) {
      setLocation(
        autocomplete.current.getPlace()?.geometry?.location?.toJSON()
      );
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  }, [setLocation]);

  useEffect(() => {
    if (map && location) {
      map.panTo(location);
    }
  }, [location, map]);

  return isLoaded && location ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={4}
      options={{
        disableDefaultUI: true,
      }}
      onLoad={setMap}
      onUnmount={() => setMap(null)}
    >
      <Marker
        position={location}
        draggable
        onDragEnd={(e) => {
          const location = e.latLng?.toJSON();
          if (location) {
            setLocation(location);
          }
        }}
      />

      <Autocomplete
        onLoad={(a) => (autocomplete.current = a)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Enter Location"
          autoFocus
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            height: `32px`,
            padding: `0 14px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
            marginTop: "10px",
            marginLeft: "10px",
          }}
        />
      </Autocomplete>
    </GoogleMap>
  ) : (
    <></>
  );
};

const containerStyle = {
  alignItems: "stretch",
  display: "flex",
  flexDirection: "column",
  flex: 1,
} as const;

const center = {
  lat: 64.9631,
  lng: 19.0208,
};
