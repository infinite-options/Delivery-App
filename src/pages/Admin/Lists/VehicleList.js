import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
// import axios from "axios";

function VehicleList({ vehicles, ...props }) {
  console.log("rendering vehicles..");
  const [vehicleList, setVehicleList] = useState(Object.entries(vehicles));
  
  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>Vehicle ID</th>
          <th>Business Name</th>
          <th>Vehicle Make<br /><span style={{ fontSize: "0.65rem" }}>Model, Year</span></th>
          <th>Vehicle Registration</th>
          <th>Vehicle Registration Expiration</th>
          <th>Insurance Carrier</th>
          <th>Insurance Policy</th>
          <th>Insurance Policy Expiration</th>
          <th>Drivers</th>
        </tr>
      </thead>
      <tbody>
        {/*
          vehicles is an object containing lists of each businesses' vehicles 
        
          Object > {
              business_id : {
                  business_name,
                  vehicles_data: [
                      {
                          // vehicle data
                          drivers: []
                      }, ...
                  ]
              }, ...
          }
        */}
        {vehicleList.map((vehicle, index) => (
          <VehicleItem
            key={index}
            index={index}
            vehicle={vehicle[1]}
            id={vehicle[0]}
            // business_id={business_vehicles[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function VehicleItem({ vehicle, id, ...props }) {
  // const [hidden, setHidden] = useState(true);
  // console.log(vehicles);

  // vehicle_make: vehicle.vehicle_make,
  // vehicle_model: vehicle.vehicle_model,
  // vehicle_year: vehicle.vehicle_year,
  // insurance_carrier: vehicle.vehicle_ins_carrier,
  // insurance_number: vehicle.vehicle_ins_policy_num,
  // insurance_expiration: vehicle.vehicle_ins_exp_date,
  // registration: vehicle.vehicle_registration,
  // registration_expiration: vehicle.vehicle_registration_exp,
  // drivers: vehicle.drivers,

  return (
    <tr>
      <td>{id}</td>
      <td>N/A</td>
      <td>
        {vehicle.vehicle_make}<br />
        {vehicle.vehicle_model}, {vehicle.vehicle_year}
      </td>
      <td>{vehicle.registration}</td>
      <td>{vehicle.registration_expiration}</td>
      <td>{vehicle.insurance_carrier}</td>
      <td>{vehicle.insurance_number}</td>
      <td>{vehicle.insurance_expiration}</td>
      <td>
        {vehicle.drivers && (true /* List out drivers */)}
      </td>
    </tr>
  );
}
  
  export default VehicleList;
  