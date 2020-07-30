import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";
import DriverList from "./DriverList";
import DeliveryView from "./DeliveryView";
import AppIcon from "Icons/app_icon.png";
import axios from "axios";

const BASE_API_URL =
  "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/";

function MapPage() {
  console.log("rendering..");
  // an array of routes for testing
  const test = [
    [
      { latitude: 36.92639, longitude: -121.753155 },
      { latitude: 37.317469, longitude: -122.019218 },
      { latitude: 37.3381255, longitude: -122.0300825 },
      { latitude: 37.31781, longitude: -122.06542 },
      { latitude: 37.3185420214271, longitude: -122.065159171429 },
      /*{'latitude': 36.92639, 'longitude': -121.753155}*/
    ],
    [
      { latitude: 36.92639, longitude: -121.753155 },
      { latitude: 36.96344117, longitude: -122.05851283 },
      { latitude: 37.22055, longitude: -121.89293 },
      { latitude: 37.22793, longitude: -121.89493 },
      { latitude: 37.231342, longitude: -121.891046 },
      { latitude: 37.23602, longitude: -121.87142 },
      { latitude: 37.23312, longitude: -121.88238 },
      { latitude: 37.227124, longitude: -121.886943 },
      { latitude: 37.22985, longitude: -121.8908 },
      { latitude: 37.222307, longitude: -121.890135 },
      { latitude: 37.22168, longitude: -121.89274 },
      { latitude: 37.221648, longitude: -121.876 },
      { latitude: 37.22025, longitude: -121.86673 },
      { latitude: 37.220293, longitude: -121.872801 },
      { latitude: 37.21393, longitude: -121.87324 },
      { latitude: 37.21019, longitude: -121.87221 },
      { latitude: 37.216289, longitude: -121.869557 },
      { latitude: 37.21958, longitude: -121.87582 },
      { latitude: 37.212813, longitude: -121.875979 },
      { latitude: 37.20697, longitude: -121.87237 },
      { latitude: 37.20921, longitude: -121.86601 },
      /*{'latitude': 36.92639, 'longitude': -121.753155}*/
    ],
    [
      { latitude: 36.92639, longitude: -121.753155 },
      { latitude: 37.20588, longitude: -121.82793 },
      { latitude: 37.20447, longitude: -121.8289 },
      { latitude: 37.21001, longitude: -121.82328 },
      { latitude: 37.21026, longitude: -121.82815 },
      { latitude: 37.204775, longitude: -121.831414 },
      { latitude: 37.20539, longitude: -121.83414 },
      { latitude: 37.195659, longitude: -121.843228 },
      { latitude: 37.20666, longitude: -121.845314 },
      { latitude: 37.2098, longitude: -121.84869 },
      { latitude: 37.20398, longitude: -121.85098 },
      { latitude: 37.203119, longitude: -121.857549 },
      { latitude: 37.206714, longitude: -121.858709 },
      { latitude: 37.20098, longitude: -121.85874 },
      { latitude: 37.212021, longitude: -121.840744 },
      { latitude: 37.22274, longitude: -121.84977 },
      { latitude: 37.22002, longitude: -121.84682 },
      { latitude: 37.21856, longitude: -121.85627 },
      { latitude: 37.226068, longitude: -121.861264 },
      { latitude: 37.235542, longitude: -121.848751 },
      { latitude: 37.235976, longitude: -121.810059 },
      { latitude: 37.282141, longitude: -121.859561 },
      { latitude: 37.20893, longitude: -121.85216 },
      { latitude: 37.200639, longitude: -121.836549 },
      { latitude: 37.199574, longitude: -121.837836 },
      { latitude: 37.199313, longitude: -121.829092 },
      /*{'latitude': 36.92639, 'longitude': -121.753155}*/
    ],
  ];

  const [isLoading, setIsLoading] = useState(true);
  // will there ever be a case where there are more drivers than locations?
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [timeSlot, setTimeSlot] = useState(0); // useState(TIME_SLOT_LOCAL_STORAGE)
  const [headerTab, setHeaderTab] = useState(0); // useState(HEADER_TAB_LOCAL_STORAGE)
  const [times, setTimes] = useState([
    { value: "00 am - 00 pm" },
    { value: "01 am - 01 pm" },
    { value: "02 am - 02 pm" },
    { value: "03 am - 03 pm" },
    { value: "04 am - 04 pm" },
  ]); // useState(GET_ROUTE_TIMES)
  const [selectedLocation, setSelectedLocation] = useState({});
  const [routeColors, setRouteColors] = useState([]);

  useEffect(() => {
    createRoutes();
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
    // plotting markers & lines for test routes
    // let tempRoutes = [];
    // for (let set of test) {
    //   let tempRoute = [];
    //   let index = 0;
    //   for (let coord of set) {
    //     if (index < set.length - 1) {
    //       // console.log("0", coord);
    //       // console.log(set.length, set[index + 1]);
    //       let fromLatitude = coord["latitude"];
    //       let fromLongitude = coord["longitude"];
    //       let toLatitude = set[index + 1]["latitude"];
    //       let toLongitude = set[index + 1]["longitude"];
    //       tempRoute.push({
    //         from: [fromLatitude, fromLongitude],
    //         to: [toLatitude, toLongitude],
    //       });
    //     }
    //     index++;
    //   }
    //   tempRoutes.push(tempRoute);
    // }
    // setRoutes(tempRoutes);
    // setRouteColors(() => {
    //   let colors = [];
    //   for (let i = 0; i < tempRoutes.length; i++) {
    //     colors.push(rainbow(tempRoutes.length, i));
    //   }
    //   // console.log(colors);
    //   return colors;
    // });
    // setIsLoading(false);


    axios
      .get(BASE_API_URL + "deliveryRoute")
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          const result = [...response.data.result];
          // cut off head & tail of result, since those values are the HQ location value
          const route = result.slice(1, result.length - 1);
          console.log(route);
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
          setDrivers([{
            first_name: "John",
            last_name: "Doe",
            ssn: "123-45-6789",
            drivers_license: "QWEASD123",

            weekly_workload: 40,
            day_availability: [
              "Monday", 
              "Wednesday", 
              "Thursday"
            ],
            time_availability: {
              Sunday: undefined, 
              Monday: 1, 
              Tuesday: undefined, 
              Wednesday: 1, 
              Thursday: 1, 
              Friday: undefined, 
              Saturday: undefined,
            }, 
            expiration: "2021-03-22",

            preferred_routes: [1], // only one choice with this endpoint!
            rating: 4.6,
          }]);
          setRouteColors(() => {
            let colors = [];
            for (let i = 0; i < tempRoutes.length; i++) {
              colors.push(rainbow(tempRoutes.length, i));
            }
            // console.log(colors);
            return colors;
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response ? err.response : err);
      });

      
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
            drivers={drivers}
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
