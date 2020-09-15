import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
// import axios from "axios";

function CouponList({ coupons, ...props }) {
  console.log("rendering coupons..");
  const [couponList, setCouponList] = useState(Object.entries(coupons));
  
  return (
    <React.Fragment>
      <h2 className="has-text-weight-bold ml-2">Coupons</h2>
      <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items my-4">
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
              index={index}
              coupon={coupon[1]}
              id={coupon[0]}
            />
          ))}
        </tbody>
      </table>
      <h2 className="has-text-weight-bold ml-2 mt-6">Refunds</h2>
      <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items my-4">
        <thead>
          <tr>
            <th>Refund #</th>
            <th>Created At</th>
            <th>Email ID</th>
            <th>Phone #</th>
            <th>Image</th>
            <th>Customer Notes</th>
            <th>Refund Amount</th>
            <th>Coupon ID</th>
            <th>Admin Notes</th>
          </tr>
        </thead>
        <tbody>
          {couponList.map((refund, index) => ( // NOTE: create refindList array
            <RefundItem
              key={index}
              index={index}
              refund={refund[1]}
              id={refund[0]}
            />
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}

function CouponItem({ coupon, id, ...props }) {
  // const [hidden, setHidden] = useState(true);

  return (
    <tr>
      <td>{id}</td>
      <td>
        <FontAwesomeIcon 
          icon={coupon.valid === "TRUE" ? Icons.faCheck : Icons.faTimes}
          color={coupon.valid === "TRUE" ? "green" : "red"}
        />
      </td>
      <td>
        {coupon.discount_amount}<br />
        {coupon.discount_percent}%
      </td>
      <td>{coupon.discount_shipping}</td>
      <td>N/A</td>
      <td>{coupon.expire_date}</td>
      <td>{coupon.limits}</td>
      <td>{coupon.notes}</td>
      <td>{coupon.num_used}</td>
      <td>
        <FontAwesomeIcon 
          icon={coupon.recurring === "T" ? Icons.faCheck : Icons.faTimes}
          color={coupon.recurring === "T" ? "green" : "red"}
        />
      </td>
      <td>{coupon.email}</td>
      <td>{coupon.business_id}</td>
    </tr>
  );
}

function RefundItem({ refund, id, ...props }) {
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
    </tr>
  );
}
  
export default CouponList;
  