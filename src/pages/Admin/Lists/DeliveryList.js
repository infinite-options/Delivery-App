import React, { useState, useReducer, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import axios from "axios";
import { BASE_URL } from "utils/Functions/DataFunctions";

function init(data) {
  const route_data = Object.entries(data.routes);
  // List of available drivers
  const drivers_list = (drivers => { // Entry: [driver_id, driver_name]
    let list = [];
    Object.entries(drivers).forEach(entry => {
      if (!Object.values(data.routes).find(route => entry[0] === route.driver_id)) {
        console.log(entry[0], entry[1].first_name)
        list.push([
          entry[0], 
          entry[1].first_name + " " + entry[1].last_name, 
        ]);
      }
    });
    console.log(list);
    return list;
  })(data.drivers);

  // Object of all route drivers that have been edited
  const route_drivers = {}; // Entry: {driver_id, driver_name}
  const selected_options = (drivers => { // Entry: {business_id, route_option, date}
    let options = [];
    route_data.forEach(routeEntry => {
      const condition = drivers[routeEntry[1].driver_id] && 
                        !(options.find(option => (
                          option.business_id === routeEntry[1].business_id && option.date === routeEntry[1].date
                        )));
      if (condition) options.push({
        business_id: routeEntry[1].business_id, 
        route_option: routeEntry[1].route_option,
        date: routeEntry[1].date,
      });
    });
    return options;
  })(data.drivers);

  return {
    route_data,
    drivers_list,
    route_drivers,
    selected_options,
  };
};

function reducer(state, action) {
  switch(action.type) {
    case 'route-update':
      if (!action.payload.filter) return { ...state, route_data: action.payload.routes };
      let filteredRouteData = action.payload.routes.filter(route => {
        // console.log(route[1][props.filter.option], props.filter.value);
        // eslint-disable-next-line
        return route[1][action.payload.filter.option] == action.payload.filter.value
      });
      return {
        ...state,
        route_data: filteredRouteData,
      };
    case 'selected-options-update':
      let selected_options;
      if (!action.payload.selected) {
        selected_options = [...state.selected_options];
        // console.log(selected_options);
        selected_options.push({ 
          business_id: action.payload.route.business_id, 
          route_option: action.payload.route.route_option, 
          date: action.payload.route.date, 
        });
        return {
          ...state,
          selected_options,
        };
      }
      selected_options = [...state.selected_options].filter(option => (
        option.business_id !== action.payload.route.business_id || 
        option.route_option !== action.payload.route.route_option || 
        option.date !== action.payload.route.date
      ));
      return {
        ...state,
        selected_options,
      };
    case 'driver-select':
      let newList = [...state.drivers_list].filter(entry => entry[0] !== action.payload.driver_id);
      if (action.payload.driver) newList.push(action.payload.driver)

      let newRouteDrivers = { ...state.route_drivers };
      newRouteDrivers[action.payload.route_id] = { id: action.payload.driver_id, name: action.payload.driver_name };
      return {
        ...state,
        drivers_list: newList,
        route_drivers: newRouteDrivers,
      };
    default: return state;
  }
};

function DeliveryList({ routes, drivers, ...props }) {
  console.log("rendering deliveries..");

  const [state, deliveryDispatch] = useReducer(reducer, { routes, drivers }, init);
  console.log(state);

  useEffect(() => {
    const routeData = Object.entries(routes);
    deliveryDispatch({ type: "route-update", payload: { 
      filter: props.filter.option ? props.filter : undefined, 
      routes: routeData,
    } });
  }, [routes, props.filter]);
  
  const saveRoutesDrivers = async () => {
    console.log("SAVING DRIVERS TO THEIR ROUTES");
    await (() => {
      const routeDriverEntries = Object.entries(state.route_drivers);
      return new Promise((resolve, reject) => {
        for (let routeDriver of routeDriverEntries) {
          if(routes[routeDriver[0]].driver_id !== routeDriver[1].id) {
            axios.get(BASE_URL + `updateDriverID/${routeDriver[1].id}/${routeDriver[0]}`)
            .then(response => {
              console.log(response);
              if (routeDriver[1] === state.route_drivers[routeDriverEntries.length - 1]) resolve('success');
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
          }
        }
      });
    })();
  };

  // const [sort, setSort] = useState("businesses");

  return (
    <React.Fragment>
      <button
        className="button is-small mx-1 is-success is-outlined is-rounded" 
        style={{ marginBottom: "1rem" }}
        // disabled={Object.values(driversToRoutes).length !== Object.values(routes).length}
        onClick={saveRoutesDrivers}
      >
        <FontAwesomeIcon icon={Icons.faCheck} className="mr-2" />
        Save Changes
      </button>
      {/* <RouteSort sort={sort} setSort={setSort} /> */}
      {state.route_data.map((route, index) => (route[1].date === props.date && 
        <RouteItem
          key={index}
          index={index}
          route={route[1]}
          id={route[0]}

          driver_id={route[1].driver_id}
          driver_name={
            drivers[route[1].driver_id] ? 
              drivers[route[1].driver_id].first_name + " " + drivers[route[1].driver_id].last_name :
              undefined
          }
          
          selectedLocation={props.selectedLocation}
          setSelectedLocation={props.setSelectedLocation}
          
          deliveryState={state}
          deliveryDispatch={deliveryDispatch}
          dispatch={props.dispatch}
        />
      ))}
    </React.Fragment>
  );
}

// function RouteSort({ sort, setSort, ...props }) {
//   const [open, setOpen] = useState(false);

//   const handleSelect = (type) => {
//     setSort(type);
//     setOpen(false);
//   }

//   return (
//     <div className={"dropdown" + (open ? " is-active" : "")}>
//       <div className="dropdown-trigger">
//         <button 
//           className="button is-small"
//           onClick={() => setOpen(prevOpen => !prevOpen)} 
//           aria-haspopup="true" 
//           aria-controls="dropdown-menu"
//         >
//           Sort By: {sort.charAt(0).toUpperCase() + sort.slice(1)}
//           <FontAwesomeIcon icon={Icons.faCaretDown} className= "ml-2" />
//         </button>
//       </div>
//       <div className="dropdown-menu" style={{ paddingTop: 0 }} id="dropdown-menu" role="menu">
//         <div className="dropdown-content">
//           <button 
//             className="button is-small is-white dropdown-item" 
//             onClick={() => handleSelect("businesses")}
//             disabled={sort === "businesses"}
//           >
//             Businesses
//           </button>
//           {/* <button 
//             className="button is-small is-white dropdown-item"
//             onClick={() => handleSelect("date")}
//             disabled={sort === "date"}
//           >
//             Date
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

function RouteItem({ route, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [driver, setDriver] = useState(() => {
    if (props.driver_name) return [props.driver_id, props.driver_name];
  });

  const route_id = Number(id.substring(id.indexOf("-") + 1, id.length));
  
  const selected = (() => {
    // console.log(props.selectedOptions);
    return Boolean(props.deliveryState.selected_options.find(option => (
      option.business_id === route.business_id && 
      option.route_option === route.route_option && 
      option.date === route.date
    )));
  })();

  const disabled = (() => {
    const option = 
      props.deliveryState.selected_options.find(option => option.business_id === route.business_id) || 
      { route_option: route.route_option };

    return (
      option.route_option !== route.route_option && 
      option.date === route.date
    );
  })();
  // console.log(selected);

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

  const handleOption = () => {
    props.deliveryDispatch({ 
      type: "selected-options-update", 
      payload: { route, selected } 
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
    <React.Fragment>
      {route.route_option == 1 && (
        <React.Fragment>
          <h2 className="has-text-weight-bold has-text-grey ml-2">{route["Business Name"]}</h2>
          <hr className="mt-1 has-background-grey-light" style={{ minWidth: "max(800px, 100%)" }} />
        </React.Fragment>
      )}
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
                {selected && (
                  <div style={{ width: "325%", maxWidth: "250px" }}>
                    <DriversDropdown 
                      route_id={id}
                      driver_num={route.driver_num}
                      driver={driver} 
                      setDriver={setDriver}
                      list={props.deliveryState.drivers_list} 
                      // setList={props.setDriversList} 
                      // setDriversToRoutes={props.setDriversToRoutes}

                      deliveryDispatch={props.deliveryDispatch}
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
                )}
              </th>
              <th style={{ width: "12.5%" }} />
              <th style={{ width: "12.5%" }} />
              <th style={{ width: "17.5%" }}>
                <button
                  className="button is-super-small"
                  onClick={() => handleOption()}
                  disabled={disabled}
                >
                  {selected ? "Des" : "S"}elect Option
                </button>
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
            {Object.values(route.route_data).map((location, index) => (
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
    </React.Fragment>
  );
}

function DriversDropdown({ driver, setDriver, list/*, setList*/, ...props }) {
  const [open, setOpen] = useState(false);
  // console.log(driver);
  const route_driver_id = driver ? 
    Number(driver[0].substring(driver[0].indexOf("-") + 1, driver[0].length)) : 
    undefined;

  const handleDriverSelect = (driver_id, driver_name) => {
    props.deliveryDispatch({ 
      type: "driver-select", 
      payload: { route_id: props.route_id, driver, driver_id, driver_name }, 
    });
    setDriver(driver_id ? list.find(entry => entry[0] === driver_id) : undefined);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <span className="mr-1">Driver {props.driver_num}:</span>
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
