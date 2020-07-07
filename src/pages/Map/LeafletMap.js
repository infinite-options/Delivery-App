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
          <RouteMarker
            key={index}
            props={{ route, index, baseLocation: [latitude, longitude] }}
          />
        ))}
      </Map>
    );
  }
}

const RouteMarker = ({ props }) => {
  const [coords, setCoords] = useState([]);
  const [driverLocation, setDriverLocation] = useState(props.baseLocation); // useState(CURRENT_DRIVER_LOCATION ? CURRENT_DRIVER_LOCATION : props.baseLocation)
  const [destination, setDestination] = useState(1); // useState(CURRENT_DRIVER_DESTINATION ? CURRENT_DRIVER_DESTINATION : props.baseLocation)

  useEffect(() => {
    let latlngs = [];
    for (let location of props.route) {
      latlngs.push([location["from"], location["to"]]);
    }
    const temp = latlngs[destination - 1][1];
    latlngs[destination - 1][1] = driverLocation;
    const driverCoord = [driverLocation, temp];
    latlngs.splice(destination, 0, driverCoord);
    setCoords([...latlngs]);
  }, []);

  const handleDriverLocation = () => {
    // console.log(coords);
    // console.log(driverLocation);
    let tempCoords = [...coords];
    tempCoords[destination - 1][1] = [40.5, -119.5]; // = driverLocation
    tempCoords[destination][0] = [40.5, -119.5]; // = driverLocation
    setCoords(tempCoords);
  };

  const handleDelivery = () => {
    setDestination(++destination);

    if (destination === props.route.length) console.log("Final Destination");
  };

  // console.log(props.route);
  // console.log(coords);

  return (
    <React.Fragment>
      {coords.map((location, index) => (
        <Marker
          key={index}
          position={location[1]}
          icon={
            destination > index
              ? destination === index + 1
                ? blueIcon
                : greenIcon
              : redIcon
          }
        ></Marker>
      ))}
      {coords.map((location, index) => {
        // console.log(index, location);
        return (
          <Polyline
            key={index}
            positions={[location[0], location[1]]}
            color={destination > index ? "green" : "red"}
          />
        );
      })}
      <button onClick={handleDriverLocation}>HI</button>
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
