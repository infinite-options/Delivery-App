import axios from "axios";

// "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/";
const NEW_NEW_BASE_URL = "https://uqu7qejuee.execute-api.us-west-1.amazonaws.com/dev/api/v2/";
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
 *         // driver_first_name,
 *         // driver_last_name,
 *         visible,
 *         route_option
 *         route_color,
 *         route_data: [
 *             {
 *                 customer_id,
 *                 customer_first_name,
 *                 customer_last_name,
 *                 customer_email,
 *                 customer_phone,
 *                 from: [prevLatitude, prevLongitude],
 *                 to: [latitude, longitude],
 *                 address,
 *             }, ...
 *         ]
 *     }, ...
 * }
 */
const createRoutes = () => {
  return axios.get(NEW_NEW_BASE_URL + "getRoutes")
  .then((response) => {
    // console.log("temprouteS:", response);
    const result = response.data.result.result;
    let totalOptions = 0;
    let tempRoutes = {};
    for (let location of result) {
      // console.log(location, result.length);
      const deliveryInfo = JSON.parse(location.route_delivery_info);
      const route_id = location.route_id;
      // const latlngs = JSON.parse(location.customer_coords);
      const latlngs = [deliveryInfo[0].coordinates.latitude, deliveryInfo[0].coordinates.longitude];
      // console.log(latlngs);
      const location_data = {
        // to: [latlngs.latitude, latlngs.longitude],
        to: latlngs,
        customer_id: deliveryInfo[0].customer_id,
        // customer_first_name: "Bill",
        // customer_last_name: "Gates",
        address: deliveryInfo[0].delivery_street,

        // customer_id: location.customer_id,
        // customer_first_name: location.delivery_first_name,
        // customer_last_name: location.delivery_last_name,
        // customer_email: location.delivery_email,
        // customer_phone: location.delivery_phone_num,
        // address: `${location.delivery_address} ${location.delivery_city} ${location.delivery_state} ${location.delivery_zip}`,
        // NOTE: This regex stuff is temporary, the endpoint gives messy coordinate values so I gotta clean it
        // to: [location.delivery_latitude.replace( /^,/g, ''), location.delivery_longitude.replace( /^,/g, '')],
        //* customer_id: location.customer_id,
        //* customer_first_name: location.customer_first_name,
        //* customer_last_name: location.customer_last_name,
        //* customer_email: location.customer_email,
        //* customer_phone: location.customer_phone_num,
        //* address: `${location.customer_street} ${location.customer_city} ${location.customer_state} ${location.customer_zip}`,
        //* to: [location.customer_latitude, location.customer_longitude],
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
      } 
      else {
        // console.log("route's business", businesses[location.business_id]);
        // location_data.from = [0, 0];
        if (totalOptions < location.route_option) totalOptions = location.route_option;
        location_data.from = [latlngs.latitude, latlngs.longitude];
        //* location_data.from = [+location.customer_latitude + (Math.random() * 0.22 - 0.1), +location.customer_longitude + (Math.random() * 0.22 - 0.1)];
        tempRoutes[route_id] = {
          route_option: location.route_option,
          business_id: location.route_business_id,
          driver_id: location.route_driver_id, //* location.driver_id,
          driver_num: location.route_driver_num,
          // driver_first_name: "Bob", //* location.driver_first_name,
          // driver_last_name: "Jones", //* location.driver_last_name, 
          distance: location.route_distance,
          date: location.shipment_date,
          visible: true,
          route_data: [location_data],
        };
      }
    }
    // let colors = [];
    let i = 0;
    // const routes_length = Object.keys(tempRoutes).length;
    let route_option = 1;
    for (let route_id in tempRoutes) {
      tempRoutes[route_id].route_data.shift(); // delete first location, since that's the starting location
      // eslint-disable-next-line
      if (route_option != tempRoutes[route_id].route_option) {
        // eslint-disable-next-line
        if (tempRoutes[route_id].route_option == 1) { route_option = 1; i = 0; }
        else { route_option++; i++; }
      }
      tempRoutes[route_id].route_color = rainbow(totalOptions, i);
    }
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
  return axios.get(NEW_NEW_BASE_URL + "Drivers")
  .then((response) => {
    // console.log("response_drivers:", response);
    const result = response.data.result.result;
    let tempDrivers = {};
    for (let driver of result) {
      const driver_id = driver.driver_uid;
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

        available_hours: driver.driver_available_hours,
        scheduled_hours: driver.driver_scheduled_hours,

        street: driver.driver_street,
        unit: driver.driver_unit,
        city: driver.driver_city,
        state: driver.driver_state,
        zip: driver.driver_zip,
        latitude: Number(driver.driver_latitude),
        longitude: Number(driver.driver_longitude),

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
  return axios.get(NEW_NEW_BASE_URL + "Businesses")
  .then((response) => {
    // console.log("tempbusines", response);
    const result = response.data.result.result;
    let tempBusinesses = {};
    for (let business of result) {
      const business_id = business.business_uid;
      const business_data = {
        visible: true, //temp
        zones: undefined,

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
        latitude: Number(business.business_latitude),
        longitude: Number(business.business_longitude),

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
  return axios.get(NEW_NEW_BASE_URL + "Customers")
  .then((response) => {
    // console.log("tempcust", response);
    const result = response.data.result.result;
    let tempCustomers = {};
    for (let customer of result) {
      const customer_id = customer.customer_uid;
      const customer_data = {
        first_name: customer.customer_first_name || " ",
        last_name: customer.customer_last_name || " ",
        
        phone: customer.customer_phone_num,
        
        SMS_frequency: customer.SMS_freq_preference,
        SMS_last_notification: customer.SMS_last_notification,

        street: customer.customer_address,
        unit: customer.customer_unit,
        city: customer.customer_city,
        state: customer.customer_state,
        zip: customer.customer_zip,
        latitude: Number(customer.customer_lat),
        longitude: Number(customer.customer_long),

        email: customer.customer_email,
        
        notification_approval: customer.notification_approval,
        notification_id: customer.notification_device_id,

        created_at: customer.customer_created_at,
        verified: Number(customer.email_verified),

        password_salt: customer.password_salt,
        password_hash: customer.password_hashed,
        password_algorithm: customer.password_algorithm,

        referral_source: customer.referral_source,
        role: customer.role,
        last_update: customer.customer_updated_at,
        customer_rep: customer.customer_rep,

        user_social_media: customer.user_social_media,
        user_access_token: customer.user_access_token,
        user_refresh_token: customer.user_refresh_token,

        route_id: customer.route_id, // multiple??
      };
      tempCustomers[customer_id] = customer_data;
    }
    // setCustomers(tempCustomers);
    return tempCustomers;
  });
};

const createVehicles = () => {
  return axios.get(NEW_NEW_BASE_URL + "getVehicles")
  .then(response => {
    console.log("vehicles resp:", response);
    const result = response.data.result.result;
    let tempVehicles = {}
    for (let vehicle of result) {
      const vehicle_id = vehicle.vehicle_uid;
      const vehicle_data = {
        vehicle_make: vehicle.vehicle_make,
        vehicle_model: vehicle.vehicle_model,
        vehicle_year: vehicle.vehicle_year,
        insurance_carrier: vehicle.vehicle_ins_carrier,
        insurance_number: vehicle.vehicle_ins_policy_num,
        insurance_expiration: vehicle.vehicle_ins_exp_date,
        registration: vehicle.vehicle_registration,
        registration_expiration: vehicle.vehicle_registration_exp,
        drivers: vehicle.drivers,
      };
      tempVehicles[vehicle_id] = vehicle_data;
    };
    return tempVehicles;
  })
  .catch(err => {
    console.log(err);
  });
};

const createPurchases = () => {
  return axios.get(NEW_NEW_BASE_URL + "Purchases")
  .then((response) => {
    // console.log("temppurchases", response);
    const result = response.data.result.result;
    let tempPurchases = {};
    for (let purchase of result) {
      const purchase_id = purchase.purchase_uid;
      const purchase_data = {
        customer_id: purchase.pur_customer_uid,
        business_id: purchase.pur_business_uid,

        delivery_first_name: purchase.delivery_first_name,
        delivery_last_name: purchase.delivery_last_name,
        delivery_phone: purchase.delivery_phone_num,
        delivery_email: purchase.delivery_email,

        delivery_street: purchase.delivery_address,
        delivery_unit: purchase.delivery_unit,
        delivery_city: purchase.delivery_city,
        delivery_state: purchase.delivery_state,
        delivery_zip: purchase.delivery_zip,
        delivery_latitude: Number(purchase.delivery_latitude),
        delivery_longitude: Number(purchase.delivery_longitude),

        items: purchase.items,
        // cost: purchase.amount,
        purchase_date: purchase.purchase_date,
        order_instructions: purchase.order_instructions,
        purchase_notes: purchase.purchase_notes,
        delivery_instructions: purchase.delivery_instructions,
        order_type: purchase.order_type,
        purchase_status: purchase.purchase_status,
      };
      tempPurchases[purchase_id] = purchase_data;
    }
    return tempPurchases;
  });
};

const createCoupons = () => {
  return axios.get(NEW_NEW_BASE_URL + "getCoupons")
  .then(response => {
    // console.log("coupons:", response);
    const result = response.data.result.result;
    let tempCoupons = {};
    for (let coupon of result) {
      const coupon_id = coupon.coupon_uid;
      const coupon_data = {
        code: coupon.coupon_id,
        valid: coupon.valid,
        discount_percent: coupon.discount_percent,
        discount_amount: coupon.discount_amount,
        discount_shipping: coupon.discount_shipping,
        expire_date: coupon.expire_date,
        limits: coupon.limits,
        notes: coupon.notes,
        num_used: coupon.num_used,
        recurring: coupon.recurring,
        email: coupon.email_id,
        business_id: coupon.cup_business_uid,
      };
      tempCoupons[coupon_id] = coupon_data;
    }
    return tempCoupons;
  });
};

const createRefunds = () => {
  return axios.get(NEW_NEW_BASE_URL + "getRefunds")
  .then(response => {
    console.log("refunds resp:", response)
    const result = response.data.result.result;
    let tempRefunds = {};
    for (let refund of result) {
      const refund_id = refund.refund_uid;
      const refund_data = {
        created_at: refund.created_at,
        email: refund.email_id,
        phone: refund.phone_num,
        image: refund.image_url,
        customer_note: refund.customer_note,
        admin_note: refund.admin_note,
        refund_amount: refund.refund_amount,
        coupon_id: refund.ref_coupon_id,
      };
      tempRefunds[refund_id] = refund_data;
    }
    return tempRefunds;
  })
};

const createConstraints = (businesses) => {
  return new Promise((resolve, reject) => {
    let constraints = {};
    const businessKeys = Object.keys(businesses);
    // console.log(Object.keys(businesses).length);
    for (let business_id of businessKeys) {
      axios.get(NEW_NEW_BASE_URL + "getBusinessConstraints/" + business_id)
      .then(response => {
        // console.log(response);
        const result = response.data.result.result.length ? response.data.result.result[0] : undefined;
        if (result) constraints[result.constraint_uid] = {
          business_id: result.business_uid,
          business_name: businesses[business_id].name,
          business_street: businesses[business_id].street,
          business_unit: businesses[business_id].unit,
          business_city: businesses[business_id].city,
          business_state: businesses[business_id].state,
          business_zip: businesses[business_id].zip,
          business_phone: businesses[business_id].phone,
          num_drivers: result.num_drivers,
          max_distance: result.max_distance,
          max_time: result.max_time,
          min_time: result.min_time,
          max_deliveries: result.max_deliveries,
          min_deliveries: result.min_deliveries,
        };
        if (business_id === businessKeys[businessKeys.length - 1]) resolve(constraints);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
      // console.log("endloop");
    }
    // console.log("HELLO");
    // setTimeout(() => resolve(constraints), 1000);
  });
};


const setBusinessesCustomers = (businesses) => {
  return new Promise((resolve, reject) => {
    const businessKeys = Object.keys(businesses);
    // console.log(Object.keys(businesses).length);
    for (let business_id of businessKeys) {
      axios.get(NEW_NEW_BASE_URL + "getCustomersByBusiness/" + business_id)
      .then(response => {
        // console.log(response);
        const result = response.data.result.result;
        businesses[business_id].customers = result; // array of customer objects: [{ ... }, { ... }, ...]
        if (business_id === businessKeys[businessKeys.length - 1]) resolve('success');
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    }
  });
};



// NOTE: Other functions, not sure how to organize these functions.
//       Should they have their own files? Should we keep all these
//       functions in a single file?
const validToUpdate = (type, data) => {
  // console.log(data);
  if (!data[`${type}_uid`]) {
    // console.log("INSERT");
    const dataEntries = Object.entries(data);
    if (!dataEntries.length) return false;
    for (let entry of dataEntries) {
      // console.log(entry[1]);
      if (/*required.includes(entry[0]) && */entry[1] === "") return false;
    }
  }
  else if (!Object.values(data.new_data).length) return false;
  return true;
};

export {
  NEW_NEW_BASE_URL as BASE_URL,
  createRoutes,
  createDrivers,
  createBusinesses,
  createCustomers,
  createVehicles,
  createPurchases,
  createCoupons,
  createRefunds,
  createConstraints,

  setBusinessesCustomers,

  validToUpdate,
};
