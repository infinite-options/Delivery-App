import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import axios from "axios";

// const DRIVERS_API_URL = "https://lu636s0qy3.execute-api.us-west-1.amazonaws.com/dev/api/v2/getDrivers";

function DriverList({ drivers, colors, props }) {
  // const [loading, setLoading] = useState(true);
  // const [drivers, setDrivers] = useState({});
  //Object.values(drivers)
  
  // useEffect(() => {
  //   axios.get(DRIVERS_API_URL).then(response => {
  //     // console.log("response_drivers:", response);
  //     const result = response.data.result.result;
  //     let tempDrivers = {};
  //     for (let driver of result) {
  //       const driver_id = driver.driver_id;
  //       const driver_data = {
  //         first_name: driver.driver_first_name,
  //         last_name: driver.driver_last_name,
  //         ssn: driver.driver_ssn,
  //         drivers_license: driver.driver_license,
  //         insurance_number: driver.driver_insurance_num,
  //         password: driver.driver_password,
  //         time_availability: driver.driver_hours,

  //         weekly_workload: -1,
  //         day_availability: "PLACEHOLDER",
  //         // time_availability: {
  //         //   Sunday: undefined, 
  //         //   Monday: 1, 
  //         //   Tuesday: undefined, 
  //         //   Wednesday: 1, 
  //         //   Thursday: 1, 
  //         //   Friday: undefined, 
  //         //   Saturday: undefined,
  //         // }, 
  //         expiration: "PLACEHOLDER",

  //         preferred_routes: "PLACEHOLDER", // only one choice with this endpoint!
  //         rating: -1,
  //       }
  //       tempDrivers[driver_id] = driver_data;
  //     }
  //     console.log("tempdrivers:", tempDrivers);
  //     setDrivers(tempDrivers);
  //   }).catch(err => {
  //     console.log(err.response ? err.response : err);
  //   });
  // }, []);

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
                <FontAwesomeIcon icon={Icons.faComment} />
              </button>
            </th>
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
