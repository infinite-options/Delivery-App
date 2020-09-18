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
      <td>{payment.purchase_id}</td>
      <td>N/A</td>
      <td>{payment.payment_time_stamp}</td>
      <td>{payment.start_delivery_date}</td>
      <td>{payment.coupon_id}</td>
      <td>{payment.amount_due}</td>
      <td>{payment.amount_discount}</td>
      <td>{payment.amount_paid}</td>
      <td>{payment.charge_id}</td>
      <td>{payment.payment_type}</td>
      <td>{payment.info_is_Addon}</td>
      <td>{payment.credit_card_num}</td>
      <td>{payment.credit_card_cvv}</td>
      <td>{payment.credit_card_expiration}</td>
      <td>{payment.credit_card_zip}</td>
    </tr>
  );
}
  
export default PaymentList;
  