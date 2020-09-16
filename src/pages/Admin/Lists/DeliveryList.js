import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import axios from "axios";
import { BASE_URL } from "utils/Functions/DataFunctions";

function DeliveryList({ routes, drivers, ...props }) {
  console.log("rendering deliveries..");
  const [routeData, setRouteData] = useState(Object.entries(routes));
  const [driversList, setDriversList] = useState(Array.from(
    Object.entries(drivers), 
    entry => ([
      entry[0], 
      `${entry[1].first_name} ${entry[1].last_name}`
    ])
  ));
  const [driversToRoutes, setDriversToRoutes] = useState({}); // { route_id: [driver_id, driver_name], ... }
  console.log(driversToRoutes);
  // console.log(Object.values(driversToRoutes).length, Object.values(routes).length);

  useEffect(() => {
    const routeData = Object.entries(routes);
    if (props.filter) {
      setRouteData(() => {
        let filteredRouteData = routeData.filter(route => {
          // console.log(route[1][props.filter.option], props.filter.value);
          // eslint-disable-next-line
          return route[1][props.filter.option] == props.filter.value
        });
        return filteredRouteData;
      });
    }
    else setRouteData(routeData);
  }, [routes, props.filter]);
  
  const saveRoutesDrivers = async () => {
    console.log("SAVING DRIVERS TO THEIR ROUTES");
    await (() => {
      const routeDriverEntries = Object.entries(driversToRoutes);
      return new Promise((resolve, reject) => {
        for (let routeDriver of routeDriverEntries) {
          axios.get(BASE_URL + `updateDriverID/${routeDriver[1].id}/${routeDriver[0]}`)
          .then(response => {
            console.log(response);
            if (routeDriver[1] === driversToRoutes[routeDriverEntries.length - 1]) resolve('success');
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
        }
      });
    })();
    // props.dispatch({ type: 'update-route-drivers', payload: { route_drivers: driversToRoutes } })

  };

  return (
    <React.Fragment>
      {/* NOTE: User only able to save once drivers are chosen for ALL routes, is this what we want? */}
      <button
        className="button is-small mx-1 is-success is-outlined is-rounded" 
        style={{ marginBottom: "1rem" }}
        disabled={Object.values(driversToRoutes).length !== Object.values(routes).length}
        onClick={saveRoutesDrivers}
      >
        <FontAwesomeIcon icon={Icons.faCheck} className="mr-2" />
        Save Changes
      </button>
      {routeData.map((route, index) => (
        <RouteItem
          key={index}
          index={index}
          route={route[1]}
          id={route[0]}
          selectedLocation={props.selectedLocation}
          setSelectedLocation={props.setSelectedLocation}
          drivers={drivers}
          driversList={driversList}
          setDriversList={setDriversList}
          driversToRoutes={driversToRoutes}
          setDriversToRoutes={setDriversToRoutes}
          dispatch={props.dispatch}
        />
      ))}
    </React.Fragment>
  );
}

function RouteItem({ route, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [driver, setDriver] = useState(() => {
    let driver = props.driversList.find(entry => entry[0] === route.driver_id);
    if (driver) return driver;
    const driver_route_id = Object.keys(props.driversToRoutes).find(route_id => route_id === id);
    // console.log("ID", driver_route_id);
    return (driver_route_id ? 
      [props.driversToRoutes[driver_route_id].id, props.driversToRoutes[driver_route_id].name] : 
      undefined
    );
  });
  const route_values = Object.values(route.route_data);
  // console.log(route_values);
  const route_id = Number(id.substring(id.indexOf("-") + 1, id.length));

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
              <div style={{ width: "200%", maxWidth: "225px" }}>
                <button 
                  className="button is-super-small is-rounded mr-3" 
                  onClick={handleVisibilitySelect}
                >
                  <FontAwesomeIcon icon={route.visible ? Icons.faEyeSlash : Icons.faEye} />
                </button>
                <div
                  className="route"
                  style={{ 
                    backgroundColor: `${route.visible ? route.route_color : "lightgrey"}`,
                    borderBottom: `3px solid ${route.visible ? route.route_color : "lightgrey"}`, 
                    // Adding conditional margin since icon sizes vary, accounting for text shift
                    ...(!route.visible ? { marginLeft: "1.32px" } : {}) 
                  }}
                >
                  <span>Route {route_id}</span></div>
              </div>
            </th>
            <th style={{ width: "29%" }} />
            <th style={{ width: "11%" }}>
              <div style={{ width: "300%", maxWidth: "225px" }}>
                <DriversDropdown 
                  route_id={id}
                  driver={driver} 
                  setDriver={setDriver}
                  list={props.driversList} 
                  setList={props.setDriversList} 
                  setDriversToRoutes={props.setDriversToRoutes}
                />
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
            </th>
            <th style={{ width: "17.5%" }}>
              <button
                className="button is-super-small is-pulled-right"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon icon={hidden ? Icons.faCaretDown : Icons.faCaretUp} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody hidden={hidden}>
          <tr>
            <th style={{borderBottomWidth: "2px"}}>
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
              <td>
                <button
                  className={"button is-rounded is-small mx-1"}
                  disabled={!route.visible}
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
    </div>
  );
}

function DriversDropdown({ driver, setDriver, list, setList, ...props }) {
  const [open, setOpen] = useState(false);
  // console.log(driver);
  const route_driver_id = driver ? 
    Number(driver[0].substring(driver[0].indexOf("-") + 1, driver[0].length)) : 
    undefined;

  // I WANT THIS TO RUN WHENEVER LIST IS CHANGED BY THE PARENT
  useEffect(() => {
    // if route already has a driver selected, remove the driver as an option from the dropdown
    if (driver) {
      setList(prevList => {
        return [...prevList].filter(entry => entry[0] !== driver[0]);
      });
      props.setDriversToRoutes(prevDriversToRoutes => {
        return ({
          ...prevDriversToRoutes,
          [props.route_id]: { id: driver[0], name: driver[1] },
        });
      });
    }
  }, []);

  const handleDriverSelect = (driver_id, driver_name) => {
    setList(prevList => {
      let newList = [...prevList].filter(entry => entry[0] !== driver_id);
      if (driver) newList.push(driver);
      return newList;
    });
    props.setDriversToRoutes(prevDriversToRoutes => {
      let newDriversToRoutes = { ...prevDriversToRoutes };
      // checking if user selected or deselected a driver
      if (driver_id) newDriversToRoutes[props.route_id] = { id: driver_id, name: driver_name };
      else delete newDriversToRoutes[props.route_id];
      return newDriversToRoutes;
    });
    setDriver(driver_id ? list.find(entry => entry[0] === driver_id) : undefined);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <span className="mr-1">
        {/* {driver ? (`Driver ${route_driver_id}:`) : (`Driver:`)} */}
        Driver:
      </span>
      <div className={"dropdown" + (open ? " is-active" : "")}>
        <div className="dropdown-trigger">
          <button 
            className="button is-super-small"
            style={{ width: "100px", ...(!driver && { borderColor: "red", color: "red" }) }} 
            onClick={() => setOpen(prevOpen => !prevOpen)} 
            aria-haspopup="true" 
            aria-controls="dropdown-menu"
            {...driver && { title: `Driver ID: ${route_driver_id}` }}
          >
            {driver ? driver[1] : 'Choose Driver'}
            <FontAwesomeIcon icon={Icons.faCaretDown} className= "ml-2" />
          </button>
        </div>
        <div className="dropdown-menu" style={{ paddingTop: 0 }} id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <button 
              className="button is-small is-white dropdown-item" 
              disabled={!driver} 
              onClick={() => handleDriverSelect()}
            >
              Deselect
            </button>
            <hr className="dropdown-divider" />
            {list.map((item, index) => (
              <button 
                key={index} 
                className="button is-small is-white dropdown-item" 
                onClick={() => handleDriverSelect(item[0], item[1])}
                title={`Driver ID: ${Number(item[0].substring(item[0].indexOf("-") + 1, item[0].length))}`}
              >
                {item[1]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default DeliveryList;
