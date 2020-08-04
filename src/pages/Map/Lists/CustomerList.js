import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import axios from "axios";

function CustomerList({ customers, props }) {
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

  return (
    <div className="box list-item" style={{ backgroundColor: "#f8f7fa", display: "inline-block", width: "800px", minWidth: "100%" }}>
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ededed" }}>
            <th>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <button
                className="mx-1"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
              Customer {props.id}
            </th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody className="has-text-centered" hidden={hidden}>
          <tr>
            <td className="pr-0">
                Name<br />{`${props.customer.first_name} ${props.customer.last_name}`}
            </td>
            <td>
                Address<br />{props.customer.street, props.customer.unit, props.customer.city, props.customer.state, props.customer.zip}
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
