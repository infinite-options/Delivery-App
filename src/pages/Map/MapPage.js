import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import LeafletMap from "./LeafletMap";
import DeliveryList from "./Lists/DeliveryList";
import DriverList from "./Lists/DriverList";
import BusinessList from "./Lists/BusinessList";
import CustomerList from "./Lists/CustomerList";
import DeliveryView from "./DeliveryView";
import AppIcon from "Icons/app_icon.png";
import axios from "axios";

// NOTE: just remember to change this
const BASE_API_URL =
  "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/";
const BASE_URL = 
  "https://lu636s0qy3.execute-api.us-west-1.amazonaws.com/dev/api/v2/";

function MapPage() {
  console.log("rendering..");

  const [isLoading, setIsLoading] = useState(true);
  // Combine these hooks into one hook to reduce re-rendering?
  const [drivers, setDrivers] = useState({});
  const [routes, setRoutes] = useState({});
  const [businesses, setBusinesses] = useState({});
  const [customers, setCustomers] = useState({});

  const headerTabLocal = Number(window.localStorage.getItem("headerTab"));
  const timeSlotLocal = Number(window.localStorage.getItem("timeSlot")); // User editing localStorage messes this up
  const [times, setTimes] = useState([
    { value: "00 am - 00 pm" },
    { value: "01 am - 01 pm" },
    { value: "02 am - 02 pm" },
    { value: "03 am - 03 pm" },
    { value: "04 am - 04 pm" },
  ]); // useState(GET_ROUTE_TIMES)
  const [timeSlot, setTimeSlot] = useState(timeSlotLocal ? timeSlotLocal : 0); // useState(TIME_SLOT_LOCAL_STORAGE)
  const [headerTab, setHeaderTab] = useState(headerTabLocal ? headerTabLocal : 0); // useState(HEADER_TAB_LOCAL_STORAGE)
  const [selectedLocation, setSelectedLocation] = useState({});
  const [routeColors, setRouteColors] = useState([]);

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
      // createRoutes(), 
    ])
    .then((result) => {
      console.log("API responses:", result);
      setDrivers(result[0].value);
      setBusinesses(result[1].value);
      setCustomers(result[2].value);
      // setRoutes(result[3].value);
      createRoutes(result[1].value)
      .then(result => {
        // console.log("route resp:", result);
        setRoutes(result);
        setIsLoading(false);
      });

      // setIsLoading(false);
    });
    // setIsLoading(false);
  }, []);

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
      case 0:
        r = 1;
        g = f;
        b = 0;
        break;
      case 1:
        r = q;
        g = 1;
        b = 0;
        break;
      case 2:
        r = 0;
        g = 1;
        b = f;
        break;
      case 3:
        r = 0;
        g = q;
        b = 1;
        break;
      case 4:
        r = f;
        g = 0;
        b = 1;
        break;
      case 5:
        r = 1;
        g = 0;
        b = q;
        break;
    }
    var c =
      "#" +
      ("00" + (~~(r * 255)).toString(16)).slice(-2) +
      ("00" + (~~(g * 255)).toString(16)).slice(-2) +
      ("00" + (~~(b * 255)).toString(16)).slice(-2);
    return c;
  };

  /* New route structure:
   *
   * Object > {
   *   route_id: {
   *     business_id,
   *     driver_id,
   *     route_data: [
   *       {
   *         customer_id,
   *         from: [prevLatitude OR businessLatitude, prevLongitude OR businessLongitude], 
   *         to: [latitude, longitude], 
   *         address,
   *       },
   *     ]
   *   },
   * }
  */
  const createRoutes = (businesses) => {
    return axios.get(BASE_URL + "getCustomerRoutes")
    .then(response => {
      console.log("temprouteS:", response);
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
          console.log("what", businesses[location.business_id]);
          location_data.from = [businesses[location.business_id].latitude, businesses[location.business_id].longitude];
          tempRoutes[route_id] = {
            business_id: location.business_id,
            driver_id: location.driver_id,
            route_data: [location_data],
          };
        }
      }
      setRouteColors(() => {
        let colors = [];
        for (let i = 0; i < Object.keys(tempRoutes).length; i++) {
          colors.push(rainbow(Object.keys(tempRoutes).length, i));
        }
        // console.log(colors);
        return colors;
      });
      return tempRoutes;
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

  const createDrivers = () => {
    return axios.get(BASE_URL + "getDrivers")
    .then(response => {
      console.log("response_drivers:", response);
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
      console.log("tempbusines", response);
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
      console.log("tempcust", response);
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

  const [onDayView, setOnDayView] = useState(false);
  const handleDayView = () => {
    console.log("Open day view..");

    handleBurger(true);
    setOnDayView(onDayView ? false : true);
    // open day view modal
  };

  const [onWeekView, setOnWeekView] = useState(false);
  const handleWeekView = () => {
    console.log("Open week view");

    handleBurger(true);
    setOnWeekView(onWeekView ? false : true);
    // open week view modal
  };

  const handleHeaderTab = () => {
    // might as well also handle time slots here!
    if (Math.floor(timeSlot) !== timeSlot || timeSlot < 0 || timeSlot > times.length - 1) setTimeSlot(0);

    switch (headerTab) {
      case 0:
        return (
          <DeliveryList
            routes={routes}
            colors={routeColors}
            props={{ selectedLocation, setSelectedLocation }}
          />
        );
      case 1:
        return (
          // <p>WIP</p>
          <DriverList
            drivers={drivers}
            colors={routeColors}
          />
        );
      case 2:
        return (
          <BusinessList 
            businesses={businesses}
          />
        );
      case 3:
        return (
          <CustomerList 
            customers={customers}
          />
        );
      case 4:
        return (
          <p>WIP</p>
        );
      case 5:
        return (
          <p>WIP</p>
        );
      default:
        setHeaderTab(0);
    }
  };

  return !isLoading && (
    <React.Fragment>
      <Header 
        tab={headerTab}
        changeTab={setHeaderTab}
        handleBurger={handleBurger} 
        handleDayView={handleDayView}
        handleWeekView={handleWeekView}
      />
      {/* Views */}
      <DeliveryView
        type="day"
        times={times}
        timeSlot={timeSlot}
        visible={onDayView}
        onClick={handleDayView}
      />
      <DeliveryView
        type="week"
        // times={times}
        visible={onWeekView}
        onClick={handleWeekView}
      />
      <div className="map-page">
        <div className="columns" style={{ margin: "auto" }}>
          <div className="column is-half" style={{ padding: "0" }}>
            <RouteTimes
              times={times}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
            />
            <div className="sticky">
              <LeafletMap
                routes={routes}
                colors={routeColors}
                props={{ selectedLocation, setSelectedLocation }}
              />
            </div>
          </div>
          <div
            className="column is-half"
            style={{ padding: "0 0.75rem", marginTop: "5vh" }}
          >
            <div className="box" style={{ maxHeight: "90vh", overflowY: "scroll" }}>
              {handleHeaderTab()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function Header(props) {
  const tabs = ["Delivery", "Drivers", "Businesses", "Customers", "Orders", "Shipments"];

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
            className="button is-lightgrey is-square is-fullheight"
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
