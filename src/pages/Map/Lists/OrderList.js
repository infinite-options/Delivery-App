import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
// import axios from "axios";

function OrderList({ orders, props }) {
  console.log("rendering orders..");
  
  return (
    <table className="table is-fullwidth is-size-7 is-bordered">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date &amp; Time</th>
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
          <th>Additional Instructions</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.entries(orders).map((order, index) => (
          <OrderItem
            key={index}
            props={{
              order: order[1],
              id: order[0],
              index,
            }}
          />
        ))}
      </tbody>
    </table>
  );
}

function OrderItem({ props }) {
  // const [hidden, setHidden] = useState(true);
  const address = (`${props.order.customer_street} ${props.order.customer_city} ${props.order.customer_state} ${props.order.customer_zip}`);
  const items = JSON.parse(props.order.items);

  const handleItems = () => {
    let total = 0;

    return (
      <React.Fragment>
        {Object.entries(items).map((item, idx) => {
          total += item[1];
          return (<p key={idx}>{`${item[0]}: ${item[1]}`}</p>);
        })}
        <br /><p>total: {total}</p>
      </React.Fragment>
    );
  }
  
  return (
    <tr>
      <td>{props.id}</td>
      <td>PLACEHOLDER</td>
      <td>{`${props.order.customer_first_name} ${props.order.customer_last_name}`}</td>
      <td>{address}<br /><br />{props.order.customer_phone}<br />{props.order.customer_email}</td>
      <td>${props.order.cost}</td>
      <td>
        {handleItems()}
      </td>
      <td>PLACEHOLDER</td>
      <td>{props.order.type}</td>
      <td>PLACEHOLDER</td>
      <td>{props.order.status}</td>
      <td>PLACEHOLDER</td>
      <td>PLACEHOLDER</td>
      <td>PLACEHOLDER</td>
      <td>PLACEHOLDER</td>
      <td>PLACEHOLDER</td>
      <td>PLACEHOLDER</td>
      <td>
        <p>Order: {props.order.order_instructions}</p><br />
        <p>Delivery: {props.order.delivery_instructions}</p>
      </td>
      <td className="has-text-centered">
        <button className="button is-rounded is-small my-2">
          <FontAwesomeIcon icon={Icons.faComment} />
        </button>
        <br />
        <button className="button is-rounded is-small my-2">
          <FontAwesomeIcon icon={Icons.faEnvelope} />
        </button>
      </td>
    </tr>
  );
}
  
  export default OrderList;
  