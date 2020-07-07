import React, { useState, useEffect } from "react";
import { Link, useRouteMatch, Redirect } from "react-router-dom";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  MapLayer,
  Polyline,
} from "react-leaflet";
import { geolocated } from "react-geolocated";
import "./style.css";
import L, { Point } from "leaflet";
// use San Jose, CA as the default center
const DEFAULT_LATITUDE = 37.338208;
const DEFAULT_LONGITUDE = -121.886329;

const Icons = L.Icon.extend({
  options: {
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  },
});
const greenIcon = new Icons({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
});
const redIcon = new Icons({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
});
const blueIcon = new Icons({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
});

class LeafletMap extends React.Component {
  render() {
    const locations = this.props.locations;
    const baseLocation = locations[0][0]["from"];
    const latitude = baseLocation ? baseLocation[0] : DEFAULT_LATITUDE;
    const longitude = baseLocation ? baseLocation[1] : DEFAULT_LONGITUDE;

    return (
      <Map center={[latitude, longitude]} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={baseLocation} />
        {locations.map((route, index) => (
          <RouteMarker key={index} props={{ route, index }} />
        ))}
      </Map>
    );
  }
}

const RouteMarker = ({ props }) => {
  let coords = [];
  for (let location of props.route) {
    coords.push([location["from"], location["to"]]);
  }
  const [latlngs, setLatlngs] = useState([...coords]);
  const [driverLocation, setDriverLocation] = useState([0, 0]);
  // for determining which destination driver is going to. will probably splice the driver's
  // coordinates as they drive, based on their destination.
  // initially: `latlngs.splice(destination, 0, driverLocation)`
  // during: `latlngs[destination] = driverLocation`
  // then, whenever driver completes the delivery, do
  // `setDestination(++destination)`
  // until their last destination
  const [destination, setDestination] = useState(1);

  //   const [icon, setIcon] = useState(Icons.MarkerIcon("green"));
  // console.log(props.route);
  console.log(latlngs);

  return (
    <React.Fragment>
      {coords.map((location, index) => (
        <Marker
          key={index}
          position={location[1]}
          icon={
            destination >= index + 1
              ? destination === index + 1
                ? blueIcon
                : greenIcon
              : redIcon
          }
        ></Marker>
      ))}
      {latlngs.map((coords, index) => (
        <Polyline
          key={index}
          positions={coords}
          color={destination >= index + 1 ? "green" : "red"}
        />
      ))}
    </React.Fragment>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  watchPosition: true,
  userDecisionTimeout: 10000, // determines how much time (in miliseconds) we
  // give the user to make the decision whether to allow to share their location or not
})(LeafletMap);
