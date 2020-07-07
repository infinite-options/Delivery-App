import React from "react";

import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";

function MapPage() {
  const items = [
    [
      [41, -120],
      [35, -115],
    ],
    [
      [37, -121],
      [35, -126],
    ],
    [
      [36, -122],
      [34, -117],
      [42, -122],
    ],
  ];

  return (
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
            <DeliveryRoutes locations={items} />
          </div>
          <div className="column has-no-padding has-shadow">
            <div className="sticky">
              <LeafletMap locations={items} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MapPage;
