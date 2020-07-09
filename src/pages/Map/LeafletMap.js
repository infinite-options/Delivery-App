import React, { useState, useEffect } from "react";
import { Link, useRouteMatch, Redirect } from "react-router-dom";
import "./style.css";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  MapLayer,
  Polyline,
} from "react-leaflet";
import { geolocated } from "react-geolocated";
import Icons from "Icons/Icons";
import L, { Point } from "leaflet";
// use San Jose, CA as the default center
const DEFAULT_LATITUDE = 37.338208;
const DEFAULT_LONGITUDE = -121.886329;

class LeafletMap extends React.Component {
  render() {
    const locations = this.props.locations;
    const baseLocation = locations[0][0]["from"];
    const latitude = baseLocation ? baseLocation[0] : DEFAULT_LATITUDE;
    const longitude = baseLocation ? baseLocation[1] : DEFAULT_LONGITUDE;

    // FIXME: this deletes markers in unloaded tiles forever
    const handleMapUpdate = (e) => {
      // console.log(e.target.getBounds());
      const map = e.target;
      // const mapBounds = map.getBounds();
      let markers = [];
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) markers.push(layer);
      });
      manageMarkers(map, markers);
    };

    const manageMarkers = (map, markers) => {
      for (let i = markers.length - 1; i >= 0; i--) {
        const marker = markers[i];
        const mapBounds = map.getBounds();
        const isVisible = mapBounds.contains(marker.getLatLng());
        if (marker._icon && !isVisible) map.removeLayer(marker);
        else if (!marker.icon && isVisible) map.addLayer(marker);
      }
    };

    return (
      <Map
        center={[latitude, longitude]}
        zoom={11}
        // preferCanvas={true}
        // onviewreset={handleMapUpdate}
        // onLoad={handleMapUpdate}
        // onMoveEnd={handleMapUpdate}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          updateWhenZooming={false}
          updateWhenIdle={true}
        />
        <Marker position={baseLocation} icon={Icons.Headquarters} />
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
    createRouteCoords();
  }, []);

  const createRouteCoords = () => {
    let latlngs = [];
    for (let location of props.route) {
      latlngs.push([location["from"], location["to"]]);
    }
    createManyCoordinates(latlngs, 0); // test
    createDriverCoords(latlngs);
    setCoords([...latlngs]);
  };

  const createDriverCoords = (routeCoords) => {
    // console.log(routeCoords);
    // checking if there are more drivers than delivery locations
    if (routeCoords.length) {
      // point from previous location to driver location
      const temp = routeCoords[destination - 1][1];
      routeCoords[destination - 1][1] = driverLocation;
      // create route from driver location to next location
      const fromDriverToNext = [driverLocation, temp];
      routeCoords.splice(destination, 0, fromDriverToNext);
    } else {
      routeCoords.push([props.baseLocation, props.baseLocation]);
    }
  };

  const handleDriverLocation = () => {
    // console.log(coords);
    // console.log(driverLocation);
    let tempCoords = [...coords];
    const randomCoords = getRandomCoordinates(props.baseLocation, 0.375); // testing
    tempCoords[destination - 1][1] = randomCoords; // = driverLocation
    tempCoords[destination][0] = randomCoords; // = driverLocation
    setCoords(tempCoords);
  };

  const handleDelivery = () => {
    setDestination(++destination);

    if (destination === props.route.length) console.log("Final Destination");
  };

  // for testing driver coordinates only
  function getRandomCoordinates(location, range) {
    const x = location[0];
    const y = location[1];
    const lat = (Math.random() * (2 * range) + (x - range)).toFixed(3) * 1;
    const lng = (Math.random() * (2 * range) + (y - range)).toFixed(3) * 1;
    return [lat, lng];
  }

  // for testing marker limits only
  function createManyCoordinates(latlngs, val) {
    // 2 Markers per 1 val
    for (let i = 0; i < val; i++) {
      const randomVal = () => {
        return (Math.random() * 360 - 180).toFixed(3) * 1;
      };

      latlngs.push([
        [randomVal(), randomVal()],
        [randomVal(), randomVal()],
      ]);
    }
  }
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
                ? Icons.Truck
                : Icons.DefaultIcon("green")
              : Icons.DefaultIcon("red")
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
