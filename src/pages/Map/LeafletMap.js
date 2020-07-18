import React, { useState, useEffect } from "react";
// import { Link, useRouteMatch, Redirect } from "react-router-dom";
import "./style.css";
import {
  Map,
  TileLayer,
  Marker,
  // Popup,
  // MapLayer,
  Polyline,
} from "react-leaflet";
import { geolocated } from "react-geolocated";
import Icons from "Icons/Icons";
import L from "leaflet";
// use San Jose, CA as the default center
const DEFAULT_LATITUDE = 37.338208;
const DEFAULT_LONGITUDE = -121.886329;

function LeafletMap(props) {
  const [mapMarkers, setMapMarkers] = useState([]);

  const routes = props.routes;
  const baseLocation = routes[0][0]["from"];
  const latitude = baseLocation ? baseLocation[0] : DEFAULT_LATITUDE;
  const longitude = baseLocation ? baseLocation[1] : DEFAULT_LONGITUDE;

  const handleMapUpdate = (e) => {
    // console.log(e.target);
    // onLoad does not work on Map component, so must be called from its child component (TileLayer)
    const map = e.target instanceof L.Map ? e.target : e.target._map;
    // const mapBounds = map.getBounds();
    // store all Markers if onLoad event has been called (AKA first time loading site)
    if (!mapMarkers.length && e.target instanceof L.TileLayer) {
      let markers = [];
      map.eachLayer((layer) => {
        // console.log("Scanning");
        if (layer instanceof L.Marker) {
          markers.push(layer);
          // check if Marker should be visible initially
          const isVisible = map.getBounds().contains(layer.getLatLng());
          if (!isVisible) map.removeLayer(layer);
        }
        // if Markers ever need to be added/removed in the future, remember to push marker into mapMarker Hook
      });
      // console.log(markers);
      setMapMarkers(markers);
    } else {
      manageMarkers(map); // updating Markers' visibility as user drags map around
    }
    // console.log(mapMarkers);
  };

  const manageMarkers = (map) => {
    // console.log(mapMarkers);
    for (let i = mapMarkers.length - 1; i >= 0; i--) {
      const marker = mapMarkers[i];
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
      minZoom={2}
      maxBounds={[
        [-83.75, -180], // preventing users from seeing map edge
        [83.75, 180],
      ]}
      maxBoundsViscosity={0.9375}
      // preferCanvas={true}
      onMoveEnd={handleMapUpdate}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        updateWhenZooming={false}
        // updateWhenIdle={true}
        onLoad={handleMapUpdate}
      />
      <Marker position={baseLocation} icon={Icons.Headquarters} />
      {routes.map((route, index) => (
        <RouteMarker
          key={index}
          props={{ route, index, baseLocation: [latitude, longitude] }}
        />
      ))}
    </Map>
  );
}

const RouteMarker = ({ props }) => {
  const [coords, setCoords] = useState([]);
  // These two probably need to be declared in MapPage.js, so when they're updated the route lists can be edited as well
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
    setDestination(destination + 1);

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
