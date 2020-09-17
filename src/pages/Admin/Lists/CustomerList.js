import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow"
// import axios from "axios";

function CustomerList({ customers, ...props }) {
  console.log("rendering customers..");
  const [customerData, setCustomerData] = useState(Object.entries(customers));

  useEffect(() => {
    const customerData = Object.entries(customers);
    if (props.filter) {
      setCustomerData(() => {
        return customerData.filter(customer => {
          // console.log(customer[1][props.filter.option], props.filter.value);
          // eslint-disable-next-line
          return customer[1][props.filter.option] == props.filter.value
        });
      });
    }
    else setCustomerData(customerData);
  }, [customers, props.filter]);

  return (
    <React.Fragment>
      {customerData.map((customer, index) => (
        <CustomerItem
          key={index}
          index={index}
          customer={customer[1]}
          id={customer[0]}
        />
      ))}
    </React.Fragment>
  );
}

function CustomerItem({ customer, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const address = `${customer.street}${customer.unit ? ` ${customer.unit}` : ""} ${customer.city} ${customer.state} ${customer.zip}`;
  const customer_id = Number(id.substring(id.indexOf("-") + 1, id.length));

  return (
    <div className="box list-item">
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr className="list-item-head">
            <th style={{ width: "20%" }}>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <div style={{ width: "200%", maxWidth: "240px" }}>
                <span>Customer {customer_id}: {`${customer.first_name} ${customer.last_name[0]}.`}</span>
                <button
                  className="button is-rounded is-pulled-right is-super-small ml-1"
                  // onClick={() => sendEmail(index + 1)}
                >
                  <FontAwesomeIcon icon={Icons.faEnvelope} />
                </button>
                {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
                <button
                  className="button is-rounded is-pulled-right is-super-small"
                  // onClick={() => sendText(index + 1)}
                >
                  <FontAwesomeIcon icon={Icons.faComment} />
                </button>
              </div>
            </th>
            <th style={{ width: "20%" }} />
            <th style={{ width: "20%" }} />
            <th style={{ width: "20%" }} />
            <th style={{ width: "20%" }} >
              <button
                className="button is-super-small is-pulled-right"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="is-bordered has-text-centered" hidden={hidden}>
          <tr>
            <td>
              <div className="level" style={{ width: "215%" }}>
                <div className="level-item">
                  <span style={{ width: "100%", textAlign: "left" }}>
                    First &amp; Middle Name:
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    Last Name:
                  </span>
                </div>
                <div className="level-item">
                  <span style={{ width: "100%", textAlign: "left" }}>
                    {customer.first_name}
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    {customer.last_name}
                  </span>
                </div>
              </div>
            </td>
            <td style={{ borderLeft: "hidden" }} />
            <td>
              Phone #<br />{customer.phone}
            </td>
            <td>
              SMS Frequency<br />{customer.SMS_frequency}
            </td>
            <td>
              SMS Last Notification<br />{customer.SMS_last_notification}
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ width: "215%" }}>
                Address<br />{address}
              </div>
            </td>
            <td style={{ borderLeft: "hidden" }} />
            <td>
              Email: {customer.email}
            </td>
            <td>
              Notification Approval<br />{customer.notification_approval}
            </td>
            <td>
              Notification ID<br />{customer.notification_id}
            </td>
          </tr>
          <FillerRow numColumns={5} showMore={showMore} setShowMore={setShowMore} />
          {showMore && (
            <React.Fragment>
              <tr>
                <td>
                  Account Verified<br />
                  <FontAwesomeIcon 
                    icon={customer.verified ? Icons.faCheck : Icons.faTimes}
                    color={customer.verified ? "green" : "red"}
                  />
                </td>
                <td>
                  <div style={{ width: "415%" }}>
                    <div className="level">
                      <div className="level-item">
                        Password Salt<br />{customer.password_salt}
                      </div>
                      <div className="level-item" style={{ display: "inline-block", width: "33%" }}>
                        Password Hash<br />{customer.password_hash}
                      </div>
                      <div className="level-item">
                        Password Algorithm<br />{customer.password_algorithm}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ borderLeft: "hidden" }} />
                <td style={{ borderLeft: "hidden" }} />
                <td style={{ borderLeft: "hidden" }} />
              </tr>
              <tr>
                <td>
                  Referral Source<br />{customer.referral_source}
                </td>
                <td>
                  Role<br />{customer.role}
                </td>
                <td>
                  Last Update<br />{customer.last_update}
                </td>
                <td>
                  Customer Representative<br />{customer.customer_rep}
                </td>
                <td>
                  Routes<br />{customer.route_id}
                </td>
              </tr>
            </React.Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
