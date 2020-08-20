import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import moment from "moment";
// import axios from "axios";

function BusinessList({ businesses, props }) {
  console.log("rendering businesses..");
  
  return (
    <React.Fragment>
      {Object.entries(businesses).map((business, index) => (
        <BusinessItem
          key={index}
          props={{
            business: business[1],
            id: business[0],
            // colors: colors,
            index,
          }}
        />
      ))}
    </React.Fragment>
  );
}

function BusinessItem({ props }) {
  const [hidden, setHidden] = useState(true);
  const address = `${props.business.street}${(props.business.unit ? ` ${props.business.unit}` : "")} 
                   ${props.business.city} ${props.business.state} ${props.business.zip}`;

  const handleDateTime = (input) => {
    if (input) {
      const split = input.split(/-|T/);
      const date_time = `${split[0]} ${moment.monthsShort(Number(split[1]))} ${split[2]}, ${split[3]}`;
      // for (let section of split) date_time += `${section} `;
      return date_time;
    }
  }

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
              <div style={{ width: "150%" }}>
                {/* Displaying only the second section of a business id. Ex: 200-000011 => 11 */}
                <span>Business {Number(props.id.substring(props.id.indexOf("-") + 1, props.id.length))}: {props.business.name}</span>
              </div>
            </th>
            <th style={{ width: "20%" }} />
            <th style={{ width: "20%" }} />
            <th style={{ width: "20%" }} />
            <th style={{ width: "20%" }}>
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
              Name<br />{props.business.name}
            </td>
            <td>
              Type<br />{props.business.type}
            </td>
            <td>
              Description<br />{props.business.description}
            </td>
            <td>
              Established<br />{handleDateTime(props.business.est)}
            </td>
            <td>
              Image<br /><img src={props.business.image} width="48" height="48" />
            </td>
          </tr>
          <tr>
            <td>
              Address<br />{address}
            </td>
            <td>
              Business Hours<br />{props.business.hours}
            </td>
            <td>
              Delivery Hours<br />{props.business.delivery_hours}
            </td>
            <td>
              Accepting Hours<br />{props.business.accepting_hours}
            </td>
            <td>
              Available Zones<br />{props.business.available_zones}
            </td>
          </tr>
          <tr>
            <td>
              Phone #1: {props.business.phone}
              <br />
              Phone #2: {props.business.phone2}
            </td>
            <td>
              Email<br />{props.business.email}
            </td>
            <td>
              Contact Person<br />{`${props.business.contact_first_name} ${props.business.contact_last_name}`}
            </td>
            <td>
              Notification Approval: {props.business.notification_approval}
              <br />
              Notification ID: {props.business.notification_device_id}
            </td>
            <td>
              {"Can Deliver: "}
              <FontAwesomeIcon 
                icon={props.business.delivery ? Icons.faCheck : Icons.faTimes}
                color={props.business.delivery ? "green" : "red"} 
              />
              <br />
              {"Can Cancel: "}
              <FontAwesomeIcon 
                icon={props.business.can_cancel ? Icons.faCheck : Icons.faTimes}
                color={props.business.can_cancel ? "green" : "red"} 
              />
              <br />
              {"Is Reusable: "}
              <FontAwesomeIcon 
                icon={props.business.reusable ? Icons.faCheck : Icons.faTimes}
                color={props.business.reusable ? "green" : "red"} 
              />
            </td>
          </tr>
          <tr>
            <td>
              License<br />{props.business.license}
            </td>
            <td>
              Password<br />
              <div className="wrap-text">{props.business.password}</div>
            </td>
            <td>
              EIN<br />{props.business.EIN}
            </td>
            <td>
              USDOT<br />{props.business.USDOT}
            </td>
            <td>
              WAUBI<br />{props.business.WAUBI}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BusinessList;
