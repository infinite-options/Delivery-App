import L, { Icon } from "leaflet";
import Headquarters from "./headquarters.png";
import Truck from "./truck.png";

const DefaultIcon = (color, width = 25, height = 41) => {
  return new Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [width, height],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const CustomIcon = (icon, width = 32, height = 41) => {
  return new Icon({
    iconUrl: icon === "truck" ? Truck : Headquarters, // probably shouldn't do it like this, but problem for future me when i add more icons
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [width, height],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export default { DefaultIcon, CustomIcon };
