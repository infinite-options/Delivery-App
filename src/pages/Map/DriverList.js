import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";

function DriverList({ drivers, colors, props }) {
  return (
    <React.Fragment>
      {drivers.map((driver, index) => (
        <DriverItem
          key={index}
          props={{
            driver,
            colors: colors,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function DriverItem({ props }) {
  const [hidden, setHidden] = useState(true);

//   useEffect(() => {
//     if (props.selectedLocation.driver === props.index + 1) {
//       if (hidden) setHidden(false);
//     }
//   }, [props.selectedLocation]);

//   const handleSelect = (driverNumber, locationNumber) => {
//     // console.log(`{${driverNumber}, ${locationNumber}}`);
//     props.setSelectedLocation((prevSelectedLocation) => {
//       let selectedLocation = { ...prevSelectedLocation };
//       if (
//         driverNumber === selectedLocation.driver &&
//         locationNumber === selectedLocation.location
//       ) {
//         selectedLocation.driver = undefined;
//         selectedLocation.location = undefined;
//         return selectedLocation;
//       }

//       if (driverNumber !== selectedLocation.driver)
//         selectedLocation.driver = driverNumber;
//       if (locationNumber !== selectedLocation.location)
//         selectedLocation.location = locationNumber;
//       return selectedLocation;
//     });
//   };

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
              Driver {props.index + 1}
              {/* <button className="tooltip mx-1"> */}
              {/* <button
                className="mx-1"
                onClick={() => sendDriverText(props.index + 1)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
              </button> */}
            </th>
            <th />
            <th />
            <th />
            <th />
            {/* <th
              style={{ backgroundColor: "#ededed", borderRadius: "8px 0 0 0" }}
            >
              <div
                className="route"
                style={{ borderBottom: `3px solid ${props.color}` }}
              >
                <span style={{ backgroundColor: "#ededed" }}>Route</span>
              </div>
            </th>
            <th style={{ backgroundColor: "#ededed" }}>ETA</th>
            <th style={{ backgroundColor: "#ededed" }}>Arrived</th>
            <th
              style={{ backgroundColor: "#ededed", borderRadius: "0 8px 0 0" }}
            >
              Confirm
            </th> */}
          </tr>
        </thead>
        <tbody hidden={hidden}>
          <tr>
            <td className="pr-0">
                First Name
                <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
                Last Name
            </td>
            <td className="pl-0">
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
                Times Available<br />PLACEHOLDER
            </td>
          </tr>
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

export default DriverList;
