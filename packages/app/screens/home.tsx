import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { useTrackPageViewed } from "app/lib/analytics";

import { LocationPicker } from "design-system/location-picker";

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });

  return (
    <View
      style={{
        paddingTop: 80,
        width: "100%",
        flex: 1,
        height: "100%",
      }}
    >
      <LocationPicker onLocationChange={(l) => console.log(l)} />
    </View>
  );
});

export { HomeScreen };
