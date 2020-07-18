import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icons from "Icons/Icons";

function DeliveryRoutes({ routes }) {
  return (
    <div className="box" style={{maxHeight: "90vh", overflowY: "auto"}}>
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
    <div className="box" style={{backgroundColor: "#f8f7fa"}}>
      <table className="table is-hoverable is-fullwidth is-size-7" style={{backgroundColor: "#f8f7fa"}}>
        <thead>
          <tr>
            <th>
              <button className="tooltip mx-1" onClick={() => setHidden(!hidden)}>
                <FontAwesomeIcon icon={hidden ? Icons.faCaretDown : Icons.faCaretUp} />
                <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span>
              </button>
              Driver {props.index + 1}
              <button className="tooltip mx-1">
                <FontAwesomeIcon icon={Icons.faComment} />
                <span className="tooltiptext">Message Driver</span>
              </button>
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
                <button className="tooltip button is-rounded is-small mx-1">
                  <FontAwesomeIcon icon={Icons.faComment} />
                  <span className="tooltiptext">Message Customer</span>
                </button>
                <button className="tooltip button is-rounded is-small mx-1">
                  <FontAwesomeIcon icon={Icons.faEnvelope} />
                  <span className="tooltiptext">Email Customer</span>
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
