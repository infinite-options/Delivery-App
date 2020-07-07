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

  return (
    <div className="box" onClick={() => setHidden(!hidden)}>
      Driver {props.index}
      <div hidden={hidden ? true : false}>
        {props.route.map((location, index) => (
          <div key={index} className="box">
            Destination: ({location[0]}, {location[1]})
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryRoutes;
