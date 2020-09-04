import React, { useState, useEffect, useRef } from "react";

import {
  Map,
  TileLayer,
  Marker,
  // Popup,
  // MapLayer,
  Polyline,
} from "react-leaflet";
// import { geolocated } from "react-geolocated";
import Icons from "utils/Icons/Icons";
import L from "leaflet";
// use San Jose, CA as the default center
const DEFAULT_LATLNG = [37.338208, -121.886329];

function validateLatlng(latlng) {
  if (!Array.isArray(latlng)) return false;
  if (latlng.length !== 2) return false;
  if (isNaN(latlng[0]) || (latlng[0] <=  -90 || latlng[0] >=  90) || 
      isNaN(latlng[1]) || (latlng[1] <= -180 || latlng[1] >= 180)) return false;
  return true;
};

function calculateLatlng(routes_array) {
  const latlngLocal = (() => {
    try { return JSON.parse(window.localStorage.getItem("mapLatlng")); }
    catch (e) { return null; }
  })();

  try { 
    const isLatlng = validateLatlng(latlngLocal);
    return [
      isLatlng ? latlngLocal[0] : routes_array[0][1].route_data[0].to[0], 
      isLatlng ? latlngLocal[1] : routes_array[0][1].route_data[0].to[1]
    ];
  } 
  catch (e) { return DEFAULT_LATLNG; } 
};

function calculateZoom() {
  const zoomLocal = Number(window.localStorage.getItem("mapZoom"));
  return zoomLocal && zoomLocal >= 2 && zoomLocal <= 18 ? zoomLocal : 11;
};

// NOTE: This section of code feels really messy to me, think about cleaning it up and making it
//       more readable, if possible.
function LeafletMap({ header, routes, drivers, businesses, customers, ...props }) {
  console.log("rendering map..");

  const mapRef = useRef();
  const [leafletMap, setLeafletMap] = useState();
  const [mapRoutes, setMapRoutes] = useState(routes);
  // console.log("ROUTES", mapRoutes);
  const [mapMarkers, setMapMarkers] = useState([]);
  // NOTE: may wanna make a reducer here
  const [businessLocations, setBusinessLocations] = useState([]);
  // console.log(businessLocations);
  const [customerLocations, setCustomerLocations] = useState([]);
  
  /* rendering leafletMap */
  useEffect(() => {
    const { current={} } = mapRef;
    const { leafletElement: map } = current;
    // console.log(map);
    setLeafletMap(map);
  }, []);

  useEffect(() => {
    if (leafletMap) setTimeout(() => handleMapLoad(), 0); // waiting for RouteMarkers to finish rendering
  }, [leafletMap]);

  /* rendering/updating mapRoutes */
  useEffect(() => {
    let newRoutes = { ...routes };
    const routeKeys = Object.keys(routes);
    
    if (props.filter && props.filter.type === "routes" /* or drivers possibly? */) {
      setMapRoutes(() => {
        // create an array of routes that do not satisfy the filter condition
        const filtered = Object.entries(routes).filter(route => {
          // console.log(route[1][props.filter.option], props.filter.value);
          return route[1][props.filter.option] != props.filter.value;
        });
        // console.log(filtered);
        // create an array of route keys that failed to satisfy and therefore need to be hidden
        const routesToHide = Array.from(filtered, entry => entry[0]);
        for (let key of routeKeys) {
          if (routesToHide.includes(key)) newRoutes[key].visible = false;
          else newRoutes[key].visible = true;
        }
        // console.log(newRoutes);
        return newRoutes;
      });
    }
    else if (leafletMap) {
      setMapRoutes(() => {
        for (let key of routeKeys) newRoutes[key].visible = true;
        return newRoutes;
      });
    }
  }, [props.filter]);

  useEffect(() => {
    if (leafletMap) setMapRoutes(prevMapRoutes => {
      const routeKeys = Object.keys(routes);
      const filteredKeys = Object.keys(mapRoutes);
      let newRoutes = { ...prevMapRoutes };
      for (let key of routeKeys) {
        if (filteredKeys.includes(key)) {
          newRoutes[key].visible = routes[key].visible;
          // other keys that may be modified by an admin user?
        }
      }
      return newRoutes;
    });
  }, [routes])

  /* rendering/updating business/customer locations */
  useEffect(() => {
    // FIXME: Same bug that used to appear for routes, when map loads, the markers are saved so changing 
    //        businessLocations does not remove those markers' existence. Fixed by toggling visibility
    setBusinessLocations(() => {
      let businessLocations = {};
      switch (header) {
        case 0: case 1:
          for (let route_id in mapRoutes) {
            // console.log(route);
            // console.log(mapRoutes[route_id].visible);
            const latlng = mapRoutes[route_id].route_data[0].from;
            const businessInfo = businessLocations[mapRoutes[route_id].business_id];
            // if this business id is not currently in our list, add the latlng and visibility values to the list
            // console.log(mapRoutes[route_id].visible);
            if (!businessInfo) businessLocations[mapRoutes[route_id].business_id] = { latlng, visible: mapRoutes[route_id].visible };
            // if the business location visibility value is currently false, but there is a visible route connected to the business location, toggle the visibility to true
            else if (!businessInfo.visible && mapRoutes[route_id].visible) businessLocations[mapRoutes[route_id].business_id].visible = true; 
          } break;
        case 2: case 3: // case 3 being part of case 2 is temporary, just so map doesn't bug out
          for (let business_id in businesses) {
            // `|| 0` is for testing purposes, since currently the endpoint does not return any latlng values :(
            const latlng = [businesses[business_id].latitude || 0, businesses[business_id].longitude || 0];
            businessLocations[business_id] = { latlng, visible: businesses[business_id].visible };
          } break;
        // case 3: break;
        default: 
          console.log("Shouldn't be printing"); break;
      }
      return businessLocations;
    });
  }, [mapRoutes, header]);

  useEffect(() => { // Essentially what this is doing is 'manage marker visibility after mapRoutes or header is updated'
    manageMarkers();
  }, [businessLocations]);

  /* updating selected marker' size */
  useEffect(() => {
    const selected = { ...props.selectedLocation };
    const driver = selected.driver;
    const location = selected.location;
    // console.log(mapRoutes);
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
  }, [props.selectedLocation]);
  
  // console.log(businessLocations);
  // console.log(mapRoutes);
  const businessLocations_array = Object.entries(businessLocations);
  const customerLocations_array = Object.entries(customerLocations);
  const routes_array = Object.entries(mapRoutes);

  const mapLatlng = calculateLatlng(routes_array);
  const mapZoom = calculateZoom();

  const handleMapLoad = () => {
    const map = leafletMap;
    // console.log(map);
    let markers = [];
    map.eachLayer((layer) => {
      // console.log("Scanning", layer);
      if (layer instanceof L.Marker) {
        // console.log(layer);
        markers.push(layer);
        // check if Marker should be visible initially
        // console.log(mapRoutes[layer.options.route]);
        const routeVisible = checkVisibility(layer);
        const isVisible = routeVisible && map.getBounds().contains(layer.getLatLng());
        if (!isVisible) map.removeLayer(layer);
      }
    });
    // console.log(markers);
    setMapMarkers(markers);
    console.log("loading map..");
  }

  const handleMapUpdate = () => {
    manageMarkers(); // updating Markers' visibility as user drags map around
    window.localStorage.setItem("mapLatlng", JSON.stringify([leafletMap.getCenter().lat, leafletMap.getCenter().lng]));
    // is this if-statement even necessary?
    if (window.localStorage.getItem("mapZoom") != leafletMap.getZoom()) window.localStorage.setItem("mapZoom", leafletMap.getZoom());
    // console.log(mapMarkers);
    console.log("updating map..");
  };

  const manageMarkers = (map=leafletMap) => {
    // console.log(mapMarkers);
    for (let marker of mapMarkers) {
      // const marker = mapMarkers[i];
      // console.log("Marker:", marker);
      // console.log(mapRoutes[marker.options.route]);
      const routeVisible = checkVisibility(marker);
      const mapBounds = map.getBounds();
      const isVisible = routeVisible && mapBounds.contains(marker.getLatLng());
      // console.log(isVisible, marker);
      if (marker._icon && !isVisible) map.removeLayer(marker);
      else if (!marker._icon && isVisible) map.addLayer(marker);
    }
  };

  const checkVisibility = (marker) => {
    switch (header) {
      case 0: case 1:
        // console.log(businessLocations[marker.options.business]);
        return (
          mapRoutes[marker.options.route] ? mapRoutes[marker.options.route].visible : (
          businessLocations[marker.options.business] ? businessLocations[marker.options.business].visible : false)
        );
      case 2:
        return (
          businessLocations[marker.options.business] ? businessLocations[marker.options.business].visible : false
        );
      default:
        return undefined;
    }
  };

  return (
    <Map
      ref={mapRef}
      center={mapLatlng}
      zoom={mapZoom}
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
        // onload={}
      />
      {businessLocations_array.map((location, index) => (
        <Marker 
          key={index} 
          index={index}
          business={location[0]}
          position={location[1].latlng} 
          icon={Icons.Headquarters} 
          onClick={() => console.log(`Hi this is Business ${location[0]}`)} 
          onDblClick={() => false} // disabling zoom on marker double click
        />
      ))}
      {routes_array.map((route, index) => (
        <RouteMarkers
          key={index}
          index={index}
          id={route[0]}
          route={route[1]}
          selectedLocation={props.selectedLocation}
          setSelectedLocation={props.setSelectedLocation}
          manageMarkers={manageMarkers}
          header={header}
          // visible={routes[route[0]].visible}
        />
      ))}
    </Map>
  );
}

const RouteMarkers = ({ route, id, ...props }) => {
  const [coords, setCoords] = useState([]);
  const [driverLocation, setDriverLocation] = useState(route.route_data[0].from); // useState(CURRENT_DRIVER_LOCATION ? CURRENT_DRIVER_LOCATION : props.businessLocation)
  const [destination, setDestination] = useState(1); // useState(CURRENT_DRIVER_DESTINATION ? CURRENT_DRIVER_DESTINATION : props.businessLocation)
  // const selectedLocation = props.selectedLocation;

  useEffect(() => {
    createRouteCoords();
  }, []);

  // useEffect(() => {
  //   props.manageMarkers();
  // }, [props.visible])

  const createRouteCoords = () => {
    let latlngs = [];
    for (let location of route.route_data) {
      // if (location === route.route_data[0]) continue;
      latlngs.push([location.from, location.to, location.address]); // calling it coords/latlngs is a bit misleading now that it also contains the address string
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
      // console.log("yo", routeCoords[destination-1]);
      const temp = routeCoords[destination - 1][1];
      routeCoords[destination - 1][1] = driverLocation;
      // create route from driver location to next location
      const fromDriverToNext = [driverLocation, temp];
      // console.log(fromDriverToNext);
      routeCoords.splice(destination, 0, fromDriverToNext);
    }
  };

  const handleDriverLocation = () => {
    setCoords((prevCoords) => {
      let coords = [...prevCoords];
      const randomCoords = getRandomCoordinates(route.route_data[0].to, 0.1); // testing
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

  // duplcate code, create function in DashboardPage.js and send function to children component
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
      {coords.map((location, index) => {
        // console.log(coords);
        return <Marker
          key={index}
          route={id}
          position={location[1]}
          icon={
            destination === index + 1
              ? Icons.Truck
              : Icons.DefaultIcon(
                  destination > index ? "#696969" : route.route_color,
                  props.selectedLocation.driver - 1 === props.index &&
                    props.selectedLocation.location ===
                      (destination > index ? index + 1 : index)
                    ? { mult: 1.25 }
                    : {}
                )
          }
          onClick={(e) =>
            destination !== index + 1
              ? handleSelect(e, props.index + 1, destination > index ? index + 1 : index)
              : handleDriverSelect(e, route.driver_id)
          }
          onDblClick={() => false} // disabling zoom on marker double click
        >
          {/* TODO: Learn how to set conditional popups, i.e. if Marker is already selected, do not show popup on click */}
          {/* <Popup closeButton={false}>
            <p>{destination !== index + 1 ? `Destination ${destination > index ? index + 1 : index}` : `Driver ${props.index + 1}`}</p>
            {destination !== index + 1 ? (
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
      })}
      {(props.header < 2 && route.visible) && coords.map((location, index) => {
        // console.log(index, location);
        return (
          <Polyline
            key={index}
            positions={[location[0], location[1]]}
            // weight={2}
            color={destination > index ? "dimgrey" : route.route_color}
          />
        );
      })}
      <button onClick={handleDriverLocation}>HI</button>
    </React.Fragment>
  );
};

// export default geolocated({
//   positionOptions: {
//     enableHighAccuracy: true,
//   },
//   watchPosition: true,
//   userDecisionTimeout: 10000, // determines how much time (in miliseconds) we
//   // give the user to make the decision whether to allow to share their location or not
// })(LeafletMap);

export default LeafletMap;
