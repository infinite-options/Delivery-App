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
          <th>Business ID</th>
          <th>Business Name</th>
          <th>Vehicle Make<br /><span style={{ fontSize: "0.65rem" }}>Model, Year</span></th>
          <th>Vehicle Registration</th>
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
        {vehicleList.map((business_vehicles, index) => (
          <VehiclesItem
            key={index}
            index={index}
            vehicles={business_vehicles[1]}
            business_id={business_vehicles[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function VehiclesItem({ vehicles, business_id, ...props }) {
  // const [hidden, setHidden] = useState(true);
  // console.log(vehicles);

  return (
    <tr>
      <td>{business_id}</td>
      <td>{vehicles.business_name} N/A</td>
      <td>N/A
        {/* {vehicles.map((vehicle, index) => (
          <p key={index}>
            {vehicle.name}<br />
            {`${vehicle.model}, ${vehicle.year}`}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {vehicles.map((vehicle, index) => (
          <p key={index}>
            {vehicle.registration}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {vehicles.map((vehicle, index) => (
          <p key={index}>
            {vehicle.insurance_carrier}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {vehicles.map((vehicle, index) => (
          <p key={index}>
            {vehicle.insurance_policy}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {vehicles.map((vehicle, index) => (
          <p key={index}>
            {vehicle.insurance_policy_expiration}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {vehicles.map((vehicle, index) => (
          <React.Fragment>
            {vehicle.drivers.map((driver, index) => (
              <p>{driver.first_name} {driver.last_name}</p>
            ))}
          </React.Fragment>
        ))} */}
      </td>
    </tr>
  );
}
  
  export default VehicleList;
  