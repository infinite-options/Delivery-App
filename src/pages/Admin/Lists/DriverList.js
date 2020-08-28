import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import Rating from '@material-ui/lab/Rating';
// import axios from "axios";

function DriverList({ drivers, routes, ...props }) {
  console.log("rendering drivers..");
  
  return (
    <React.Fragment>
      {Object.entries(drivers).map((driver, index) => (
        <DriverItem
          key={index}
          index={index}
          driver={driver[1]}
          id={driver[0]}
          routes={routes}
        />
      ))}
    </React.Fragment>
  );
}

function DriverItem({ driver, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const address = `${driver.street}${(driver.unit ? ` ${driver.unit}` : "")} 
                   ${driver.city} ${driver.state} ${driver.zip}`;

//   const sendDriverText = (driverNumber) => {
//     console.log(`Sending Driver ${driverNumber} a text..`);
//   };

//   const skipLocation = (locationNumber) => {
//     console.log(`Skipping Location ${locationNumber}..`);
//   };

//   const changeLocation = (locationNumber) => {
//     console.log(`Editing Location ${locationNumber}..`);
//   };

//   const sendConfirmationText = (locationNumber) => {
//     console.log(`Sending Location ${locationNumber} a text..`);
//   };

//   const sendConfirmationEmail = (locationNumber) => {
//     console.log(`Sending Location ${locationNumber} an email..`);
//   };

  return (
    <div className="box list-item">
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr className="list-item-head">
            <th style={{ width: "40%" }}>
              <div style={{ width: "240px" }}>
                <span>Driver {id}: {`${driver.first_name} ${driver.last_name[0]}.`}</span>
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
            <th style={{ width: "20%" }}>
              <div style={{ width: "150%", maxWidth: "225px" }}>
                <Rating value={driver.rating} size="small" precision={0.2} readOnly />
                <span className="ml-4">Rating</span>
              </div>
            </th>
            <th style={{ width: "20%" }}>
              <button
                className="button is-super-small is-pulled-right"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="is-bordered has-text-centered" hidden={hidden}>
          <tr>
            <td>
              <div className="level">
                <div className="level-item">
                  <span style={{ width: "100%", textAlign: "left" }}>
                    First &amp; Middle Name:
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    Last Name:
                  </span>
                </div>
                <div className="level-item">
                  <span style={{ width: "100%", textAlign: "left" }}>
                    {driver.first_name}
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    {driver.last_name}
                  </span>
                </div>
              </div>
            </td>
            {/* <td className="pl-0 has-text-left" style={{ borderLeftWidth: 0 }}>
              <p className="ml-3">{driver.first_name}</p>
              <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
              <p className="ml-3">{driver.last_name}</p>
            </td> */}
            <td>
              # of hours/week<br />{driver.weekly_workload}
            </td>
            <td>
              <div style={{ width: "215%" }}>
                <div className="level">
                  <div className="level-item">
                    Driver's License #<br />{driver.drivers_license}
                  </div>
                  <div className="level-item">
                    License Expiration<br />{driver.drivers_license_exp}
                  </div>
                  <div className="level-item">
                    Vehicle Types<br />{driver.vehicle_types}
                  </div>
                </div>
              </div>
            </td>
            <td style={{ borderLeft: "hidden" }} />
          </tr>
          <tr>
            <td>
              <div className="level">
                <div className="level-item">
                  <span style={{ width: "100%" }}>
                    Emergency Contact:
                    <br />
                    {driver.emergency_contact_phone}
                  </span>
                </div>
                <div className="level-item">
                  <span style={{ width: "100%", textAlign: "left" }}>
                    {driver.emergency_contact_name}
                    <br />
                    {driver.emergency_contact_relationship}
                  </span>
                </div>
              </div>
            </td>
            <td>
              Preferred Routes<br />{driver.preferred_routes}
              {/* {driver.preferred_routes.map((route, index) => (
                <p>Route {route.id}: <span>ROUTE COLOR</span></p>
              ))} */}
            </td>
            <td>
              Days Available<br />{driver.days}
            </td>
            <td>
              Times Available<br />{driver.hours}
            </td>
          </tr>
          <FillerRow numColumns={4} showMore={showMore} setShowMore={setShowMore} />
          {showMore && ( 
            <React.Fragment>
              <tr>
                <td style={{ textAlign: "left" }}>
                  Address:<br />
                  {address}
                </td>
                <td>
                  Insurance Carrier<br />{driver.insurance_carrier}
                </td>
                <td>
                  Insurance Number<br />{driver.insurance_number}
                </td>
                <td>
                  Insurance Expiration<br />{driver.insurance_expiration}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="level">
                    <div className="level-item">
                      Phone #1<br />{driver.phone}
                    </div>
                    <div className="level-item">
                      Phone #2<br />{driver.phone2}
                    </div>
                  </div>
                </td>
                <td>
                  Email<br />{driver.email}
                </td>
                <td>
                  Account Password<br />{driver.password}
                </td>
                <td>
                  Business ID<br /> {driver.business_id}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="level">
                    <div className="level-item">
                      <span style={{ width: "100%" }}>
                        Bank Account #
                        <br />
                        {driver.bank_account_info}
                      </span>
                    </div>
                    <div className="level-item">
                      <span style={{ width: "100%" }}>
                        Bank Routing #
                        <br />
                        {driver.bank_routing_info}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                SSN<br />{driver.ssn}
                </td>
                <td>
                  Hourly Rate<br />{driver.hourly_rate}
                </td>
                <td>
                  Delivery Fee<br />{driver.delivery_fee}
                </td>
              </tr>
            </React.Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DriverList;
