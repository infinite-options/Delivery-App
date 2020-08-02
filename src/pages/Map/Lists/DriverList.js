import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import axios from "axios";

function DriverList({ drivers, routes, props }) {
  return (
    <React.Fragment>
      {Object.keys(drivers).map((driver_id, index) => (
        <DriverItem
          key={index}
          props={{
            driver: drivers[driver_id],
            id: driver_id,
            routes: routes,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function DriverItem({ props }) {
  const [hidden, setHidden] = useState(true);

//   const sendDriverText = (driverNumber) => {
//     console.log(`Sending Driver ${driverNumber} a text..`);
//   };

//   const skipLocation = (locationNumber) => {
//     console.log(`Skipping Location ${locationNumber}..`);
//   };

//   const changeLocation = (locationNumber) => {
//     console.log(`Editing Location ${locationNumber}..`);
//   };

//   const sendConfirmationText = (locationNumber) => {
//     console.log(`Sending Location ${locationNumber} a text..`);
//   };

//   const sendConfirmationEmail = (locationNumber) => {
//     console.log(`Sending Location ${locationNumber} an email..`);
//   };

  return (
    <div className="box" style={{ backgroundColor: "#f8f7fa" }}>
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ededed" }}>
            <th>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <button
                className="mx-1"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
              Driver {props.id}
            </th>
            <th />
            <th />
            <th />
            <th style={{width: "10.25em"}}>
              <button
                className="button is-rounded is-small mx-1"
                // onClick={() => sendText(idx + 1)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
              </button>
              <button
                className="button is-rounded is-small mx-1"
                // onClick={() => sendEmail(idx + 1)}
              >
                <FontAwesomeIcon icon={Icons.faEnvelope} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="has-text-centered" hidden={hidden}>
          <tr>
            <td className="pr-0">
                First Name
                <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
                Last Name
            </td>
            <td className="pl-0 has-text-left">
                {props.driver.first_name}
                <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
                {props.driver.last_name}
            </td>
            <td>
                Hours/week<br />{props.driver.weekly_workload}
            </td>
            <td>
                Driver's License<br />{props.driver.drivers_license}
            </td>
            <td>
                Expiration<br />{props.driver.expiration}
            </td>
          </tr>
          <tr>
            <td>
                Rating<br />{props.driver.rating}
            </td>
            <td>
                SSN<br />{props.driver.ssn}
            </td>
            <td>
                Preferred Routes<br />{props.driver.preferred_routes}
            </td>
            <td>
                Days Available<br />{props.driver.day_availability}
            </td>
            <td>
                Times Available<br />{props.driver.time_availability}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DriverList;
