import React, { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import SortingIcon from "utils/Components/SortingIcon";
// import axios from "axios";

function OrderList({ orders, ...props }) {
  console.log("rendering orders..");
  const [orderData, setOrderData] = useState({
    sortBy: "", // sortBy 'id', 'name', etc
    value: 0, // value 1=ascending, -1=descending
    list: Object.entries(orders),
  });

  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>
            Order #
            <SortingIcon type='id' typeOf='string' data={orderData} update={setOrderData} />
          </th>
          <th>Date &amp; Time</th>
          <th>
            Customer Name
            <SortingIcon type='customer-name' typeOf='string' data={orderData} update={setOrderData} /> 
          </th>
          <th>Customer Info</th>
          <th>
            Amount
            <SortingIcon type='cost' typeOf='number' data={orderData} update={setOrderData} /> 
          </th>
          <th>Items</th>
          <th>Paid?</th>
          <th>Order Type</th>
          <th>
            Business ID
            <SortingIcon type='business_id' typeOf='string' data={orderData} update={setOrderData} /> 
          </th>
          <th>Order Status</th>
          <th>Delivery #</th>
          <th>Route</th>
          <th>Driver</th>
          <th>Delivery Date</th>
          <th>Delivery ETA</th>
          <th>Delivered</th>
          <th>Additional Instructions</th>
          <th>Contact Customer</th>
        </tr>
      </thead>
      <tbody>
        {orderData.list.map((order, index) => (
          <OrderItem
            key={index}
            index={index}
            order={order[1]}
            id={order[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function OrderItem({ order, id, ...props }) {
  // const [hidden, setHidden] = useState(true);
  const address = (`${order.customer_street} ${order.customer_city} ${order.customer_state} ${order.customer_zip}`);
  const items = JSON.parse(order.items);

  const handleItems = () => {
    let total = 0;

    return (
      <React.Fragment>
        {Object.entries(items).map((item, index) => {
          total += item[1];
          return (<p key={index}>{`${item[0]}: ${item[1]}`}</p>);
        })}
        <br /><p>total: {total}</p>
      </React.Fragment>
    );
  }
  
  return (
    <tr>
      <td>{id}</td>
      <td>N/A</td>
      <td>{`${order.customer_first_name} ${order.customer_last_name}`}</td>
      <td>{address}<br /><br />{order.customer_phone}<br />{order.customer_email}</td>
      <td>${order.cost}</td>
      <td>
        {handleItems()}
      </td>
      <td>
        <FontAwesomeIcon {...(order.hasPaid ? { icon: Icons.faCheck, color: "green" } : { icon: Icons.faTimes, color: "red" })} />
      </td>
      <td>{order.type}</td>
      <td>N/A</td>
      <td>{order.status}</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>
        <p>Order: {order.order_instructions}</p><br />
        <p>Delivery: {order.delivery_instructions}</p>
      </td>
      <td className="has-text-centered">
        <button className="button is-rounded is-super-small my-1">
          <FontAwesomeIcon icon={Icons.faPhone} />
        </button>
        <br />
        <button className="button is-rounded is-super-small my-1">
          <FontAwesomeIcon icon={Icons.faComment} />
        </button>
        <br />
        <button className="button is-rounded is-super-small my-1">
          <FontAwesomeIcon icon={Icons.faEnvelope} />
        </button>
      </td>
    </tr>
  );
}
  
  export default OrderList;
  