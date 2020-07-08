import React, { useState, useEffect } from "react";

import axios from "axios";
import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";

function MapPage() {
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
    axios
      .get(ROUTE_API)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          const result = [...response.data.result];
          // cut off head & tail of result, since those values are the HQ location value
          const routes = result.slice(1, result.length - 1);
          // determine average routes per driver
          const routesPerDriver = Math.floor(routes.length / drivers);
          const extraRoutes = routes.length % drivers; // extras will be distributed as evenly as possible

          // console.log(routes);
          let tempLocations = [];
          let index = 0;
          for (let i = 0; i < drivers; i++) {
            let tempRoute = [];
            // if driver is to be assigned an extra route, lengthen the loop by 1 iteration
            let driverRoutes =
              i < extraRoutes ? routesPerDriver + 1 : routesPerDriver;
            for (let j = 0; j < driverRoutes; j++) {
              // destination coords
              let toLatitude = routes[index].latitude;
              let toLongitude = routes[index].longitude;
              // beginning coords, if first route then begin from HQ coords
              let fromLatitude = !j
                ? result[0].latitude
                : routes[index - 1].latitude;
              let fromLongitude = !j
                ? result[0].longitude
                : routes[index - 1].longitude;
              tempRoute.push({
                from: [fromLatitude, fromLongitude],
                to: [toLatitude, toLongitude],
              });
              index++;
              // console.log("index:", index);
            }
            tempLocations.push(tempRoute);
          }
          // console.log("temp:", tempLocations);
          setLocations(tempLocations);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response ? err.response : err);
      });
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
            <div className="columns">
              <div className="column is-4 mt-5 ml-5">
                <DeliveryRoutes locations={locations} />
              </div>
              <div className="column has-no-padding has-shadow">
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
