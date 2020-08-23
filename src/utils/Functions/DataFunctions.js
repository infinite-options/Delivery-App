import axios from "axios";

// "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/";
const NEW_BASE_URL = "https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/";
const BASE_URL = "https://lu636s0qy3.execute-api.us-west-1.amazonaws.com/dev/api/v2/";

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
    default: 
  }
  var c = "#" +
    ("00" + (~~(r * 255)).toString(16)).slice(-2) +
    ("00" + (~~(g * 255)).toString(16)).slice(-2) +
    ("00" + (~~(b * 255)).toString(16)).slice(-2);
  return c;
};

/* route structure:
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
const createRoutes = () => {
  return axios.get(BASE_URL + "getCustomerRoutes")
  .then((response) => {
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
      };
      // console.log(route_id);
      if (route_id in tempRoutes) {
        location_data.from =
          tempRoutes[route_id].route_data[
            tempRoutes[route_id].route_data.length - 1
          ].to;
        // console.log(location_data);
        // console.log("route data:", tempRoutes[route_id].route_data);
        tempRoutes[route_id].route_data.push(location_data);
      } else {
        // console.log("route's business", businesses[location.business_id]);
        // location_data.from = [0, 0];
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
    for (let route_id in tempRoutes)
      tempRoutes[route_id].route_color = rainbow(routes_length, i++);
    // console.log(tempRoutes);
    return tempRoutes;
  });


  // return axios.get(BASE_URL + "getCustomerRoutes")
  // .then((response) => {
  //   // console.log("temprouteS:", response);
  //   const result = response.data.result.result;
  //   let tempRoutes = {};
  //   for (let location of result) {
  //     const route_id = location.route_id;
  //     const location_data = {
  //       customer_id: location.customer_id,
  //       address: `${location.customer_street} ${location.customer_city} ${location.customer_state} ${location.customer_zip}`,
  //       // from: tempRoutes[route_id].route_data[route_data.length - 1].to,
  //       to: [location.customer_latitude, location.customer_longitude],
  //     };
  //     if (route_id in tempRoutes) {
  //       location_data.from =
  //         tempRoutes[route_id].route_data[
  //           tempRoutes[route_id].route_data.length - 1
  //         ].to;
  //       console.log(location_data);
  //       // console.log("route data:", tempRoutes[route_id].route_data);
  //       tempRoutes[route_id].route_data.push(location_data);
  //     } else {
  //       // console.log("route's business", businesses[location.business_id]);
  //       location_data.from = [
  //         businesses[location.business_id].latitude,
  //         businesses[location.business_id].longitude,
  //       ];
  //       tempRoutes[route_id] = {
  //         business_id: location.business_id,
  //         driver_id: location.driver_id,
  //         visible: true,
  //         route_data: [location_data],
  //       };
  //     }
  //   }
  //   // let colors = [];
  //   let i = 0;
  //   const routes_length = Object.keys(tempRoutes).length;
  //   for (let route_id in tempRoutes)
  //     tempRoutes[route_id].route_color = rainbow(routes_length, i++);
  //   return tempRoutes;
  // });
};

const createDrivers = () => {
  return axios.get(BASE_URL + "getDrivers")
  .then((response) => {
    // console.log("response_drivers:", response);
    const result = response.data.result.result;
    let tempDrivers = {};
    for (let driver of result) {
      const driver_id = driver.driver_id;
      const driver_data = {
        rating: driver.driver_rating,

        first_name: driver.driver_first_name,
        last_name: driver.driver_last_name,

        weekly_workload: "N/A",

        drivers_license: driver.driver_license,
        drivers_license_exp: driver.driver_license_exp,
        vehicle_types: driver.driver_vehicle_types,

        emergency_contact_name: driver.emergency_contact_name,
        emergency_contact_phone: driver.emergency_contact_phone,
        emergency_contact_relationship: driver.emergency_contact_relationship,

        preferred_routes: "N/A",

        days: driver.driver_days,
        hours: driver.driver_hours,

        street: driver.driver_street,
        unit: driver.driver_unit,
        city: driver.driver_city,
        state: driver.driver_state,
        zip: driver.driver_zip,
        latitude: driver.driver_latitude,
        longitude: driver.driver_longitude,

        insurance_carrier: driver.driver_insurance_carrier,
        insurance_number: driver.driver_insurance_num,
        insurance_expiration: driver.driver_insurance_exp,
        
        bank_routing_info: driver.bank_routing_info,
        bank_account_info: driver.bank_account_info,

        ssn: driver.driver_ssn,
        password: driver.driver_password,

        phone: driver.driver_phone_num,
        phone2: driver.driver_phone_num2,
        email: driver.driver_email,

        business_id: driver.business_id,
        hourly_rate: driver.driver_hourly_rate,
        delivery_fee: driver.driver_delivery_fee,
        // time_availability: {
        //   Sunday: undefined,
        //   Monday: 1,
        //   Tuesday: undefined,
        //   Wednesday: 1,
        //   Thursday: 1,
        //   Friday: undefined,
        //   Saturday: undefined,
        // },
      };
      tempDrivers[driver_id] = driver_data;
    }
    // setDrivers(tempDrivers);
    return tempDrivers;
  });
};

const createBusinesses = () => {
  return axios.get(NEW_BASE_URL + "businesses")
  .then((response) => {
    // console.log("tempbusines", response);
    const result = response.data.result.result;
    let tempBusinesses = {};
    for (let business of result) {
      const business_id = business.business_id;
      const business_data = {
        name: business.business_name,
        type: business.business_type,
        description: business.business_desc,
        registered: business.business_created_at,
        image: business.business_image,

        license: business.business_license,
        password: business.business_password,
        EIN: business.business_EIN,
        USDOT: business.business_USDOT,
        WAUBI: business.business_WAUBI,

        hours: business.business_hours,
        delivery_hours: business.business_delivery_hours,
        accepting_hours: business.business_accepting_hours,
        available_zones: business.available_zones,

        street: business.business_address,
        unit: business.business_unit,
        city: business.business_city,
        state: business.business_state,
        zip: business.business_zip,
        latitude: business.business_latitude,
        longitude: business.business_longitude,

        contact_first_name: business.business_contact_first_name,
        contact_last_name: business.business_contact_last_name,
        phone: business.business_phone_num,
        phone2: business.business_phone_num2,
        email: business.business_email,

        delivery: business.delivery,
        can_cancel: business.can_cancel,
        reusable: business.reusable,

        notification_approval: business.notification_approval,
        notification_device_id: business.notification_device_id,
      };
      tempBusinesses[business_id] = business_data;
    }
    // setBusinesses(tempBusinesses);
    return tempBusinesses;
  });


  // return axios.get(BASE_URL + "getBusinesses")
  // .then((response) => {
  //   // console.log("tempbusines", response);
  //   const result = response.data.result.result;
  //   let tempBusinesses = {};
  //   for (let business of result) {
  //     const business_id = business.business_id;
  //     const business_data = {
  //       name: business.business_name,
  //       description: business.business_desc,
  //       type: business.business_type,
  //       hours: business.business_hours,
  //       street: business.business_street,
  //       unit: business.business_unit,
  //       city: business.business_city,
  //       state: business.business_state,
  //       zip: business.business_zip,
  //       phone: business.business_phone_num,
  //       email: business.business_email,
  //       phone2: business.business_phone_num2,
  //       latitude: business.business_latitude,
  //       longitude: business.business_longitude,
  //     };
  //     tempBusinesses[business_id] = business_data;
  //   }
  //   // setBusinesses(tempBusinesses);
  //   return tempBusinesses;
  // });
};

const createCustomers = () => {
  return axios.get(BASE_URL + "getCustomers")
  .then((response) => {
    // console.log("tempcust", response);
    const result = response.data.result.result;
    let tempCustomers = {};
    for (let customer of result) {
      const customer_id = customer.customer_id;
      const customer_data = {
        first_name: customer.customer_first_name,
        last_name: customer.customer_last_name,
        
        phone: customer.customer_phone_num,
        
        SMS_frequency: customer.customer_SMS_frequency,
        SMS_last_notification: customer.customer_SMS_last_notification,

        street: customer.customer_street,
        unit: customer.customer_unit,
        city: customer.customer_city,
        state: customer.customer_state,
        zip: customer.customer_zip,
        latitude: customer.customer_latitude,
        longitude: customer.customer_longitude,

        email: customer.customer_email,
        
        notification_approval: customer.notification_approval,
        notification_id: customer.notification_device_id,

        verified: customer.customer_email.verified,

        password_salt: customer.customer_password_salt,
        password_hash: customer.customer_password_hash,
        password_algorithm: customer.customer_password_algorithm,

        referrral_source: customer.referral_source,
        role: customer.customer_role,
        last_update: customer.customer_updated_at,
        customer_rep: customer.customer_representative,
        route_id: customer.route_id, // multiple??
      };
      tempCustomers[customer_id] = customer_data;
    }
    // setCustomers(tempCustomers);
    return tempCustomers;
  });
};

const createOrders = () => {
  return axios.get(BASE_URL + "getCustomerOrders")
  .then((response) => {
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
      };
      tempOrders[order_id] = order_data;
    }
    return tempOrders;
  });
};

export {
  createRoutes,
  createDrivers,
  createBusinesses,
  createCustomers,
  createOrders,
};
