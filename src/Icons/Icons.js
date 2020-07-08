import { Icon } from "leaflet";
import HeadquartersIcon from "./headquarters.png";
import TruckIcon from "./truck.png";

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
    iconUrl: icon,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [width, height],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const Truck = CustomIcon(TruckIcon);
const Headquarters = CustomIcon(HeadquartersIcon);

export default { DefaultIcon, Truck, Headquarters };
