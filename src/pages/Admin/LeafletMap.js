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
  const [mapData, setMapData] = useState({ routes, drivers, businesses, customers });
  const [mapMarkers, setMapMarkers] = useState([]);
  
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

  /* rendering/updating data when user filters data */
  // FIXME: A business' visibility value should be set to false IF:
  //        user is on the deliveries tab
  //        -- AND --
  //        all routes associated with the business have visibility values = false;
  // FIXME: Upon page reload, markers that should be invisible flicker once on page. Not big deal but looks glitchy and weird
  useEffect(() => {
    if (leafletMap) handleFilterUpdate(props.filter.type);
  }, [props.filter]);

  const handleFilterUpdate = (type) => {
    let dataType = type;
    let newData;
    setMapData(prevMapData => {
      if (dataType) {
        newData = { ...prevMapData[dataType] };
        const dataKeys = Object.keys(prevMapData[dataType]);
        const filtered = Object.entries(prevMapData[dataType]).filter(entry => {
          return entry[1][props.filter.option] != props.filter.value;
        });
        const dataToHide = Array.from(filtered, entry => entry[0]);
        for (let key of dataKeys) {
          if(dataToHide.includes(key)) newData[key].visible = false;
          else newData[key].visible = true;
        }
      }
      else {
        newData = header === 0 ? { ...routes } :
                  header === 1 ? { ...drivers } :
                  header === 2 ? { ...businesses } :
                /*header === 3 ?*/ { ...customers };
        const dataKeys = Object.keys(newData);
        for (let key of dataKeys) newData[key].visible = true;
        dataType = header === 0 ? 'routes' :
                   header === 1 ? 'drivers' :
                   header === 2 ? 'businesses' :
                 /*header === 3 ?*/ 'customers';
      }
      console.log(newData);
      console.log("YO", {
        ...prevMapData,
        [dataType]: newData,
      });
      return {
        ...prevMapData,
        [dataType]: newData,
      };
    });
  };

  /* updating routes/drivers/businesses/customers upon user interaction (Ex: toggle visibility) */
  useEffect(() => {
    handleDataUpdate("routes");
  }, [routes]);

  useEffect(() => {
    handleDataUpdate("drivers");
  }, [drivers]);

  useEffect(() => {
    handleDataUpdate("businesses");
  }, [businesses]);

  useEffect(() => {
    handleDataUpdate("customers");
  }, [customers]);

  const handleDataUpdate = (type) => {
    if (leafletMap) setMapData(prevMapData => {
      const changedData = type === 'routes' ? routes : 
                          type === 'drivers' ? drivers :
                          type === 'businesses' ? businesses :
                        /*type === 'customers' ?*/ customers;
      const dataKeys = Object.keys(changedData);
      const filteredKeys = Object.keys(prevMapData[type]);
      let newData = { ...prevMapData[type] };
      for (let key of dataKeys) {
        if (filteredKeys.includes(key)) {
          newData[key].visible = changedData[key].visible;
          // other values that may be modified by an admin user?
        }
      }
      return {
        ...prevMapData,
        [type]: newData,
      };
    });
  };

  useEffect(() => {
    if (leafletMap) manageMarkers();
  }, [mapData]);

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
  const routes_array = Object.entries(mapData.routes);
  const drivers_array = Object.entries(mapData.drivers);
  const businesses_array = Object.entries(mapData.businesses);
  const customers_array = Object.entries(mapData.customers);
  // console.log(businesses_array);

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
      case 0:
        // console.log(businessLocations[marker.options.business]);
        return (
          mapData.routes[marker.options.route] ? mapData.routes[marker.options.route].visible : (
          marker.options.customer ? false : (
          mapData.businesses[marker.options.business] ? mapData.businesses[marker.options.business].visible : false
          ))
        );
      case 1:
        return (
          mapData.routes[marker.options.route] ? mapData.routes[marker.options.route].visible : (
          mapData.drivers[marker.options.driver] ? mapData.drivers[marker.options.driver].visible : false
          )
        );
      case 2:
        return (
          mapData.businesses[marker.options.business] ? mapData.businesses[marker.options.business].visible : false
        );
      case 3:
        return (
          marker.options.business ? false : (
          mapData.customers[marker.options.customer] ? mapData.customers[marker.options.customer].visible : false
          )
        );
      default:
        return false;
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
      {drivers_array.map((driver, index) => (
        <DriverMarkers 
          key={index}
          index={index}
          id={driver[0]}
          driver={driver[1]}
          header={header}
        />
      ))}
      {businesses_array.map((business, index) => (
        <BusinessMarkers 
          key={index}
          index={index}
          id={business[0]}
          business={business[1]}
          header={header}
        />
      ))}
      {customers_array.map((customer, index) => (
        <CustomerMarkers 
          key={index}
          index={index}
          id={customer[0]}
          customer={customer[1]}
          header={header}
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
          // manageMarkers={manageMarkers}
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

function DriverMarkers({ driver, id, ...props }) {

  return (
    <Marker 
      driver={id}
      position={[driver.latitude || Math.random(), driver.longitude || Math.random()]}
      icon={Icons.DefaultIcon("#FFFFFF")}
      onClick={() => console.log(`Hi this is Driver ${id}`)}
      onDblClick={() => false} // disabling zoom on marker double click
    />
  );
};

function BusinessMarkers({ business, id, ...props }) {

  return (
    <React.Fragment>
      <Marker 
        business={id}
        position={[business.latitude || Math.random(), business.longitude || Math.random()]} 
        icon={Icons.Headquarters} 
        onClick={() => console.log(`Hi this is Business ${id}`)} 
        onDblClick={() => false} // disabling zoom on marker double click
      />
      {business.customers && business.customers.map((customer, index) => (
        <Marker 
          key={index}
          customer={customer.customer_uid}
          business={id}
          position={[customer.customer_lat || Math.random(), customer.customer_long || Math.random()]}
          icon={Icons.DefaultIcon("#696969")}
          onClick={() => console.log(`Hi this is Business ${id}: Customer ${customer.customer_uid}`)}
          onDblClick={() => false} // disabling zoom on marker double click
        />
      ))}
    </React.Fragment>
  );
};

function CustomerMarkers({ customer, id, ...props }) {

  return (
    <Marker 
      customer={id}
      position={[customer.latitude || Math.random(), customer.longitude || Math.random()]}
      icon={Icons.DefaultIcon("#000000")}
      onClick={() => console.log(`Hi this is Customer ${id}`)}
      onDblClick={() => false} // disabling zoom on marker double click
    />
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
