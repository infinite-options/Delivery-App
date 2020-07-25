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

function LeafletMap({ routes, colors, props }) {
  const [leafletMap, setLeafletMap] = useState();
  const [mapMarkers, setMapMarkers] = useState([]);

  const selectedLocation = props.selectedLocation;
  const setSelectedLocation = props.setSelectedLocation;

  const baseLocation = routes[0][0]["from"];
  const latitude = baseLocation ? baseLocation[0] : DEFAULT_LATITUDE;
  const longitude = baseLocation ? baseLocation[1] : DEFAULT_LONGITUDE;

  useEffect(() => {
    const selected = { ...selectedLocation };
    const driver = selected.driver;
    const location = selected.location;
    // console.log(routes);
    // console.log(leafletMap);
    if (leafletMap && driver && location) {
      // console.log("SUCCESS");
      const zoom = leafletMap.getZoom() >= 11 ? leafletMap.getZoom() : 11;
      const route = routes[driver - 1];
      const latlng = route[location - 1]["to"];
      // console.log(zoom);
      // console.log(route);
      // console.log(latlng);

      leafletMap.setView(latlng, zoom);
    }
  }, [selectedLocation]);

  const handleMapUpdate = (e) => {
    // console.log(e.target);
    // onLoad does not work on Map component, so must be called from its child component (TileLayer)
    const map = e.target instanceof L.Map ? e.target : e.target._map;
    if (!leafletMap) {
      setLeafletMap(map);
      console.log("loading map..");
    }
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
          props={{
            route,
            index,
            color: colors[index],
            selectedLocation,
            setSelectedLocation,
            baseLocation: [latitude, longitude],
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

  const createRouteCoords = () => {
    let latlngs = [];
    for (let location of props.route) {
      latlngs.push([location["from"], location["to"]]);
    }
    createManyCoordinates(latlngs, 0); // test
    createDriverCoords(latlngs);
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
    // console.log(coords);
    // console.log(driverLocation);

    // let tempCoords = [...coords];
    // const randomCoords = getRandomCoordinates(props.baseLocation, 0.375); // testing
    // tempCoords[destination - 1][1] = randomCoords; // = driverLocation
    // tempCoords[destination][0] = randomCoords; // = driverLocation
    // setCoords(tempCoords);
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
              : handleDriverSelect(e, props.index + 1)
          }
          onDblClick={() => false} // disabling zoom on double click
        >
          <Popup closeButton={false}>
            <p>{destination !== idx + 1 ? `Destination ${destination > idx ? idx + 1 : idx}` : `Driver ${props.index + 1}`}</p>
            {destination !== idx + 1 ? (
              <React.Fragment>
                <p>{`Address: (${location[1][0]}, ${location[1][1]})`}</p>
                <p>{`ETA: 00:00 am`}</p>
                <p>{`Arrived: 00:00 pm`}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>Driver Info</p>
              </React.Fragment>
            )}
          </Popup>
        </Marker>
      ))}
      {coords.map((location, index) => {
        // console.log(index, location);
        return (
          <Polyline
            key={index}
            positions={[location[0], location[1]]}
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
