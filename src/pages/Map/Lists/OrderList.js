import React, { useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
// import axios from "axios";

function reducer(state, action) {
  switch(action.type) {
    case 'id':
      const newValue = state.sortBy === 'id' ? -state.value: -1;
      return {
        sortBy: 'id',
        value: newValue,
        list: [...state.list].sort((a, b) => (newValue === 1 ? a[0] - b[0] : b[0] - a[0])),
      };
    default:
      return state;
  }
}

function OrderList({ orders, props }) {
  console.log("rendering orders..");
  const [orderData, dispatch] = useReducer(reducer, {
    sortBy: "", // sortBy 'id', 'name', etc
    value: 0, // value 1=ascending, -1=descending
    list: Object.entries(orders),
  });
  console.log(orderData);
  // const [orderList, setOrderList] = useState(Object.entries(orders));
  
  // const toggleSort = (type) => {
  //   switch (type) {
  //     case 'id': 
  //       setOrderList(prevList => {
  //         return [...prevList].sort((a, b) => (b[0] - a[0]));
  //       });
  //       console.log(orderList);
  //       break;
  //     default: console.log("Sorting... invalid type");
  //   }
  // }

  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>
            Order #
            <FontAwesomeIcon 
              icon={
                orderData.sortBy !== 'id' 
                  ? Icons.faSort 
                  : Icons[orderData.value === 1 ? 'faSortUp' : 'faSortDown']
              }
              color="lightgrey"
              className="ml-1" 
              style={{ cursor: "pointer" }}
              onClick={() => dispatch({ type: "id" })}
            />  
          </th>
          <th>Date &amp; Time</th>
          <th>Customer Name</th>
          <th>Customer Info</th>
          <th>Amount</th>
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
      <td>N/A</td>
      <td>{`${props.order.customer_first_name} ${props.order.customer_last_name}`}</td>
      <td>{address}<br /><br />{props.order.customer_phone}<br />{props.order.customer_email}</td>
      <td>${props.order.cost}</td>
      <td>
        {handleItems()}
      </td>
      <td>
        <FontAwesomeIcon {...(props.order.hasPaid ? { icon: Icons.faCheck, color: "green" } : { icon: Icons.faTimes, color: "red" })} />
      </td>
      <td>{props.order.type}</td>
      <td>N/A</td>
      <td>{props.order.status}</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>
        <p>Order: {props.order.order_instructions}</p><br />
        <p>Delivery: {props.order.delivery_instructions}</p>
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
  