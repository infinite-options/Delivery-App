import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import axios from "axios";

function OrderList({ orders, props }) {
  return (
    <table className="table is-fullwidth is-bordered">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date & Time</th>
          <th>Customer Name</th>
          <th>Customer Info</th>
          <th>Amount</th>
          <th>Items</th>
          <th>Paid</th>
          <th>Order Type</th>
          <th>Business ID</th>
          <th>Order Status</th>
          <th>Delivery Date</th>
          <th>Schedule</th>
          <th>Delivery #</th>
          <th>Route</th>
          <th>Driver ID</th>
          <th>Delivered</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.keys(orders).map((order_id, index) => (
          <ObjectItem
            key={index}
            props={{
              order: orders[order_id],
              id: order_id,
              index,
            }}
          />
        ))}
      </tbody>
    </table>
  );
}

function ObjectItem({ props }) {
  // const [hidden, setHidden] = useState(true);
  const address = (`${props.order.customer_street} ${props.order.customer_city} ${props.order.customer_state} ${props.order.customer_zip}`);
  
  return (
    <tr>
      <td>{props.id}</td>
      <td>PLACEHOLDER</td>
      <td>{`${props.order.customer_first_name} ${props.order.customer_last_name}`}</td>
      <td>{address}<br /><br />{props.order.customer_phone}<br />{props.order.customer_email}</td>
      <td>${props.order.cost}</td>
      <td>{props.order.items}</td>
      <td>PLACEHOLDER</td>
      <td>{props.order.type}</td>
      <td>PLACEHOLDER</td>
      <td>{props.order.status}</td>
    </tr>
  );
}
  
  export default OrderList;
  