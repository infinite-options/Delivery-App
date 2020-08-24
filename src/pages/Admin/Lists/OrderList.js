import React, { useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import SortingIcon from "utils/Components/SortingIcon";
// import axios from "axios";

function reducer(state, action) {
  const newValue = state.sortBy === action.type ? -state.value: -1;

  // console.log(state);
  switch(action.type) {
    case 'id':
      return {
        sortBy: 'id',
        value: newValue,
        list: [...state.list].sort((a, b) => (
          newValue === 1 ? a[0] - b[0] : b[0] - a[0]
        )),
      };
    case 'customer-name':
      return {
        sortBy: 'customer-name',
        value: newValue,
        list: [...state.list].sort((a, b) => {
          const name_a = `${a[1].customer_first_name} ${a[1].customer_last_name}`.toLowerCase();
          const name_b = `${b[1].customer_first_name} ${b[1].customer_last_name}`.toLowerCase();
          // console.log(value_a, value_b);
          return (newValue === 1 ? name_a.localeCompare(name_b) : name_b.localeCompare(name_a));
        }),
      };
    case 'amount':
      return {
        sortBy: 'amount',
        value: newValue,
        list: [...state.list].sort((a, b) => (
          newValue === 1 ? a[1].cost - b[1].cost : b[1].cost - a[1].cost
        )),
      };
    default:
      return state;
  }
}

function OrderList({ orders, ...props }) {
  console.log("rendering orders..");
  const [orderData, dispatch] = useReducer(reducer, {
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
            <SortingIcon type='id' data={orderData} dispatch={dispatch} />
          </th>
          <th>Date &amp; Time</th>
          <th>
            Customer Name
            <SortingIcon type='customer-name' data={orderData} dispatch={dispatch} />  
          </th>
          <th>Customer Info</th>
          <th>
            Amount
            <SortingIcon type='amount' data={orderData} dispatch={dispatch} />  
          </th>
          <th>Items</th>
          <th>Paid?</th>
          <th>Order Type</th>
          <th>Business ID</th>
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
  