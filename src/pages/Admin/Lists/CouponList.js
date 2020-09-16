import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import EditItemField from "utils/Components/EditItemField";
// import axios from "axios";

function CouponList({ coupons, refunds, ...props }) {
  console.log("rendering coupons..");
  const [couponList, setCouponList] = useState(Object.entries(coupons));
  const [refundList, setRefundList] = useState(Object.entries(refunds));
  const [couponForm, setCouponForm] = useState(false);
  const [refundForm, setRefundForm] = useState(false);

  return (
    <React.Fragment>
      <h2 className="has-text-weight-bold ml-2 mb-1">Coupons</h2>
      {!couponForm ? (
        <button
          className="button is-small mx-1 is-success is-outlined is-rounded" 
          style={{ marginBottom: "1rem" }}
          onClick={() => setCouponForm(true)}
        >
          <FontAwesomeIcon icon={Icons.faPlus} className="mr-2" />
          Add Coupon
        </button>
      ) : (
        <CouponForm setCouponForm={setCouponForm} />
      )}
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
          {refundList.map((refund, index) => ( // NOTE: create refindList array
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
      <td>{refund.created_at}</td>
      <td>{refund.email}</td>
      <td>{refund.phone}</td>
      <td>
        <img src={refund.image} alt="coupon" width="48" height="48" />
      </td>
      <td>{refund.customer_notes}</td>
      <td>{refund.refund_amount}</td>
      <td>{refund.coupon_id}</td>
      <td>{refund.admin_notes}</td>
    </tr>
  );
}

function CouponForm(props) {
  const [couponData, setCouponData] = useState({});

  const handleChange = (e, type) => {
    e.persist();
    console.log(e.target, e.target.checked, e.target.value);
    
    setCouponData(prevCouponData => ({
      ...prevCouponData,
      [type]: e.target.type !== "checkbox" ? e.target.value : Number(e.target.checked),
    }));
  };

  const handleCouponSubmit = () => {
    console.log(couponData);
  };

  return (
    <React.Fragment>
      <button
        className="button is-small mx-1 is-danger is-outlined is-rounded" 
        style={{ marginBottom: "1rem" }}
        onClick={() => props.setCouponForm(false)}
      >
        <FontAwesomeIcon icon={Icons.faTimes} className="mr-2" />
        Cancel
      </button>
      <button
        className="button is-small mx-1 is-success is-outlined is-rounded" 
        onClick={() => handleCouponSubmit()}
      >
        <FontAwesomeIcon icon={Icons.faCheck} className="mr-2" />
        Save
      </button>
      <div className="box form-item">
        <EditItemField 
          type={'coupon_id'} value={couponData.coupon_id || ""}
          placeholder="Coupon Code"
          handleChange={handleChange}
        />
        <div className="mb-5">
          <EditItemField 
            type={'valid'} value={couponData.valid || 0}
            handleChange={handleChange}
            checkbox
          />
          <span className="is-size-7 ml-1 mr-5">Valid</span>
          <EditItemField 
            type={'recurring'} value={couponData.recurring || 0}
            handleChange={handleChange}
            checkbox
          />
          <span className="is-size-7 mx-1">Recurring</span>
        </div>
        <EditItemField 
          type={'discount_percent'} value={couponData.discount_percent || ""}
          placeholder="Discount Percentage"
          handleChange={handleChange}
        />
        <EditItemField 
          type={'discount_amount'} value={couponData.discount_amount || ""}
          placeholder="Discount Amount"
          handleChange={handleChange}
        />
        <EditItemField 
          type={'discount_shipping'} value={couponData.discount_shipping || ""}
          className="mb-5"
          placeholder="Discount Shipping"
          handleChange={handleChange}
        />
        <EditItemField 
          type={'expire_date'} value={couponData.expire_date || ""}
          placeholder="Expiration Date"
          handleChange={handleChange}
        />
        <EditItemField 
          type={'limits'} value={couponData.limits || ""}
          placeholder="Limits"
          handleChange={handleChange}
        />
        <EditItemField 
          type={'notes'} value={couponData.notes || ""}
          className="mb-5"
          placeholder="Notes"
          handleChange={handleChange}
          textarea
        />
        <EditItemField 
          type={'num_used'} value={couponData.num_used || ""}
          className="mb-5"
          placeholder="Times Used"
          handleChange={handleChange}
        />
        {/* <div>
          <span style={{ fontSize: "0.75rem" }}>Recurring </span>
          <EditItemField 
            type={'recurring'} value={couponData.recurring || 0}
            handleChange={handleChange}
            checkbox
          />
        </div> */}
        <EditItemField 
          type={'email_id'} value={couponData.email_id || ""}
          placeholder="Email"
          handleChange={handleChange}
        />
        <EditItemField 
          type={'cup_business_uid'} value={couponData.cup_business_uid || ""}
          placeholder="Business ID"
          handleChange={handleChange}
        />
      </div>
    </React.Fragment>
  )
}
  
export default CouponList;
  