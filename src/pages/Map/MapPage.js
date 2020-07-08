import React, { useState, useEffect } from "react";

import axios from "axios";
import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";

function MapPage() {
  const ROUTE_API =
    "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/deliveryRoute";

  const [isLoading, setIsLoading] = useState(true);
  const [drivers, setDrivers] = useState(2); // useState(DRIVER_COUNT)
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get(ROUTE_API)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          const result = [...response.data.result];
          const routes = result.slice(1, result.length - 1);
          const routesPerDriver = Math.floor(routes.length / drivers);
          const extraRoutes = routes.length % drivers;

          // console.log(routes);
          let tempLocations = [];
          let index = 0;
          for (let i = 0; i < drivers; i++) {
            let tempRoute = [];
            let driverRoutes =
              i < extraRoutes ? routesPerDriver + 1 : routesPerDriver;
            for (let j = 0; j < driverRoutes; j++) {
              let toLatitude = routes[index].latitude;
              let toLongitude = routes[index].longitude;
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
  }, []);

  // Random coordinates for testing
  // const items = [
  //   [
  //     { from: [40, -120], to: [41, -120] },
  //     { from: [41, -120], to: [42, -121] },
  //   ],
  //   [
  //     { from: [40, -120], to: [39, -121] },
  //     { from: [39, -121], to: [37, -122] },
  //   ],
  //   [
  //     { from: [40, -120], to: [37, -116] },
  //     { from: [37, -116], to: [33, -115] },
  //     { from: [33, -115], to: [35, -113] },
  //   ],
  // ];
  // console.log(items);

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
                // maxWidth: "100%",
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
