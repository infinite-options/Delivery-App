import React, { useState, useEffect } from "react";

import axios from "axios";
import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";

function MapPage() {
  // an array of routes for testing
  const test = [
    [{'latitude': 36.9264398, 'longitude': -121.7531546}, {'latitude': 37.220022, 'longitude': -121.846865}, {'latitude': 37.204775, 'longitude': -121.831414}, {'latitude': 37.208862, 'longitude': -121.852162}, {'latitude': 37.200639, 'longitude': -121.836549}, {'latitude': 37.235542, 'longitude': -121.848751}, {'latitude': 37.203119, 'longitude': -121.857549}, {'latitude': 37.235976, 'longitude': -121.810059}, {'latitude': 37.204459, 'longitude': -121.828867}, {'latitude': 37.195659, 'longitude': -121.843228}, {'latitude': 37.210068, 'longitude': -121.823281}, {'latitude': 37.206714, 'longitude': -121.858709}, {'latitude': 37.218533, 'longitude': -121.856209}, {'latitude': 37.22274, 'longitude': -121.849644}, {'latitude': 37.199574, 'longitude': -121.837836}, {'latitude': 37.20666, 'longitude': -121.845314}, {'latitude': 37.203976, 'longitude': -121.850973}, {'latitude': 37.20588, 'longitude': -121.827929}, {'latitude': 37.205476, 'longitude': -121.834037}, {'latitude': 37.210261, 'longitude': -121.828151}, {'latitude': 37.201104, 'longitude': -121.858722}, {'latitude': 37.209777, 'longitude': -121.848612}, {'latitude': 37.199313, 'longitude': -121.829092}, {'latitude': 37.212021, 'longitude': -121.840744}],
    [{'latitude': 36.9264398, 'longitude': -121.7531546}, {'latitude': 37.317809, 'longitude': -122.065478}, {'latitude': 37.3381255, 'longitude': -122.0300825}, {'latitude': 37.317469, 'longitude': -122.019218}, {'latitude': 37.318561507343, 'longitude': -122.065178270003}],
  ];

  // has a bunch of [latitude, longitude] values for testing
  const ROUTE_API =
    "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/deliveryRoute";

  const [isLoading, setIsLoading] = useState(true);
  // will there ever be a case where there are more drivers than locations?
  const [drivers, setDrivers] = useState(2); // useState(DRIVER_COUNT)
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    createRoutes();
  }, []);

  const createRoutes = () => {
    // plotting markers & lines for test routes
    let tempLocations = [];
    for (let set of test) {
      let tempRoutes = [];
      let index = 0;
      for (let coord of set) {
        if (index < set.length - 1) {
          console.log("0", coord);
          console.log(set.length, set[index + 1]);

          let fromLatitude = coord["latitude"];
          let fromLongitude = coord["longitude"];
          let toLatitude = set[index + 1]["latitude"];
          let toLongitude = set[index + 1]["longitude"];
          tempRoutes.push({
            from: [fromLatitude, fromLongitude],
            to: [toLatitude, toLongitude],
          });
        }
        index++;
      }
      tempLocations.push(tempRoutes);
    }
    setLocations(tempLocations);
    setIsLoading(false);
    
    // axios
    //   .get(ROUTE_API)
    //   .then((response) => {
    //     // console.log(response);
    //     if (response.status === 200) {
    //       const result = [...response.data.result];
    //       // cut off head & tail of result, since those values are the HQ location value
    //       const routes = result.slice(1, result.length - 1);
    //       // determine average routes per driver
    //       const routesPerDriver = Math.floor(routes.length / drivers);
    //       const extraRoutes = routes.length % drivers; // extras will be distributed as evenly as possible

    //       // console.log(routes);
    //       let tempLocations = [];
    //       let index = 0;
    //       for (let i = 0; i < drivers; i++) {
    //         let tempRoute = [];
    //         // if driver is to be assigned an extra route, lengthen the loop by 1 iteration
    //         let driverRoutes =
    //           i < extraRoutes ? routesPerDriver + 1 : routesPerDriver;
    //         for (let j = 0; j < driverRoutes; j++) {
    //           // destination coords
    //           let toLatitude = routes[index].latitude;
    //           let toLongitude = routes[index].longitude;
    //           // beginning coords, if first route then begin from HQ coords
    //           let fromLatitude = !j
    //             ? result[0].latitude
    //             : routes[index - 1].latitude;
    //           let fromLongitude = !j
    //             ? result[0].longitude
    //             : routes[index - 1].longitude;
    //           tempRoute.push({
    //             from: [fromLatitude, fromLongitude],
    //             to: [toLatitude, toLongitude],
    //           });
    //           index++;
    //           // console.log("index:", index);
    //         }
    //         tempLocations.push(tempRoute);
    //       }
    //       // console.log("temp:", tempLocations);
    //       setLocations(tempLocations);
    //       setIsLoading(false);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.response ? err.response : err);
    //   });
  };

  return (
    <React.Fragment>
      {!isLoading && (
        <React.Fragment>
          <nav
            className="navbar is-fixed-top"
            role="navigation"
            aria-label="main navigation"
            style={{
              height: "10vh",
              boxShadow: "0 2px 2px -2px rgba(0,0,0,.2)",
              borderBottom: "1px solid #d8dbdd",
            }}
          >
            <div
              className="columns"
              style={{
                height: "10vh",
                lineHeight: "10vh",
                textAlign: "center",
                minWidth: "100%",
              }}
            >
              <div className="column is-4 is-size-3">Routes</div>
              <div className="column is-size-3">Map</div>
            </div>
          </nav>
          <div className="map-page">
            <div className="columns" style={{ marginLeft: "0.75rem" }}>
              <div className="column is-4">
                <DeliveryRoutes locations={locations} />
              </div>
              <div className="column" style={{ padding: "0" }}>
                <div className="sticky">
                  <LeafletMap locations={locations} />
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default MapPage;
