import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";

function DeliveryList({ routes, ...props }) {
  console.log("rendering deliveries..");
  const [routeData, setRouteData] = useState(Object.entries(routes));

  useEffect(() => {
    const routeData = Object.entries(routes);
    if (props.filter) {
      setRouteData(() => {
        return routeData.filter(route => {
          // console.log(route[1][props.filter.option], props.filter.value);
          // eslint-disable-next-line
          return route[1][props.filter.option] == props.filter.value
        });
      });
    }
    else setRouteData(routeData);
  }, [routes, props.filter]);
  
  // const [selectedLocation, setSelectedLocation] = useState({});
  // const selectedLocation = props.selectedLocation;
  // const setSelectedLocation = props.setSelectedLocation;
  // const dispatch = props.dispatch;

  return (
    <React.Fragment>
      {routeData.map((route, index) => (
        // think about using fewer components, could probably just do route[0] and route[1]
        <RouteItem
          key={index}
          index={index}
          route={route[1]}
          id={route[0]}
          selectedLocation={props.selectedLocation}
          setSelectedLocation={props.setSelectedLocation}
          dispatch={props.dispatch}
        />
      ))}
    </React.Fragment>
  );
}

function RouteItem({ route, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const route_values = Object.values(route.route_data);
  // console.log(route_values);

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

  const handleVisibilitySelect = () => {
    props.setSelectedLocation({
      driver: undefined,
      location: undefined,
    });
    props.dispatch({ type: "toggle-visibility", payload: { id, type: "routes" } });
  }

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
    <div className="box list-item">
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr className="list-item-head">
            <th style={{ width: "17.5%" }}>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <div style={{ width: "200%", maxWidth: "225px" }}>
                <button 
                  className="button is-super-small is-rounded mr-3" 
                  onClick={handleVisibilitySelect}
                >
                  <FontAwesomeIcon icon={route.visible ? Icons.faEyeSlash : Icons.faEye} />
                </button>
                {/* Adding conditional margin since icons are different sizes, have to account for text shift */}
                <div
                  className="route"
                  style={{ 
                    // this div refuses to be vertically centered so this is my workaround
                    backgroundColor: `${route.visible ? route.route_color : "lightgrey"}`,
                    borderBottom: `3px solid ${route.visible ? route.route_color : "lightgrey"}`, 
                    ...(!route.visible ? {marginLeft: "1.32px"} : {}) 
                  }}
                ><span>Route {id}</span></div>
              </div>
              {/* <span {...(!route.visible ? { style: { marginLeft: "1.32px" } } : {})}>Route {id}</span> */}
            </th>
            <th style={{ width: "30%" }} />
            <th style={{ width: "10%" }}>
              <div style={{ width: "300%", maxWidth: "225px" }}>
                <span>{`Driver ${route.driver_id}: ${route.driver_first_name} ${route.driver_last_name[0]}.`}</span>
                <button
                  className="button is-rounded is-super-small is-pulled-right ml-1"
                  onClick={() => console.log("Not sure what this does atm")}
                >
                  <FontAwesomeIcon icon={Icons.faPhone} />
                </button>
                <button
                  className="button is-rounded is-super-small is-pulled-right"
                  onClick={() => sendDriverText(route.driver_id)}
                >
                  <FontAwesomeIcon icon={Icons.faComment} />
                </button>
              </div>
            </th>
            <th style={{ width: "12.5%" }} />
            <th style={{ width: "12.5%" }}>
              {/* <div style={{ width: "110%" }}>
                <button
                  className="button is-rounded is-super-small mr-1"
                  onClick={() => sendDriverText(route.driver_id)}
                >
                  <FontAwesomeIcon icon={Icons.faComment} />
                </button>
                <button
                  className="button is-rounded is-super-small"
                  onClick={() => console.log("Not sure what this does atm")}
                >
                  <FontAwesomeIcon icon={Icons.faPhone} />
                </button>
              </div> */}
            </th>
            <th style={{ width: "17.5%" }}>
              <button
                className="button is-super-small is-pulled-right"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
            </th>
          </tr>
        </thead>
        <tbody hidden={hidden}>
          <tr>
            <th style={{borderBottomWidth: "2px"}}>
              {/* <span className="ml-1">{`Driver: ${props.driver_first_name} ${props.driver_last_name[0]}.`}</span>
              <button
                className="button is-rounded is-super-small mx-3"
                onClick={() => sendDriverText(route.driver_id)}
              >
                <FontAwesomeIcon icon={Icons.faComment} />
              </button> */}
            </th>
            <th style={{borderBottomWidth: "2px"}}>Destination</th>
            <th style={{borderBottomWidth: "2px"}}>Customer</th>
            <th style={{borderBottomWidth: "2px"}}>ETA</th>
            <th style={{borderBottomWidth: "2px"}}>Arrival</th>
            <th style={{borderBottomWidth: "2px"}}><span className="ml-2">Confirm</span></th>
          </tr>
          {route_values.map((location, index) => (
            <tr
              key={index}
              className={
                props.selectedLocation.driver === props.index + 1 &&
                props.selectedLocation.location === index + 1
                  ? "is-selected"
                  : ""
              }
            >
              {/* {console.log("What", props)} */}
              <td>
                <button
                  className={"button is-rounded is-small mx-1"}
                  disabled={!route.visible}
                  // {...(!route.visible && { title: "this route is hidden" })}
                  onClick={() => handleSelect(props.index + 1, index + 1)}
                  style={{ padding: "0.69rem" }}
                >
                  {index + 1}
                </button>
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => skipLocation(index + 1)}
                >
                  Skip
                </button>
                {/* <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => changeLocation(index + 1)}
                >
                  Change
                </button> */}
              </td>
              <td>{location.address}</td>
              <td>{`${location.customer_first_name} ${location.customer_last_name[0]}.`}</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>
                {/* <button className="tooltip button is-rounded is-small mx-1"> */}
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => sendConfirmationText(index + 1)}
                >
                  <FontAwesomeIcon icon={Icons.faComment} />
                  {/* <span className="tooltiptext">Message Customer</span> */}
                </button>
                {/* <button className="tooltip button is-rounded is-small mx-1"> */}
                <button
                  className="button is-rounded is-small mx-1"
                  onClick={() => sendConfirmationEmail(index + 1)}
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
        {route.map((location, index) => (
          <div key={index} className="box">
            Destination {index + 1} : ({location["to"][0]}, {location["to"][1]})
          </div>
        ))}
      </div> */}
    </div>
  );
}

function RouteColor({ color }) {
  return (
    <div className="level" style={{ justifyContent: "flex-start" }}>
      <div className="level-left">
        <div
          className="level-item route"
          style={{ width: "150px", borderBottom: `3px solid ${color}` }}
        ></div>
      </div>
      <div className="level-right" style={{ alignItems: "left" }}>
        <span className="level-item ml-2" style={{ backgroundColor: "#ededed" }}>Route</span>
      </div>
    </div>
  );
}

export default DeliveryList;
