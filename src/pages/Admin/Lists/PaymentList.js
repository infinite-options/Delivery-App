import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
// import axios from "axios";

function PaymentList({ payments, ...props }) {
  console.log("rendering payments..");
  const [paymentList, setPaymentList] = useState(Object.entries(payments));
  
  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>Payment ID</th>
          <th>Purchase ID</th>
          <th>Payment Date</th>
          <th>Payment Time Stamp</th>
          <th>Delivery Start Date</th>
          <th>Coupon ID</th>
          <th>Amount Due</th>
          <th>Discount</th>
          <th>Amount Paid</th>
          <th>Charge ID</th>
          <th>Payment Type</th>
          <th>Info</th>
          <th>Credit Card #</th>
          <th>Credit Card CVV</th>
          <th>Credit Card Expiration</th>
          <th>Credit Card Zip</th>
        </tr>
      </thead>
      <tbody>
        {paymentList.map((payment, index) => (
          <PaymentItem
            key={index}
            index={index}
            payment={payment[1]}
            id={payment[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function PaymentItem({ payment, id, ...props }) {
  // const [hidden, setHidden] = useState(true);

  return (
    <tr>
      <td>{id}</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
}
  
export default PaymentList;
  