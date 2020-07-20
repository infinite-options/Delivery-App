import { faComment, faEnvelope, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Icon } from "leaflet";
import HeadquartersIcon from "./headquarters.png";
import TruckIcon from "./truck.png";

const DefaultIcon = (color, width = 25, height = 41) => {
  // const markerHtmlStyles = `
  //   background-color: ${color};
  //   width: 3rem;
  //   height: 3rem;
  //   display: block;
  //   left: -1.5rem;
  //   top: -1.5rem;
  //   position: relative;
  //   border-radius: 3rem 3rem 0;
  //   transform: rotate(45deg);
  //   border: 1px solid #FFFFFF
  // `;

  return new Icon({
    // These google charts icons are a bit ugly, but are super customizable (color-wise), see if they have better looking ones?
    iconUrl: `http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=home|${color.substring(1)}&chf=a,s,ee00FFFF`,
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

export default { DefaultIcon, Truck, Headquarters, faComment, faEnvelope, faCaretDown, faCaretUp };
