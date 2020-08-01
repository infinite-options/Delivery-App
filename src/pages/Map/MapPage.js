import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";
import DriverList from "./DriverList";
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
  // will there ever be a case where there are more drivers than locations?
  const [drivers, setDrivers] = useState({});
  const [routes, setRoutes] = useState([]);
  const [businesses, setBusinesses] = useState({});
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
      createRoutes(), 
      createDrivers(),
      createBusinesses(),
    ]).then((result) => {
      console.log("API responses:", result);
      setIsLoading(false);
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

  const createRoutes = () => {
    return axios.get(BASE_API_URL + "deliveryRoute")
    .then((response) => {
      // console.log(response);
      if (response.status === 200) {
        const result = [...response.data.result];
        // cut off head & tail of result, since those values are the HQ location value
        const route = result.slice(1, result.length - 1);
        // console.log(route);
        let tempRoutes = [];
        let index = 0;
        for (let i = 0; i < 1; i++) { // This endpoint responds with a single route
          let tempRoute = [];
          for (let j = 0; j < route.length; j++) {
            // destination coords
            let toLatitude = route[index].latitude;
            let toLongitude = route[index].longitude;
            // beginning coords, if first route then begin from HQ coords
            let fromLatitude = !j
              ? result[0].latitude
              : route[index - 1].latitude;
            let fromLongitude = !j
              ? result[0].longitude
              : route[index - 1].longitude;
            // destination address
            let street = route[index].house_address.trim();
            let city = route[index].city.trim();
            let state = route[index].state.trim().toUpperCase();
            let zip = route[index].zipcode.trim();
            let address = `${street}, ${city}, ${state} ${zip}`;
            tempRoute.push({
              from: [fromLatitude, fromLongitude],
              to: [toLatitude, toLongitude],
              address: address,
            });
            index++;
            // console.log("index:", index);
          }
          tempRoutes.push(tempRoute);
        }
        // console.log("temp:", tempRoutes);
        setRoutes(tempRoutes);
        // hardcoded driver data since this endpoint doesn't give me any driver information
        // setDrivers([{
        //   first_name: "John",
        //   last_name: "Doe",
        //   ssn: "123-45-6789",
        //   drivers_license: "QWEASD123",

        //   weekly_workload: 40,
        //   day_availability: [
        //     "Monday", 
        //     "Wednesday", 
        //     "Thursday"
        //   ],
        //   time_availability: {
        //     Sunday: undefined, 
        //     Monday: 1, 
        //     Tuesday: undefined, 
        //     Wednesday: 1, 
        //     Thursday: 1, 
        //     Friday: undefined, 
        //     Saturday: undefined,
        //   }, 
        //   expiration: "2021-03-22",

        //   preferred_routes: [1], // only one choice with this endpoint!
        //   rating: 4.6,
        // }]);
        setRouteColors(() => {
          let colors = [];
          for (let i = 0; i < tempRoutes.length; i++) {
            colors.push(rainbow(tempRoutes.length, i));
          }
          // console.log(colors);
          return colors;
        });
        // setIsLoading(false);
      }
    })
    // .catch((err) => {
    //   console.log(err.response ? err.response : err);
    // });

      
    // axios
    //   .get(BASE_API_URL + "multiDrivers")
    //   .then((response) => {
    //     // console.log(response);
    //     if (response.status === 200) {
    //       const result = [...response.data.result];
    //       setDrivers(result.length);
    //       let tempRoutes = [];
    //       // let tempDrivers = [];
    //       for (let element of result) {
    //         // const driverData = await axios.get(DRIVER_API_URL + element.driver_id);
    //         // tempDrivers.push(driverData);
    //         // cut off head & tail of each result route, since those values are the HQ location value
    //         const route = element.slice(1, element.length - 1);
    //         // console.log("route:", route);
    //         let tempRoute = [];
    //         for (let i = 0; i < route.length; i++) {
    //           // destination coords
    //           console.log(route[i]);
    //           let toLatitude = route[i].latitude;
    //           let toLongitude = route[i].longitude;
    //           // beginning coords, if first route then begin from HQ coords
    //           let fromLatitude = !i
    //             ? element[0].latitude
    //             : route[i - 1].latitude;
    //           let fromLongitude = !i
    //             ? element[0].longitude
    //             : route[i - 1].longitude;
    //           // destination address
    //           let street = route[i].house_address.trim();
    //           let city = route[i].city.trim();
    //           let state = route[i].state.trim().toUpperCase();
    //           let zip = route[i].zipcode.trim();
    //           let address = `${street}, ${city}, ${state} ${zip}`;
    //           tempRoute.push({
    //             from: [fromLatitude, fromLongitude],
    //             to: [toLatitude, toLongitude],
    //             address: address,
    //           });
    //         }
    //         tempRoutes.push(tempRoute);
    //       }
    //       console.log("temp:", tempRoutes);
    //       setRoutes(tempRoutes);
    //       // setDrivers(tempDrivers);
    //       setRouteColors(() => {
    //         let colors = [];
    //         for (let i = 0; i < tempRoutes.length; i++) {
    //           colors.push(rainbow(tempRoutes.length, i));
    //         }
    //         // console.log(colors);
    //         return colors;
    //       });
    //       setIsLoading(false);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.response ? err.response : err);
    //   });
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
      // console.log("tempdrivers:", tempDrivers);
      setDrivers(tempDrivers);
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  };

  const createBusinesses = () => {
    return axios.get(BASE_URL + "getBusinesses")
    .then(response => {
      const result = response.data.result.result;
      let tempBusinesses = {};
      for (let business of result) {
        const business_id = business.business_id;
        const business_data = {
          name: business.business_name,
          description: business.business_desc,
          type: business.business_tyoe,
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
      // console.log("tempbusi:", tempBusinesses);
      setBusinesses(tempBusinesses);
    })
    // .catch(err => {
    //   console.log(err.response ? err.response : err);
    // });
  }

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
          <DeliveryRoutes
            routes={routes}
            colors={routeColors}
            props={{ selectedLocation, setSelectedLocation }}
          />
        );
      case 1:
        return (
          // <p>WIP</p>
          <DriverList
            drivers={Object.values(drivers)}
            colors={routeColors}
          />
        );
      case 2:
        return (
          <p>WIP</p>
        );
      case 3:
        return (
          <p>WIP</p>
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
