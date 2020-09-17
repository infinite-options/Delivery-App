import { 
  faComment, faEnvelope, faPhone, faCaretDown, faCaretUp, 
  faBars, faChevronLeft, faChevronRight, faEye, faEyeSlash, 
  faCheck, faTimes, faPlus, faSort, faSortUp, faSortDown, faTrash 
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from "leaflet";
import AppIcon from "./app_icon.png";
import HeadquartersIcon from "./headquarters.png";
import TruckIcon from "./truck.png";

const DefaultIcon = (color, {width=25, height=41, mult=1} = {}) => {
  let w = width * mult;
  let h = height * mult;
  return new Icon({
    // These google charts icons are a bit ugly, but are super customizable (color-wise), see if they have better looking ones?
    iconUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=home|${color.substring(1)}&chf=a,s,ee00FFFF`,
    shadowUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_shadow&chf=a,s,52B55233`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [1, h * -1.4],
    shadowSize: [h, h],
  });
};

const CustomIcon = (icon, {width=32, height=41} = {}) => {
  let w = width;
  let h = height;

  return new Icon({
    iconUrl: icon,
    shadowUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_shadow&chf=a,s,52B55233`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [1, h * -1.4],
    shadowSize: [h, h],
  });
};

const App = CustomIcon(AppIcon);
const Truck = CustomIcon(TruckIcon);
const Headquarters = CustomIcon(HeadquartersIcon);

export default { 
  DefaultIcon, App, Truck, Headquarters, 
  faComment, faEnvelope, faPhone, faCaretDown, faCaretUp, 
  faBars, faChevronLeft, faChevronRight, faEye, faEyeSlash, 
  faCheck, faTimes, faPlus, faSort, faSortUp, faSortDown, faTrash 
};
