import React, { useState, useReducer, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import LeafletMap from "./LeafletMap";
import DeliveryList from "./Lists/DeliveryList";
import DriverList from "./Lists/DriverList";
import BusinessList from "./Lists/BusinessList";
import CustomerList from "./Lists/CustomerList";
import OrderList from "./Lists/OrderList";
import DeliveryView from "./DeliveryView";
import AppIcon from "Icons/app_icon.png";
import axios from "axios";

const rainbow = (numOfSteps, step) => {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch (i % 6) {
    case 0: r = 1; g = f; b = 0; break;
    case 1: r = q; g = 1; b = 0; break;
    case 2: r = 0; g = 1; b = f; break;
    case 3: r = 0; g = q; b = 1; break;
    case 4: r = f; g = 0; b = 1; break;
    case 5: r = 1; g = 0; b = q; break;
  }
  var c = "#" +
    ("00" + (~~(r * 255)).toString(16)).slice(-2) +
    ("00" + (~~(g * 255)).toString(16)).slice(-2) +
    ("00" + (~~(b * 255)).toString(16)).slice(-2);
  return c;
};

const initState = {
  isLoading: true,
  routes: {},
  drivers: {},
  businesses: {},
  customers: {},
  orders: {},
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

// "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/";
const BASE_URL = 
  "https://lu636s0qy3.execute-api.us-west-1.amazonaws.com/dev/api/v2/";

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
  // const [routeColors, setRouteColors] = useState([]);

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
      console.log("API responses:", result);
      createRoutes(result[1].value)
      .then(response => {
        console.log("route resp:", response);
        // setData(() => ({
        //   routes: response,
        //   drivers: result[0].value,
        //   businesses: result[1].value,
        //   customers: result[2].value,
        //   orders: result[3].value,
        // }));
        const data = {
          isLoading: false,
          routes: response,
          drivers: result[0].value,
          businesses: result[1].value,
          customers: result[2].value,
          orders: result[3].value,
        };
        dispatch({ type: "init", payload: { data } });
        // setIsLoading(false);
      });
    });
  }, []);

  /* New route structure:
   *
   * Object > {
   *     route_id: {
   *         business_id,
   *         driver_id,
   *         visible,
   *         route_color,
   *         route_data: [
   *             {
   *                 customer_id,
   *                 from: [prevLatitude, prevLongitude], 
   *                 to: [latitude, longitude], 
   *                 address,
   *             }, ...
   *         ]
   *     }, ...
   * }
  */
  const createRoutes = (businesses) => {
    return axios.get(BASE_URL + "getCustomerRoutes")
    .then(response => {
      // console.log("temprouteS:", response);
      const result = response.data.result.result;
      let tempRoutes = {};
      for (let location of result) {
        const route_id = location.route_id;
        const location_data = {
          customer_id: location.customer_id,
          address: `${location.customer_street} ${location.customer_city} ${location.customer_state} ${location.customer_zip}`,
          // from: tempRoutes[route_id].route_data[route_data.length - 1].to,
          to: [location.customer_latitude, location.customer_longitude],
        }
        if (route_id in tempRoutes) {
          location_data.from = tempRoutes[route_id].route_data[tempRoutes[route_id].route_data.length - 1].to;
          // console.log("route data:", tempRoutes[route_id].route_data);
          tempRoutes[route_id].route_data.push(location_data);
        }
        else {
          // console.log("route's business", businesses[location.business_id]);
          location_data.from = [businesses[location.business_id].latitude, businesses[location.business_id].longitude];
          tempRoutes[route_id] = {
            business_id: location.business_id,
            driver_id: location.driver_id,
            visible: true,
            route_data: [location_data],
          };
        }
      }
      // let colors = [];
      let i = 0;
      const routes_length = Object.keys(tempRoutes).length;
      for (let route_id in tempRoutes) tempRoutes[route_id].route_color = rainbow(routes_length, i++);
      return tempRoutes;
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

  const createDrivers = () => {
    return axios.get(BASE_URL + "getDrivers")
    .then(response => {
      // console.log("response_drivers:", response);
      const result = response.data.result.result;
      let tempDrivers = {};
      for (let driver of result) {
        const driver_id = driver.driver_id;
        const driver_data = {
          first_name: driver.driver_first_name,
          last_name: driver.driver_last_name,
          ssn: driver.driver_ssn,
          drivers_license: driver.driver_license,
          insurance_number: driver.driver_insurance_num,
          password: driver.driver_password,
          time_availability: driver.driver_hours,

          business_id: driver.business_id,
          weekly_workload: -1,
          day_availability: "PLACEHOLDER",
          // time_availability: {
          //   Sunday: undefined, 
          //   Monday: 1, 
          //   Tuesday: undefined, 
          //   Wednesday: 1, 
          //   Thursday: 1, 
          //   Friday: undefined, 
          //   Saturday: undefined,
          // }, 
          expiration: "PLACEHOLDER",

          preferred_routes: "PLACEHOLDER", // only one choice with this endpoint!
          rating: -1,
        }
        tempDrivers[driver_id] = driver_data;
      }
      // setDrivers(tempDrivers);
      return tempDrivers;
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

  const createBusinesses = () => {
    return axios.get(BASE_URL + "getBusinesses")
    .then(response => {
      // console.log("tempbusines", response);
      const result = response.data.result.result;
      let tempBusinesses = {};
      for (let business of result) {
        const business_id = business.business_id;
        const business_data = {
          name: business.business_name,
          description: business.business_desc,
          type: business.business_type,
          hours: business.business_hours,
          street: business.business_street,
          unit: business.business_unit,
          city: business.business_city,
          state: business.business_state,
          zip: business.business_zip,
          phone: business.business_phone_num,
          email: business.business_email,
          phone2: business.business_phone_num2,
          latitude: business.business_latitude,
          longitude: business.business_longitude,
        }
        tempBusinesses[business_id] = business_data;
      }
      // setBusinesses(tempBusinesses);
      return tempBusinesses;
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

  const createCustomers = () => {
    return axios.get(BASE_URL + "getCustomers")
    .then(response => {
      // console.log("tempcust", response);
      const result = response.data.result.result;
      let tempCustomers = {};
      for (let customer of result) {
        const customer_id = customer.customer_id;
        const customer_data = {
          first_name: customer.customer_first_name,
          last_name: customer.customer_last_name,
          street: customer.customer_street,
          unit: customer.customer_unit,
          city: customer.customer_city,
          state: customer.customer_state,
          zip: customer.customer_zip,
          phone: customer.customer_phone_num,
          email: customer.customer_email,
          latitude: customer.customer_latitude,
          longitude: customer.customer_longitude,
          notification_approval: customer.notification_approval,
          notification_id: customer.notification_device_id,
        }
        tempCustomers[customer_id] = customer_data;
      }
      // setCustomers(tempCustomers);
      return tempCustomers;
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

  const createOrders = () => {
    return axios.get(BASE_URL + "getCustomerOrders")
    .then(response => {
      // console.log("temporders", response);
      const result = response.data.result.result;
      let tempOrders = {};
      for (let order of result) {
        const order_id = order.order_id;
        const order_data = {
          customer_id: order.customer_id,
          customer_first_name: order.customer_first_name,
          customer_last_name: order.customer_last_name,
          customer_street: order.customer_street,
          // unit: order.order_unit,
          customer_city: order.customer_city,
          customer_state: order.customer_state,
          customer_zip: order.customer_zip,
          customer_phone: order.customer_phone_num,
          customer_email: order.customer_email,
          customer_latitude: order.customer_latitude,
          customer_longitude: order.customer_longitude,
          
          items: order.items,
          cost: order.amount,
          order_instructions: order.order_instructions,
          delivery_instructions: order.delivery_instructions,
          type: order.order_type,
          status: order.order_status,
        }
        tempOrders[order_id] = order_data;
      }
      return tempOrders;
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

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
          <OrderList 
            orders={data.orders}
          />
        );
      case 5:
        return (
          <p>WIP</p>
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
  const tabs = ["Delivery", "Drivers", "Businesses", "Customers", "Orders & Shipments", "Constraints"];

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
          // onBlur={props.handleBurger}
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
