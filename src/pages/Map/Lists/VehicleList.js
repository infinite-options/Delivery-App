import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
// import axios from "axios";

function VehicleList({ vehicles, props }) {
  console.log("rendering vehicles..");
  
  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered">
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
        {Object.entries(vehicles).map((vehicle, index) => (
          <VehicleItem
            key={index}
            props={{
              vehicle: vehicle[1],
              id: vehicle[0],
              index,
            }}
          />
        ))}
      </tbody>
    </table>
  );
}

function VehicleItem({ props }) {
  // const [hidden, setHidden] = useState(true);
  
  return (
    <tr>
      <td>{props.vehicle.business_id}</td>
      <td>{props.vehicle.business_name}</td>
      <td>{props.vehicle.name}<br />{`${props.vehicle.model}, ${props.vehicle.year}`}</td>
      <td>{props.vehicle.registration}</td>
      <td>{props.vehicle.insurance_carrier}</td>
      <td>{props.vehicle.insurance_policy}</td>
      <td>{props.vehicle.insurance_policy_expiration}</td>
      <td>{props.vehicle.drivers}</td>
    </tr>
  );
}
  
  export default VehicleList;
  