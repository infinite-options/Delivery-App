import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import EditItemField from "utils/Components/EditItemField";
import { BASE_URL } from "utils/Functions/DataFunctions";
import axios from "axios";

function CouponList({ coupons, refunds, ...props }) {
  console.log("rendering coupons..");
  const [couponList, setCouponList] = useState(Object.entries(coupons));
  const [refundList, setRefundList] = useState(Object.entries(refunds));
  const [form, setForm] = useState();

  return (
    <React.Fragment>
      <h2 className="has-text-weight-bold ml-2 mb-1">Coupons</h2>
      {form !== "coupon" ? (
        <button
          className="button is-small mx-1 is-success is-outlined is-rounded" 
          style={{ marginBottom: "1rem" }}
          onClick={() => setForm("coupon")}
        >
          <FontAwesomeIcon icon={Icons.faPlus} className="mr-2" />
          Add Coupon
        </button>
      ) : (
        <InsertForm dataType="coupon" setForm={setForm} />
      )}
      <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items my-4">
        <thead>
          <tr>
            <th>Coupon ID</th>
            <th>Coupon Code</th>
            <th>Active</th>
            <th>Discount Amount</th>
            <th>Discount Percentage</th>
            <th>Discount Shipping</th>
            <th>Delivery Start Date</th>
            <th>Expiration Date</th>
            <th>Limits</th>
            <th>Notes</th>
            <th>Times Used</th>
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
      {form !== "refund" ? (
        <button
          className="button is-small mx-1 is-success is-outlined is-rounded" 
          style={{ marginBottom: "1rem" }}
          onClick={() => setForm("refund")}
        >
          <FontAwesomeIcon icon={Icons.faPlus} className="mr-2" />
          Add Refund
        </button>
      ) : (
        <InsertForm dataType="refund" setForm={setForm} />
      )}
      <table className="table is-fullwidth is-size-7 is-bordered has-text-centered vcenter-items my-4">
        <thead>
          <tr>
            <th>Refund ID</th>
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
          {refundList.map((refund, index) => (
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

  const handleDisableCoupon = (type, id) => {
    console.log(type, id);
    axios.post(BASE_URL + `disable${type.charAt(0).toUpperCase() + type.slice(1)}`, { [`${type}_uid`]: id })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  };

  return (
    <tr>
      <td>
        <FontAwesomeIcon 
          icon={Icons.faTrash} color={coupon.valid === "TRUE" ? "red" : "lightgrey"}
          className="mr-1" style={{ cursor: (coupon.valid === "TRUE" ? "pointer" : "not-allowed") }}
          title={coupon.valid === "TRUE" ? "Disable Coupon" : "Coupon Disabled"}
          onClick={() => (coupon.valid === "TRUE" && handleDisableCoupon("coupon", id))}
        />
        {id}
      </td>
      <td>{coupon.code}</td>
      <td>
        <FontAwesomeIcon 
          icon={coupon.valid === "TRUE" ? Icons.faCheck : Icons.faTimes}
          color={coupon.valid === "TRUE" ? "green" : "red"}
        />
      </td>
      <td>${coupon.discount_amount}</td>
      <td>{coupon.discount_percent}%</td>
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
        <img src={refund.image} alt="refund" width="48" height="48" />
      </td>
      <td>{refund.customer_note}</td>
      <td>{refund.refund_amount}</td>
      <td>{refund.coupon_id}</td>
      <td>{refund.admin_note}</td>
    </tr>
  );
}

function InsertForm({ dataType, ...props }) {
  const [data, setData] = useState({});

  const handleChange = (e, type) => {
    e.persist();
    console.log(e.target, e.target.checked, e.target.value);
    
    setData(prevData => ({
      ...prevData,
      [type]: e.target.type !== "checkbox" ? e.target.value : Number(e.target.checked),
    }));
  };

  const handleSubmit = () => {
    // console.log(data);
    let newData = { ...data };
    if (dataType === "coupon") {
      newData.valid = data.valid ? "TRUE" : "FALSE";
      newData.recurring = data.recurring ? "T" : "F";
      // newData.valid = `${data.valid}`;
      // newData.recurring = `${data.recurring}`;
    }
    console.log(newData);

    axios.post(BASE_URL + `insertNew${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`, newData)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
    props.setForm();
  };

  return (
    <React.Fragment>
      <button
        className="button is-small mx-1 is-danger is-outlined is-rounded" 
        style={{ marginBottom: "1rem" }}
        onClick={() => props.setForm()}
      >
        <FontAwesomeIcon icon={Icons.faTimes} className="mr-2" />
        Cancel
      </button>
      <button
        className="button is-small mx-1 is-success is-outlined is-rounded" 
        onClick={() => handleSubmit()}
      >
        <FontAwesomeIcon icon={Icons.faCheck} className="mr-2" />
        Save
      </button>
      <div className="box form-item" style={{ width: "480px" }}>
        {dataType === "coupon" ? (
          <React.Fragment>
            <EditItemField 
              type={'coupon_id'} value={data.coupon_id || ""}
              placeholder="Coupon Code"
              handleChange={handleChange}
            />
            <div className="mb-5">
              <EditItemField 
                type={'valid'} value={data.valid || 0}
                handleChange={handleChange}
                checkbox
              />
              <span className="is-size-7 ml-1 mr-5">Valid</span>
              <EditItemField 
                type={'recurring'} value={data.recurring || 0}
                handleChange={handleChange}
                checkbox
              />
              <span className="is-size-7 mx-1">Recurring</span>
            </div>
            <EditItemField 
              type={'discount_percent'} value={data.discount_percent || ""}
              placeholder="Discount Percentage"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'discount_amount'} value={data.discount_amount || ""}
              placeholder="Discount Amount"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'discount_shipping'} value={data.discount_shipping || ""}
              className="mb-5"
              placeholder="Discount Shipping"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'expire_date'} value={data.expire_date || ""}
              placeholder="Expiration Date"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'limits'} value={data.limits || ""}
              placeholder="Limits"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'notes'} value={data.notes || ""}
              className="mb-5"
              placeholder="Notes"
              handleChange={handleChange}
              textarea
            />
            <EditItemField 
              type={'num_used'} value={data.num_used || ""}
              className="mb-5"
              placeholder="Times Used"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'email_id'} value={data.email_id || ""}
              placeholder="Email"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'cup_business_uid'} value={data.cup_business_uid || ""}
              placeholder="Business ID"
              handleChange={handleChange}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <EditItemField 
              type={'created_at'} value={data.created_at || ""}
              className="mb-5"
              placeholder="Created At"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'email_id'} value={data.email_id || ""}
              placeholder="Email"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'phone_num'} value={data.phone_num || ""}
              className="mb-5"
              placeholder="Phone Number"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'image_url'} value={data.image_url || ""}
              className="mb-5"
              placeholder="Image URL"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'customer_note'} value={data.customer_note || ""}
              placeholder="Customer Notes"
              handleChange={handleChange}
              textarea
            />
            <EditItemField 
              type={'admin_note'} value={data.admin_note || ""}
              className="mt-1 mb-5"
              placeholder="Admin Notes"
              handleChange={handleChange}
              textarea
            />
            <EditItemField 
              type={'refund_amount'} value={data.refund_amount || ""}
              placeholder="Refund Amount"
              handleChange={handleChange}
            />
            <EditItemField 
              type={'ref_coupon_id'} value={data.ref_coupon_id || ""}
              placeholder="Coupon ID"
              handleChange={handleChange}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}
  
export default CouponList;
  