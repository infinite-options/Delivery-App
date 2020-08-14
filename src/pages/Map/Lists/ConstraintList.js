import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
// import axios from "axios";

function ConstraintList({ constraints, props }) {
  console.log("rendering constraints..");
  
  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>Business ID</th>
          <th>Business Name</th>
          <th>Business Address</th>
          <th>Business Phone Number</th>
          <th>Number of Drivers</th>
          <th>
            <p style={{borderBottom: "1px solid lightgrey"}}>Distance per Driver</p>
            <MinMax />
          </th>
          <th>
            <p style={{borderBottom: "1px solid lightgrey"}}>Time per Driver</p>
            <MinMax />
          </th>
          <th>
            <p style={{borderBottom: "1px solid lightgrey"}}>Number of Deliveries</p>
            <MinMax />
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(constraints).map((constraint, index) => (
          <VehicleItem
            key={index}
            props={{
              constraint: constraint[1],
              index,
            }}
          />
        ))}
      </tbody>
    </table>
  );
}

function MinMax() {
  return (
    <div className={"level has-text-light-weight has-text-weight-light"}>
      <div
        className="level-left is-split">
        <div className="level-item">Min</div>
      </div>
      <div className="level-right is-split">
        <div className="level-item">Max</div>
      </div>
    </div>
  );
}

function VehicleItem({ props }) {
  // const [hidden, setHidden] = useState(true);
  const address = `N/A`;
  console.log(props.constraint);
  
  return (
    <tr>
      <td>{props.constraint.business_id}</td>
      <td>{props.constraint.business_name}</td>
      <td>{address}</td>
      <td>{props.constraint.business_phone}</td>
      <td><InputValue /></td>
      <td><InputValue value={props.constraint.driver_count} hasRange={true} /></td>
      <td><InputValue hasRange={true} /></td>
      <td><InputValue hasRange={true} /></td>
    </tr>
  );
}

function InputValue(props) {
  return (
    <React.Fragment>
      {props.hasRange ? (
        <InputRange min={props.value} max={props.value} />
      ) : (
        <input className="input is-small has-text-centered" style={{ width: "50px" }} value={props.value} onChange={(e) => console.log(e)} />
      )}
    </React.Fragment>
  );
}

function InputRange(props) {
  // console.log("rendering ranges..");
  return (
    <div className={"level has-text-light-weight" + (props.isHeader ? " has-text-weight-light" : "")}>
      <div
        className="level-left is-split">
        <div className="level-item">
          <input className="input is-small has-text-centered" style={{ width: "50px" }} value={props.min} onChange={(e) => console.log(e)} />
        </div>
      </div>
      <div className="level-right is-split">
        <div className="level-item">
          <input className="input is-small has-text-centered" style={{ width: "50px" }} value={props.max} onChange={(e) => console.log(e)} />
        </div>
      </div>
    </div>
  );
}

export default ConstraintList;
  