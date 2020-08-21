import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
// import axios from "axios";

function CustomerList({ customers, props }) {
  console.log("rendering customers..");
  
  return (
    <React.Fragment>
      {Object.entries(customers).map((customer, index) => (
        <CustomerItem
          key={index}
          props={{
            customer: customer[1],
            id: customer[0],
            // colors: colors,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function CustomerItem({ props }) {
  const [hidden, setHidden] = useState(true);
  const address = `${props.customer.street}${props.customer.unit ? ` ${props.customer.unit}` : ""} ${props.customer.city} ${props.customer.state} ${props.customer.zip}`;

  return (
    <div className="box list-item">
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr className="list-item-head">
            <th>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <span>Customer {props.id}: {`${props.customer.first_name} ${props.customer.last_name}`}</span>
            </th>
            <th />
            <th>
              <button
                className="button is-super-small is-pulled-right"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="is-bordered has-text-centered" hidden={hidden}>
          <tr>
            <td className="pr-0">
                Name<br />{`${props.customer.first_name} ${props.customer.last_name}`}
            </td>
            <td>
                Address<br />{address}
            </td>
            <td>
                {props.customer.latitude}<br />{props.customer.longitude}
            </td>
          </tr>
          <tr>
            <td>
                Phone #: {props.customer.phone}
            </td>
            <td>
                Email: {props.customer.email}
            </td>
            <td>
                Notification Approval: {props.customer.notification_approval}<br />
                Notification ID: {props.customer.notification_id}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;