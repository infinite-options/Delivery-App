import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import moment from "moment";
// import axios from "axios";

const weekdays = moment.weekdays();

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
  const [showMore, setShowMore] = useState(false);
  const [businessDay, setBusinessDay] = useState(0);
  const [deliveryDay, setDeliveryDay] = useState(0);
  const [acceptingDay, setAcceptingDay] = useState(0);
  const address = `${props.business.street}${(props.business.unit ? ` ${props.business.unit}` : "")} 
                   ${props.business.city} ${props.business.state} ${props.business.zip}`;
  const business_id = Number(props.id.substring(props.id.indexOf("-") + 1, props.id.length));
  const displayDayHours = (type) => {
    const days = JSON.parse(type);
    // console.log(days);
    return (
      <React.Fragment>
        {weekdays.map((day, idx) => (
          <p key={idx}>{day}: {days[day]}</p>
        ))}
      </React.Fragment>
    );
  };
  // console.log(weekdays);

  const handleDateTime = (input) => {
    if (input) {
      const split = input.split(/-|T/);
      const date_time = `${split[0]} ${moment.monthsShort(Number(split[1]))} ${split[2]}, ${split[3]}`;
      // for (let section of split) date_time += `${section} `;
      return date_time;
    }
  };

  const sendBusinessText = (businessNumber) => {
    console.log(`Sending Business ${businessNumber} a text..`);
  };

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
              <div style={{ width: "300%", maxWidth: "325px" }}>
                {/* Displaying only the second section of a business id. Ex: 200-000011 => 11 */}
                <span>Business {business_id}: {props.business.name}</span>
                <button
                  className="button is-rounded is-super-small is-pulled-right ml-1"
                  onClick={() => console.log("Not sure what this does atm")}
                >
                  <FontAwesomeIcon icon={Icons.faPhone} />
                </button>
                <button
                  className="button is-rounded is-super-small is-pulled-right"
                  onClick={() => sendBusinessText(business_id)}
                >
                  <FontAwesomeIcon icon={Icons.faComment} />
                </button>
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
              Business Image<br /><img src={props.business.image} width="48" height="48" />
            </td>
            <td>
              Registered At<br />{handleDateTime(props.business.registered)}
            </td>
            <td>
              Type<br />{props.business.type}
            </td>
            <td>
              <div style={{ width: "215%" }}>
                Description<br />{props.business.description}
              </div>
            </td>
            <td style={{ borderLeft: "hidden" }} />
          </tr>
          <tr>
            <td>
              <div style={{ width: "215%" }}>
                Address<br />{address}
              </div>
            </td>
            <td style={{ borderLeft: "hidden" }} />
            <td>
              Business Hours<br />{displayDayHours(props.business.hours)}
            </td>
            <td>
              Delivery Hours<br />{displayDayHours(props.business.delivery_hours)}
            </td>
            <td>
              Accepting Hours<br />{displayDayHours(props.business.accepting_hours)}
            </td>
          </tr>
          <tr>
            <td>
              Contact Person<br />{`${props.business.contact_first_name} ${props.business.contact_last_name}`}
            </td>
            <td>
              Phone #1: {props.business.phone}
              <br />
              Phone #2: {props.business.phone2}
            </td>
            <td>
              Email<br />{props.business.email}
            </td>
            <td>
              Notification Approval<br />{props.business.notification_approval}
            </td>
            <td>
              Notification Device<br />{props.business.notification_device_id}
            </td>
          </tr>
          <FillerRow numColumns={5} showMore={showMore} setShowMore={setShowMore} />
          {showMore && (
            <React.Fragment>
              <tr>
                <td>
                  Business License #<br />{props.business.license}
                </td>
                <td>
                  Business License Expiration<br />
                </td>
                <td>
                  Business Password<br />
                  <div className="wrap-text">{props.business.password}</div>
                </td>
                <td></td>
                <td>
                  Available Zones<br />{props.business.available_zones}
                </td>
              </tr>
              <tr>
                <td>
                  EIN #<br />{props.business.EIN}
                </td>
                <td>
                  US DOT #<br />{props.business.USDOT}
                </td>
                <td>
                  WA UBI #<br />{props.business.WAUBI}
                </td>
                <td></td>
                <td>
                  Can Deliver:
                  <FontAwesomeIcon 
                    icon={props.business.delivery ? Icons.faCheck : Icons.faTimes}
                    color={props.business.delivery ? "green" : "red"} 
                    className="ml-2" 
                    style={{ position: "relative", top: "0.05rem" }} 
                  />
                  <br />
                  Can Cancel:
                  <FontAwesomeIcon 
                    icon={props.business.can_cancel ? Icons.faCheck : Icons.faTimes}
                    color={props.business.can_cancel ? "green" : "red"}
                    className="ml-2" 
                    style={{ position: "relative", top: "0.05rem" }} 
                  />
                  <br />
                  Is Reusable:
                  <FontAwesomeIcon 
                    icon={props.business.reusable ? Icons.faCheck : Icons.faTimes}
                    color={props.business.reusable ? "green" : "red"}
                    className="ml-2" 
                    style={{ position: "relative", top: "0.05rem" }} 
                  />
                </td>
              </tr>
            </React.Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BusinessList;
