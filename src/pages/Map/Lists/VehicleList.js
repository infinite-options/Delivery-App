import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
// import axios from "axios";

function VehicleList({ vehicles, props }) {
  console.log("rendering vehicles..");
  
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
        {Object.entries(vehicles).map((business_vehicles, index) => (
          <VehiclesItem
            key={index}
            props={{
              business_id: business_vehicles[0],
              // business_name: business_vehicles[1].business_name,
              vehicles: business_vehicles[1], // business_vehicles[1].vehicles_data
              index,
            }}
          />
        ))}
      </tbody>
    </table>
  );
}

function VehiclesItem({ props }) {
  // const [hidden, setHidden] = useState(true);
  // console.log(props.vehicles);

  return (
    <tr>
      <td>{props.business_id}</td>
      <td>{props.business_name} N/A</td>
      <td>N/A
        {/* {props.vehicles.map((vehicle, idx) => (
          <p key={idx}>
            {vehicle.name}<br />
            {`${vehicle.model}, ${vehicle.year}`}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {props.vehicles.map((vehicle, idx) => (
          <p key={idx}>
            {vehicle.registration}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {props.vehicles.map((vehicle, idx) => (
          <p key={idx}>
            {vehicle.insurance_carrier}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {props.vehicles.map((vehicle, idx) => (
          <p key={idx}>
            {vehicle.insurance_policy}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {props.vehicles.map((vehicle, idx) => (
          <p key={idx}>
            {vehicle.insurance_policy_expiration}
          </p>
        ))} */}
      </td>
      <td>N/A
        {/* {props.vehicles.map((vehicle, idx) => (
          <React.Fragment>
            {vehicle.drivers.map((driver, idx) => (
              <p>{driver.first_name} {driver.last_name}</p>
            ))}
          </React.Fragment>
        ))} */}
      </td>
    </tr>
  );
}
  
  export default VehicleList;
  