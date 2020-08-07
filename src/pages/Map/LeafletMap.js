import React, { useState, useEffect } from "react";
// import { Link, useRouteMatch, Redirect } from "react-router-dom";
import "./style.css";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  // MapLayer,
  Polyline,
} from "react-leaflet";
import { geolocated } from "react-geolocated";
import Icons from "Icons/Icons";
import L, { LatLng } from "leaflet";
// use San Jose, CA as the default center
const DEFAULT_LATITUDE = 37.338208;
const DEFAULT_LONGITUDE = -121.886329;

function validateLatlng(latlng) {
  if (!Array.isArray(latlng)) return false;
  if (latlng.length !== 2) return false;
  if (isNaN(latlng[0]) || (latlng[0] <=  -90 || latlng[0] >=  90) || 
      isNaN(latlng[1]) || (latlng[1] <= -180 || latlng[1] >= 180)) return false;
  return true;
}

function LeafletMap({ routes, props }) {
  console.log("rendering map..");
  const [leafletMap, setLeafletMap] = useState();
  const [mapMarkers, setMapMarkers] = useState([]);

  const selectedLocation = props.selectedLocation;
  const setSelectedLocation = props.setSelectedLocation;
  
  let baseLocations = {};
  for (let route_id in routes) {
    // console.log(route);
    const latlng = routes[route_id].route_data[0].from;
    if (!baseLocations[routes[route_id].business_id]) baseLocations[routes[route_id].business_id] = latlng;
  }
  // console.log(baseLocations);
  // console.log(routes);
  const baseLocations_array = Object.entries(baseLocations);
  const routes_array = Object.entries(routes);

  const latlngLocal = JSON.parse(window.localStorage.getItem("mapLatlng"));
  const isLatlng = validateLatlng(latlngLocal);
  const latitude = isLatlng ? latlngLocal[0] : baseLocations_array[0][1][0];
  const longitude = isLatlng ? latlngLocal[1] : baseLocations_array[0][1][1];

  useEffect(() => {
    const selected = { ...selectedLocation };
    const driver = selected.driver;
    const location = selected.location;
    // console.log(routes);
    // console.log(leafletMap);
    if (leafletMap && driver && location) {
      // console.log("SUCCESS");
      const zoom = leafletMap.getZoom() >= 11 ? leafletMap.getZoom() : 11;
      const route = routes_array[driver - 1][1].route_data;
      // console.log("HERE2:", route);
      const latlng = route[location - 1]["to"];
      // console.log(zoom);
      // console.log(route);
      // console.log(latlng);

      leafletMap.setView(latlng, zoom);
    }
  }, [selectedLocation]);

  const handleMapUpdate = (e) => {
    // console.log(mapMarkers);
    // console.log(e.target);

    // const mapBounds = map.getBounds();
    // store all Markers if onLoad event has been called & there is no map data
    if (!leafletMap && !mapMarkers.length && e.target instanceof L.TileLayer) {
      // onLoad does not work on Map component, so must be called from its child component (TileLayer)
      const map = e.target instanceof L.Map ? e.target : e.target._map;
      let markers = [];
      map.eachLayer((layer) => {
        // console.log("Scanning", layer);
        if (layer instanceof L.Marker) {
          markers.push(layer);
          // check if Marker should be visible initially
          // console.log(routes[layer.options.route]);
          const routeVisible = routes[layer.options.route] ? routes[layer.options.route].visible : true;
          const isVisible = routeVisible && map.getBounds().contains(layer.getLatLng());
          if (!isVisible) map.removeLayer(layer);
        }
        // if Markers ever need to be added/removed in the future, remember to push marker into mapMarker Hook
      });
      // console.log(markers);
      setMapMarkers(markers);
      setLeafletMap(map);
      console.log("loading map..");
    }
    else if (e.target instanceof L.Map) manageMarkers(); // updating Markers' visibility as user drags map around
    // console.log(mapMarkers);
  };

  const manageMarkers = (map=leafletMap) => {
    // console.log(mapMarkers);
    for (let i = mapMarkers.length - 1; i >= 0; i--) {
      const marker = mapMarkers[i];
      // console.log("Marker:", marker);
      // console.log(routes[marker.options.route]);
      const routeVisible = routes[marker.options.route] ? routes[marker.options.route].visible : true;
      const mapBounds = map.getBounds();
      const isVisible = routeVisible && mapBounds.contains(marker.getLatLng());
      if (marker._icon && !isVisible) map.removeLayer(marker);
      else if (!marker._icon && isVisible) map.addLayer(marker);
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
      // onMove={handleMapUpdate}
      onMoveEnd={handleMapUpdate}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        updateWhenZooming={false}
        // updateWhenIdle={true}
        onLoad={handleMapUpdate}
      />
      {baseLocations_array.map((location, index) => (
        <Marker key={index} position={location[1]} icon={Icons.Headquarters} onClick={() => console.log(`Hi this is Business ${location[0]}`)} />
      ))}
      {routes_array.map((route, index) => (
        <RouteMarker
          key={index}
          props={{
            id: route[0],
            driver_id: route[1].driver_id,
            route: route[1].route_data,
            visible: route[1].visible,
            index,
            color: route[1].route_color,
            selectedLocation,
            setSelectedLocation,
            manageMarkers,
            baseLocation: route[1].route_data[0].from,
          }}
        />
      ))}
    </Map>
  );
}

const RouteMarker = ({ props }) => {
  const [coords, setCoords] = useState([]);
  const [driverLocation, setDriverLocation] = useState(props.baseLocation); // useState(CURRENT_DRIVER_LOCATION ? CURRENT_DRIVER_LOCATION : props.baseLocation)
  const [destination, setDestination] = useState(1); // useState(CURRENT_DRIVER_DESTINATION ? CURRENT_DRIVER_DESTINATION : props.baseLocation)

  const selectedLocation = props.selectedLocation;

  useEffect(() => {
    createRouteCoords();
  }, []);

  useEffect(() => {
    props.manageMarkers();
  }, [props.visible])

  const createRouteCoords = () => {
    let latlngs = [];
    for (let location of props.route) {
      latlngs.push([location["from"], location["to"], location["address"]]); // calling it coords/latlngs is a bit misleading now that it also contains the address string
    }
    createManyCoordinates(latlngs, 0); // test
    createDriverCoords(latlngs);
    // console.log(latlngs);
    setCoords(latlngs);
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
    setCoords((prevCoords) => {
      let coords = [...prevCoords];
      const randomCoords = getRandomCoordinates(props.baseLocation, 0.375); // testing
      coords[destination - 1][1] = randomCoords; // = driverLocation
      coords[destination][0] = randomCoords; // = driverLocation
      return coords;
    });
  };

  const handleDelivery = () => {
    setDestination((prevDestination) => prevDestination + 1);

    // if (destination === props.route.length) console.log("Final Destination");
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

  // duplcate code, create function in MapPage.js and send function to children component
  const handleSelect = (event, driverNumber, locationNumber) => {
    // console.log(event);
    // console.log(`{${driverNumber}, ${locationNumber}}`);
    props.setSelectedLocation((prevSelectedLocation) => {
      let selectedLocation = { ...prevSelectedLocation };
      if (
        driverNumber === selectedLocation.driver &&
        locationNumber === selectedLocation.location
      ) {
        selectedLocation.driver = undefined;
        selectedLocation.location = undefined;
        return selectedLocation;
      }

      if (driverNumber !== selectedLocation.driver)
        selectedLocation.driver = driverNumber;
      if (locationNumber !== selectedLocation.location)
        selectedLocation.location = locationNumber;
      
      // console.log(selectedLocation);
      return selectedLocation;
    });
  };

  const handleDriverSelect = (event, driverNumber) => {
    console.log(`Hi this is Driver ${driverNumber}!`);
  };

  return (
    <React.Fragment>
      {coords.map((location, idx) => (
        <Marker
          key={idx}
          route={props.id}
          position={location[1]}
          icon={
            destination === idx + 1
              ? Icons.Truck
              : Icons.DefaultIcon(
                  destination > idx ? "#696969" : props.color,
                  selectedLocation.driver - 1 === props.index &&
                    selectedLocation.location ===
                      (destination > idx ? idx + 1 : idx)
                    ? { mult: 1.25 }
                    : {}
                )
          }
          onClick={(e) =>
            destination !== idx + 1
              ? handleSelect(e, props.index + 1, destination > idx ? idx + 1 : idx)
              : handleDriverSelect(e, props.driver_id)
          }
          onDblClick={() => false} // disabling zoom on marker double click
        >
          {/* TODO: Learn how to set conditional popups, i.e. if Marker is already selected, do not show popup on click */}
          {/* <Popup closeButton={false}>
            <p>{destination !== idx + 1 ? `Destination ${destination > idx ? idx + 1 : idx}` : `Driver ${props.index + 1}`}</p>
            {destination !== idx + 1 ? (
              <React.Fragment>
                <p>{`Address: ${location[2]}`}</p>
                <p>{`ETA: 00:00 am`}</p>
                <p>{`Arrived: 00:00 pm`}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>Driver Info</p>
              </React.Fragment>
            )}
          </Popup> */}
        </Marker>
      ))}
      {props.visible && coords.map((location, index) => {
        // console.log(index, location);
        return (
          <Polyline
            key={index}
            positions={[location[0] ? location[0] : [DEFAULT_LATITUDE, DEFAULT_LONGITUDE], location[1]]}
            // weight={2}
            color={destination > index ? "dimgrey" : props.color}
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
