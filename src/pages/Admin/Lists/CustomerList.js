import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow"
// import axios from "axios";

function CustomerList({ customers, props }) {
  console.log("rendering customers..");
  
  return (
    <React.Fragment>
      {Object.entries(customers).map((customer, index) => (
        <CustomerItem
          key={index}
          props={{
            customer: customer[1],
            id: customer[0],
            // colors: colors,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function CustomerItem({ props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const address = `${props.customer.street}${props.customer.unit ? ` ${props.customer.unit}` : ""} ${props.customer.city} ${props.customer.state} ${props.customer.zip}`;

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
                <span>Customer {props.id}: {`${props.customer.first_name} ${props.customer.last_name[0]}.`}</span>
                <button
                  className="button is-rounded is-pulled-right is-super-small ml-1"
                  // onClick={() => sendEmail(idx + 1)}
                >
                  <FontAwesomeIcon icon={Icons.faEnvelope} />
                </button>
                {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
                <button
                  className="button is-rounded is-pulled-right is-super-small"
                  // onClick={() => sendText(idx + 1)}
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
                    {props.customer.first_name}
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    {props.customer.last_name}
                  </span>
                </div>
              </div>
            </td>
            <td style={{ borderLeft: "hidden" }} />
            <td>
              Phone #<br />{props.customer.phone}
            </td>
            <td>
              SMS Frequency<br />{props.customer.SMS_frequency}
            </td>
            <td>
              SMS Last Notification<br />{props.customer.SMS_last_notification}
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
              Email: {props.customer.email}
            </td>
            <td>
              Notification Approval<br />{props.customer.notification_approval}
            </td>
            <td>
              Notification ID<br />{props.customer.notification_id}
            </td>
          </tr>
          <FillerRow numColumns={5} showMore={showMore} setShowMore={setShowMore} />
          {showMore && (
            <React.Fragment>
              <tr>
                <td>
                  Account Verified<br />{props.customer.verified}
                </td>
                <td>
                  <div className="level" style={{ width: "415%" }}>
                    <div className="level-item">
                      Password Salt<br />{props.customer.password_salt}
                    </div>
                    <div className="level-item">
                      Password Hash<br />{props.customer.password_hash}
                    </div>
                    <div className="level-item">
                      Password Algorithm<br />{props.customer.password_algorithm}
                    </div>
                  </div>
                </td>
                <td style={{ borderLeft: "hidden" }} />
                <td style={{ borderLeft: "hidden" }} />
                <td style={{ borderLeft: "hidden" }} />
              </tr>
              <tr>
                <td>
                  Referral Source<br />{props.customer.referral_source}
                </td>
                <td>
                  Role<br />{props.customer.role}
                </td>
                <td>
                  Last Update<br />{props.customer.last_update}
                </td>
                <td>
                  Customer Representative<br />{props.customer.customer_rep}
                </td>
                <td>
                  Routes<br />{props.customer.route_id}
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
