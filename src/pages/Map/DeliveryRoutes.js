import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";

function DeliveryRoutes({ routes, colors, props }) {
  // const [selectedLocation, setSelectedLocation] = useState({});
  const selectedLocation = props.selectedLocation;
  const setSelectedLocation = props.setSelectedLocation;

  return (
    <React.Fragment>
      {routes.map((route, index) => (
        <RouteItem
          key={index}
          props={{
            route,
            color: colors[index],
            index,
            selectedLocation,
            setSelectedLocation,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function RouteItem({ props }) {
  const [hidden, setHidden] = useState(true);
  // console.log(props.route);

  useEffect(() => {
    // console.log(props.selectedLocation);
    if (props.selectedLocation.driver === props.index + 1) {
      if (hidden) setHidden(false);
    }
  }, [props.selectedLocation]);

  const handleSelect = (driverNumber, locationNumber) => {
    // console.log(`{${driverNumber}, ${locationNumber}}`);
    props.setSelectedLocation((prevSelectedLocation) => {
      let selectedLocation = { ...prevSelectedLocation };
      if (
        driverNumber === selectedLocation.driver &&
        locationNumber === selectedLocation.location
      ) {
        selectedLocation.driver = undefined;
        selectedLocation.location = undefined;
        return selectedLocation;
      }

      if (driverNumber !== selectedLocation.driver)
        selectedLocation.driver = driverNumber;
      if (locationNumber !== selectedLocation.location)
        selectedLocation.location = locationNumber;
      return selectedLocation;
    });
  };

  const sendDriverText = (driverNumber) => {
    console.log(`Sending Driver ${driverNumber} a text..`);
  };

  const skipLocation = (locationNumber) => {
    console.log(`Skipping Location ${locationNumber}..`);
  };

  const changeLocation = (locationNumber) => {
    console.log(`Editing Location ${locationNumber}..`);
  };

  const sendConfirmationText = (locationNumber) => {
    console.log(`Sending Location ${locationNumber} a text..`);
  };

  const sendConfirmationEmail = (locationNumber) => {
    console.log(`Sending Location ${locationNumber} an email..`);
  };

  return (
    <div className="box" style={{ backgroundColor: "#f8f7fa" }}>
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr>
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
              <button
                className="mx-1"
                onClick={() => sendDriverText(props.index + 1)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
                {/* <span className="tooltiptext">Message Driver</span> */}
              </button>
            </th>
            <th
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
            </th>
          </tr>
        </thead>
        <tbody hidden={hidden}>
          {props.route.map((location, idx) => (
            <tr
              key={idx}
              className={
                props.selectedLocation.driver === props.index + 1 &&
                props.selectedLocation.location === idx + 1
                  ? "is-selected"
                  : ""
              }
            >
              <td>
                <button
                  className={"button is-rounded is-small mx-1"}
                  onClick={() => handleSelect(props.index + 1, idx + 1)}
                  style={{ padding: "0.69rem" }}
                >
                  {idx + 1}
                </button>
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => skipLocation(idx + 1)}
                >
                  Skip
                </button>
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => changeLocation(idx + 1)}
                >
                  Change
                </button>
              </td>
              <td>{location["address"]}</td>
              <td>00:00 am</td>
              <td>00:00 pm</td>
              <td>
                {/* <button className="tooltip button is-rounded is-small mx-1"> */}
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => sendConfirmationText(idx + 1)}
                >
                  <FontAwesomeIcon icon={Icons.faComment} />
                  {/* <span className="tooltiptext">Message Customer</span> */}
                </button>
                {/* <button className="tooltip button is-rounded is-small mx-1"> */}
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => sendConfirmationEmail(idx + 1)}
                >
                  <FontAwesomeIcon icon={Icons.faEnvelope} />
                  {/* <span className="tooltiptext">Email Customer</span> */}
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
