export const setGeolocateIcon = (location) => {
  // Active Geolocate Icon
  const activeIcon = document.querySelector(
    ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-active .mapboxgl-ctrl-icon"
  );

  // Unfocused Geolocate Icon
  const unfocusedIcon = document.querySelector(
    ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-background .mapboxgl-ctrl-icon"
  );

  // Inactive Geolocate Icon
  const inactiveIcon = document.querySelector(
    ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon"
  );

  const updateIconBackground = (icon, path) => {
    if (icon) {
      let newImage = "";
      let newSize = "";

      if (path === "/") {
        newImage = "url('/assets/accident.svg')";
        newSize = "20px 20px";
      } else if (path === "/rescuer/navigate") {
        newImage = "url('/assets/ambulance.png')";
        newSize = "15px 20px";
      }

      // Only update if the background image is different from the one we want to set
      if (icon.style.backgroundImage !== newImage) {
        icon.style.backgroundImage = newImage;
        icon.style.backgroundSize = newSize;
      }
    }
  };

  // Update the background images for each selector
  updateIconBackground(activeIcon, location.pathname);
  updateIconBackground(unfocusedIcon, location.pathname);
  updateIconBackground(inactiveIcon, location.pathname);
};
