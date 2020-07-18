import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icons from "Icons/Icons";

function DeliveryRoutes({ routes }) {
  return (
    <div>
      {routes.map((route, index) => (
        <Item key={index} props={{ route, index }} />
      ))}
    </div>
  );
}

function Item({ props }) {
  const [hidden, setHidden] = useState(true);
  // console.log(props.route);

  return (
    <div className="box">
      <table className="table is-hoverable is-fullwidth is-size-7">
        <thead>
          <tr>
            <th>
              <button className="mx-1" onClick={() => setHidden(!hidden)}>
                <FontAwesomeIcon icon={hidden ? Icons.faCaretDown : Icons.faCaretUp} />
              </button>
              Driver {props.index + 1}
            </th>
            <th>Route</th>
            <th>ETA</th>
            <th>Arrived</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody hidden={hidden}>
          {props.route.map((location, idx) => (
            <tr key={idx}>
              <td>
                <button className="button is-rounded is-small mx-1" style={{ padding: "0.69rem" }}>{idx + 1}</button>
                <button className="button is-rounded is-small mx-1">Skip</button>
                <button className="button is-rounded is-small mx-1">Change</button>
              </td>
              <td>({location["to"][0]}, {location["to"][1]})</td>
              <td>00:00 am</td>
              <td>00:00 pm</td>
              <td>
                <button className="button is-rounded is-small mx-1">
                  <FontAwesomeIcon icon={Icons.faComment} />
                </button>
                <button className="button is-rounded is-small mx-1">
                  <FontAwesomeIcon icon={Icons.faEnvelope} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Driver {props.index + 1}
      <div className="mt-2" hidden={hidden}>
        {props.route.map((location, index) => (
          <div key={index} className="box">
            Destination {index + 1} : ({location["to"][0]}, {location["to"][1]})
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default DeliveryRoutes;
