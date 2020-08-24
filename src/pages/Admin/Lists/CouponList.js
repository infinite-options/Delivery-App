import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
// import axios from "axios";

function CouponList({ coupons, ...props }) {
  console.log("rendering coupons..");
  const [couponList, setCouponList] = useState(Object.entries(coupons));
  
  return (
    <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items">
      <thead>
        <tr>
          <th>Coupon #</th>
          <th>Active</th>
          <th>Discount Amount</th>
          <th>Discount Shipping</th>
          <th>Delivery Start Date</th>
          <th>Expiration Date</th>
          <th>Limits</th>
          <th>Notes</th>
          <th>Number Used</th>
          <th>Recurring</th>
          <th>Email ID</th>
          <th>Business ID</th>
        </tr>
      </thead>
      <tbody>
        {couponList.map((coupon, index) => (
          <CouponItem
            key={index}
            coupon={coupon[1]}
            id={coupon[0]}
          />
        ))}
      </tbody>
    </table>
  );
}

function CouponItem({ coupon, id, ...props }) {
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
    </tr>
  );
}
  
export default CouponList;
  