import React, { useState, useReducer, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import LeafletMap from "./LeafletMap";
import DeliveryList from "./Lists/DeliveryList";
import DriverList from "./Lists/DriverList";
import BusinessList from "./Lists/BusinessList";
import CustomerList from "./Lists/CustomerList";
import VehicleList from "./Lists/VehicleList";
import OrderList from "./Lists/OrderList";
import ConstraintList from "./Lists/ConstraintList";
import DeliveryView from "./DeliveryView";
import AppIcon from "Icons/app_icon.png";
// import axios from "axios";
// created another file for functions that load data from server, since this file was getting too large for my liking,
// should I stick to this or revert this change?
import { createRoutes, createDrivers, createBusinesses, createCustomers, createOrders } from "./DataFunctions";

const initState = {
  isLoading: true,
  routes: {},
  drivers: {},
  businesses: {},
  customers: {},
  vehicles: {},
  orders: {},
  constraints: {},
};

function reducer(state, action) {
  switch(action.type) {
    case 'init':
      return action.payload.data;
    case 'route-toggle-visibility':
      // console.log({...state});
      return { 
        ...state,
        routes: {
          ...state.routes,
          [action.payload.id]: {
            ...state.routes[action.payload.id],
            visible: !state.routes[action.payload.id].visible,
          }
        }
      };
    default:
      return state;
  }
}

function MapPage() {
  console.log("rendering page..");

  // possibly use this with useContext, figure out how to reduce rerenders upon data change
  const [data, dispatch] = useReducer(reducer, initState);
  console.log(data);
  const [times, setTimes] = useState([
    { value: "00 am - 00 pm" },
    { value: "01 am - 01 pm" },
    { value: "02 am - 02 pm" },
    { value: "03 am - 03 pm" },
    { value: "04 am - 04 pm" },
  ]); // useState(GET_ROUTE_TIMES)
  const timeSlotInit = Number(window.localStorage.getItem("timeSlot")) || 0; 
  const headerTabInit = Number(window.localStorage.getItem("headerTab")) || 0;
  const [timeSlot, setTimeSlot] = useState(timeSlotInit); 
  const [headerTab, setHeaderTab] = useState(headerTabInit); 
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    window.localStorage.setItem("headerTab", headerTab);
  }, [headerTab]);

  useEffect(() => {
    window.localStorage.setItem("timeSlot", timeSlot);
  }, [timeSlot]);

  useEffect(() => {
    Promise.allSettled([
      createDrivers(),
      createBusinesses(),
      createCustomers(),
      createOrders(),
    ])
    .then((result) => {
      // console.log("API responses:", result);
      createRoutes(result[1].value)
      .then(response => {
        // console.log("route resp:", response);
        const data = {
          isLoading: false,
          routes: response,
          drivers: result[0].value,
          businesses: result[1].value,
          customers: result[2].value,
          vehicles: {}, // FIXME: CALL API
          orders: result[3].value,
          constraints: {}, // FIXME: CALL API
        };
        dispatch({ type: "init", payload: { data } });
      });
    });
  }, []);

  const handleBurger = (onItemSelect=false) => {
    console.log("Burger interaction..");

    const element = document.getElementById("selections");
    if (onItemSelect) {
      element.style.display = "none";
    } else {
      element.style.display =
        element.style.display === "block" ? "none" : "block";
    }
  };

  const [onView, setOnView] = useState("none");
  const handleView = (type) => {
    console.log("Open day view..");

    handleBurger(true);
    setOnView(onView === type ? "none" : type);
    // open day view modal
  };

  const handleHeaderTab = () => {
    // might as well also handle time slots here!
    if (Math.floor(timeSlot) !== timeSlot || timeSlot < 0 || timeSlot > times.length - 1) setTimeSlot(0);

    switch (headerTab) {
      case 0:
        return (
          <DeliveryList
            routes={data.routes}
            drivers={data.drivers}
            businesses={data.businesses}
            customers={data.customers}
            props={{ selectedLocation, setSelectedLocation, dispatch }}
          />
        );
      case 1:
        return (
          <DriverList
            drivers={data.drivers}
            routes={data.routes} // for creating route preferences, probably
          />
        );
      case 2:
        return (
          <BusinessList 
            businesses={data.businesses}
          />
        );
      case 3:
        return (
          <CustomerList 
            customers={data.customers}
          />
        );
      case 4:
        return (
          <VehicleList 
            vehicles={data.vehicles}
          />
        );
      case 5:
        return (
          <OrderList 
            orders={data.orders}
          />
        );
      case 6:
        return (
          <ConstraintList
            constraints={data.constraints}
          />
        );
      default:
        setHeaderTab(0);
    }
  };

  return (
    <React.Fragment>
      <Header 
        tab={headerTab}
        changeTab={setHeaderTab}
        handleBurger={handleBurger} 
        handleDayView={() => handleView("day")}
        handleWeekView={() => handleView("week")}
      />
      {/* Views */}
      <DeliveryView
        type="day"
        times={times}
        timeSlot={timeSlot}
        visible={onView === "day"}
        onClick={() => handleView("day")}
      />
      <DeliveryView
        type="week"
        // times={times}
        visible={onView === "week"}
        onClick={() => handleView("week")}
      />
      {data.isLoading ? (
        <div className="loading-screen" />
      ) : (
        <div className="map-page">
          <div className="columns" style={{ margin: "auto" }}>
            {headerTab < 4 && (
              <div className="column is-half" style={{ padding: "0" }}>
                <RouteTimes
                  times={times}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                />
                <div className="sticky">
                  <LeafletMap
                    routes={data.routes}
                    props={{ selectedLocation, setSelectedLocation }}
                  />
                </div>
              </div>
            )}
            <div
              className={"column" + (headerTab < 4 ? " is-half" : " is-full")}
              style={{ padding: "0 0.75rem", marginTop: (headerTab < 4 ? "5vh" : "1vh") }}
            >
              <div className={"box" + (headerTab < 4 ? " map" : " no-map")}>
                {handleHeaderTab()}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function Header(props) {
  console.log("rendering header..");
  const tabs = ["Delivery", "Drivers", "Businesses", "Customers", "Vehicles", "Orders & Shipments", "Constraints"];

  const handleTabChange = (index) => {
    if (props.tab !== index) props.changeTab(index);
  }

  return (
    <div className="header-parent">
      <div className="header-main">
        <img
          className="has-text-left"
          src={AppIcon}
          alt="Just Delivered"
          style={{ alignSelf: "center", maxHeight: "5vh" }}
        />
        <p
          className="has-text-centered"
          style={{ width: "100%", fontSize: "3vh" }}
        >
          ADMIN DASHBOARD
        </p>
        {tabs.map((value, idx) => (
          <button 
            key={idx} 
            className="button is-lightgrey is-sharp is-tilted-right is-fullheight"
            onClick={() => handleTabChange(idx)}
            style={{ backgroundColor: props.tab === idx && "yellow" }}
          >
            {value}
          </button>
        ))}
        <button
          className="button is-white is-fullheight ml-1"
          onClick={() => props.handleBurger()}
        >
          <FontAwesomeIcon icon={Icons.faBars} />
        </button>
      </div>
      <ul id= "selections" className="header-burger">
        <li>
          <button
            className="button is-white is-fullwidth"
            onClick={props.handleDayView}
          >
            Day View
          </button>
        </li>
        <li>
          <button
            className="button is-white is-fullwidth"
            onClick={props.handleWeekView}
          >
            Week View
          </button>
        </li>
      </ul>
    </div>
  );
}

function RouteTimes(props) {
  console.log("rendering times..");
  const handleTimeChange = (index) => {
    // console.log(index);
    if (props.timeSlot !== index) props.setTimeSlot(index);
  };

  return (
    <div className="columns routes" style={{ margin: "0" }}>
      {props.times.map((time, idx) => (
        <div
          key={idx}
          className="column"
          style={{ maxWidth: `${100 / props.times.length}%` }}
        >
          <button
            className="button is-fullwidth is-small"
            onClick={() => handleTimeChange(idx)}
            style={{ backgroundColor: props.timeSlot === idx && "yellow" }}
          >
            {time.value}
          </button>
        </div>
      ))}
    </div>
  );
}

export default MapPage;
