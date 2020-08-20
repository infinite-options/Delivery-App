import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import Rating from '@material-ui/lab/Rating';
// import axios from "axios";

function DriverList({ drivers, routes, props }) {
  console.log("rendering drivers..");
  
  return (
    <React.Fragment>
      {Object.entries(drivers).map((driver, index) => (
        <DriverItem
          key={index}
          props={{
            driver: driver[1],
            id: driver[0],
            routes: routes,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function DriverItem({ props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);

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
                <span>Driver {props.id}: {`${props.driver.first_name} ${props.driver.last_name[0]}.`}</span>
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
            <th style={{ width: "20%" }}>
              <div style={{ width: "150%", maxWidth: "225px" }}>
                <Rating value={props.driver.rating} size="small" precision={0.2} readOnly />
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
                    {props.driver.first_name}
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    {props.driver.last_name}
                  </span>
                </div>
              </div>
            </td>
            {/* <td className="pl-0 has-text-left" style={{ borderLeftWidth: 0 }}>
              <p className="ml-3">{props.driver.first_name}</p>
              <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
              <p className="ml-3">{props.driver.last_name}</p>
            </td> */}
            <td>
              # of hours/week<br />{props.driver.weekly_workload}
            </td>
            <td>
              Driver's License #<br />{props.driver.drivers_license}
            </td>
            <td>
              Business ID<br />{props.driver.business_id}
            </td>
          </tr>
          <tr>
            <td>
              <div className="level">
                <div className="level-item">
                  <span style={{ width: "100%" }}>
                    Emergency Contact:
                    <br />
                    xxx-xxx-xxxx
                  </span>
                </div>
                <div className="level-item">
                  <span style={{ width: "100%", textAlign: "left" }}>
                    (Name) N/A
                    <br />
                    (Relationship) N/A
                  </span>
                </div>
              </div>
            </td>
            <td>
              Preferred Routes<br /> N/A
              {/* {props.driver.preferred_routes.map((route, idx) => (
                <p>Route {route.id}: <span>ROUTE COLOR</span></p>
              ))} */}
            </td>
            <td>
              Days Available<br />{props.driver.day_availability}
            </td>
            <td>
              Times Available<br />{props.driver.time_availability}
            </td>
          </tr>
          <FillerRow numColumns={4} showMore={showMore} setShowMore={setShowMore} />
          {showMore && ( 
            <React.Fragment>
              <tr>
                <td style={{ textAlign: "left" }}>
                  Address:<br />
                  {props.driver.address} N/A
                </td>
                <td>
                  SSN<br />{props.driver.ssn}
                </td>
                <td>
                  Vehicle<br />{props.driver.vehicle} N/A
                </td>
                <td>
                  Driver Password<br />{props.driver.password}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="level">
                    <div className="level-item">
                      <span style={{ width: "100%" }}>
                        Bank Account #
                        <br />
                        xxx-xxx-xxxx
                      </span>
                    </div>
                    <div className="level-item">
                      <span style={{ width: "100%" }}>
                        Bank Routing #
                        <br />
                        xxx-xxx-xxxx
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  Insurance Carrier<br /> N/A
                </td>
                <td>
                  Policy #<br />{props.driver.insurance_number}
                </td>
                <td>
                  Expiration<br />{props.driver.expiration}
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
