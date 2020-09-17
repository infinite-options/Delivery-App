import React, { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import SortingIcon from "utils/Components/SortingIcon";
// import axios from "axios";

function PurchaseList({ purchases, ...props }) {
  console.log("rendering purchases..");
  const [purchaseData, setPurchaseData] = useState({
    sortBy: "", // sortBy 'id', 'name', etc
    value: 0, // value 1=ascending, -1=descending
    list: Object.entries(purchases),
  });

  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>
            Purchase ID
            <SortingIcon type='id' typeOf='string' data={purchaseData} update={setPurchaseData} />
          </th>
          <th>Purchase Date</th>
          <th>Customer ID</th>
          <th>
            Delivery Name
            <SortingIcon type='delivery-name' typeOf='string' data={purchaseData} update={setPurchaseData} /> 
          </th>
          <th>Delivery Info</th>
          <th>
            Amount
            <SortingIcon type='cost' typeOf='number' data={purchaseData} update={setPurchaseData} /> 
          </th>
          <th>Items</th>
          <th>Paid</th>
          <th>Order Type</th>
          <th>
            Business ID
            <SortingIcon type='business_id' typeOf='string' data={purchaseData} update={setPurchaseData} /> 
          </th>
          <th>Purchase Status</th>
          <th>Delivery #</th>
          <th>Route</th>
          <th>Driver</th>
          <th>Delivery Date</th>
          <th>Delivery ETA</th>
          <th>Delivered</th>
          <th>Purchase Notes</th>
          <th>Additional Instructions</th>
          <th>Contact Customer</th>
        </tr>
      </thead>
      <tbody>
        {purchaseData.list.map((purchase, index) => (
          <PurchaseItem
            key={index}
            index={index}
            purchase={purchase[1]}
            id={purchase[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function PurchaseItem({ purchase, id, ...props }) {
  // const [hidden, setHidden] = useState(true);
  const address = `${purchase.delivery_street}${(purchase.delivery_unit ? ` ${purchase.delivery_unit}` : "")} 
                   ${purchase.delivery_city} ${purchase.delivery_state} ${purchase.delivery_zip}`;
  const items = JSON.parse(purchase.items);

  // const handleItems = () => {
  //   let total = 0;

  //   return (
  //     <React.Fragment>
  //       {Object.entries(items).map((item, index) => {
  //         total += item[1];
  //         return (<p key={index}>{`${item[0]}: ${item[1]}`}</p>);
  //       })}
  //       <br /><p>total: {total}</p>
  //     </React.Fragment>
  //   );
  // }
  
  return (
    <tr>
      <td>{id}</td>
      <td>{purchase.purchase_date}</td>
      <td>{purchase.customer_id}</td>
      <td>{`${purchase.delivery_first_name} ${purchase.delivery_last_name}`}</td>
      <td>
        Address: <br />{address}<br /><br />
        Phone #: <br />{purchase.delivery_phone}<br />
        Email: <br />{purchase.delivery_email}
      </td>
      <td>${purchase.cost}</td>
      <td>
        {/* {handleItems()} */}
        {purchase.items}
      </td>
      <td>
        <FontAwesomeIcon {...(purchase.hasPaid ? { icon: Icons.faCheck, color: "green" } : { icon: Icons.faTimes, color: "red" })} />
      </td>
      <td>{purchase.order_type}</td>
      <td>{purchase.business_id}</td>
      <td>{purchase.purchase_status}</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>{purchase.purchase_notes}</td>
      <td>
        <p>Order Instructions: {purchase.order_instructions}</p><br />
        <p>Delivery Instructions: {purchase.delivery_instructions}</p>
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
  
  export default PurchaseList;
  