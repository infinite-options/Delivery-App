import React, { useState, useEffect } from "react";
import { Link, useRouteMatch, Redirect } from "react-router-dom";
import { Map, TileLayer, Marker, Popup, MapLayer } from "react-leaflet";
import { geolocated } from "react-geolocated";
import "./style.css";
import L, { Point } from "leaflet";
// use San Jose, CA as the default center
const DEFAULT_LATITUDE = 37.338208;
const DEFAULT_LONGITUDE = -121.886329;

class LeafletMap extends React.Component {
  render() {
    const locations = this.props.locations;
    const latitude = DEFAULT_LATITUDE;
    const longitude = DEFAULT_LONGITUDE;

    return (
      <Map center={[latitude, longitude]} zoom={11}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((route, index) => (
          <RouteMarker key={index} props={{ route, index }} />
        ))}
      </Map>
    );
  }
}

const RouteMarker = ({ props }) => {
  //   const [icon, setIcon] = useState(Icons.MarkerIcon("green"));

  return (
    <React.Fragment>
      {props.route.map((location, index) => (
        <Marker
          position={location}
          // icon={icon}
        ></Marker>
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
