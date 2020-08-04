import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";

function DeliveryList({ routes, drivers, businesses, customers, props }) {
  // const [selectedLocation, setSelectedLocation] = useState({});
  const selectedLocation = props.selectedLocation;
  const setSelectedLocation = props.setSelectedLocation;

  return (
    <React.Fragment>
      {Object.entries(routes).map((route, index) => (
        <RouteItem
          key={index}
          props={{
            id: route[0],
            route: route[1].route_data,
            color: route[1].route_color,
            driver_id: route[1].driver_id,
            driver_first_name: drivers[route[1].driver_id].first_name,
            driver_last_name: drivers[route[1].driver_id].last_name,
            // business id, business name, etc
            customers,
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
  const route_values = Object.values(props.route);
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
    <div className="box list-item" style={{ backgroundColor: "#f8f7fa", display: "inline-block", minWidth: "100%" }}>
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: "#ededed", minWidth: "210px" }}>
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
            </th>
            <th
              style={{ backgroundColor: "#ededed", minWidth: "250px" }}
            >
              <div
                className="route"
                style={{ borderBottom: `3px solid ${props.color}` }}
              >
                <span style={{ backgroundColor: "#ededed" }}>Route</span>
              </div>
            </th>
            <th style={{ backgroundColor: "#ededed", minWidth: "75px" }} />
            <th style={{ backgroundColor: "#ededed", minWidth: "70px" }} />
            <th style={{ backgroundColor: "#ededed", minWidth: "70px" }} />
            <th style={{ backgroundColor: "#ededed", minWidth: "125px" }}/>
          </tr>
        </thead>
        <tbody hidden={hidden}>
          <tr>
            <th style={{borderBottomWidth: "2px"}}>
              <span className="ml-1">{`${props.driver_first_name} ${props.driver_last_name[0]}.`}</span>
              <button
                className="button is-rounded is-super-small mx-3"
                onClick={() => sendDriverText(props.driver_id)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
              </button>
            </th>
            <th style={{borderBottomWidth: "2px"}}>Destination</th>
            <th style={{borderBottomWidth: "2px"}}>Customer</th>
            <th style={{borderBottomWidth: "2px"}}>ETA</th>
            <th style={{borderBottomWidth: "2px"}}>Arrival</th>
            <th style={{borderBottomWidth: "2px"}}><span className="ml-2">Confirm</span></th>
          </tr>
          {route_values.map((location, idx) => (
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
              <td>{location.address}</td>
              <td>{`${props.customers[location.customer_id].first_name} ${props.customers[location.customer_id].last_name[0]}.`}</td>
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

export default DeliveryList;
