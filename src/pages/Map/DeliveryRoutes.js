import React, { useState, useEffect } from "react";

function DeliveryRoutes({ locations }) {
  return (
    <div>
      {locations.map((route, index) => (
        <Item key={index} props={{ route, index }} />
      ))}
    </div>
  );
}

function Item({ props }) {
  const [hidden, setHidden] = useState(true);
  // console.log(props.route);

  return (
    <div className="box" onClick={() => setHidden(!hidden)}>
      Driver {props.index + 1}
      <div hidden={hidden ? true : false}>
        {props.route.map((location, index) => (
          <div key={index} className="box">
            Destination {index + 1} : ({location["to"][0]}, {location["to"][1]})
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryRoutes;
