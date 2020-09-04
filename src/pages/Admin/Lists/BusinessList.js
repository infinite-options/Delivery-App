import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import moment from "moment";
// import axios from "axios";

const weekdays = moment.weekdays();

function BusinessList({ businesses, ...props }) {
  console.log("rendering businesses..");
  const [businessData, setBusinessData] = useState(Object.entries(businesses));
  // console.log(businessData);

  useEffect(() => {
    const businessData = Object.entries(businesses);
    if (props.filter) {
      setBusinessData(() => {
        return businessData.filter(business => {
          // console.log(business[1][props.filter.option], props.filter.value);
          // eslint-disable-next-line
          return business[1][props.filter.option] == props.filter.value
        });
      });
    }
    else setBusinessData(businessData);
  }, [businesses, props.filter]);
  
  return (
    <React.Fragment>
      {businessData.map((business, index) => (
        <BusinessItem
          key={index}
          index={index}
          business={business[1]}
          id={business[0]}
          dispatch={props.dispatch}
        />
      ))}
    </React.Fragment>
  );
}

function BusinessItem({ business, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [businessDay, setBusinessDay] = useState(0);
  const [deliveryDay, setDeliveryDay] = useState(0);
  const [acceptingDay, setAcceptingDay] = useState(0);
  const address = `${business.street}${(business.unit ? ` ${business.unit}` : "")} 
                   ${business.city} ${business.state} ${business.zip}`;
  const business_id = Number(id.substring(id.indexOf("-") + 1, id.length));
  
  const displayDayHours = (type) => {
    const days = JSON.parse(type);
    // console.log(days);
    return (
      <React.Fragment>
        {weekdays.map((day, index) => (
          <p key={index}>{day}: {days[day]}</p>
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

  const handleVisibilitySelect = () => {
    console.log("hi");
    props.dispatch({ type: "business-toggle-visibility", payload: { id } });
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
              <div style={{ width: "300%", maxWidth: "325px" }}>
                {/* Displaying only the second section of a business id. Ex: 200-000011 => 11 */}
                <button 
                  className="button is-super-small is-rounded mr-3" 
                  onClick={handleVisibilitySelect}
                >
                  <FontAwesomeIcon icon={business.visible ? Icons.faEyeSlash : Icons.faEye} />
                </button>
                <span>Business {business_id}: {business.name}</span>
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
              Business Image<br /><img src={business.image} width="48" height="48" />
            </td>
            <td>
              Registered At<br />{handleDateTime(business.registered)}
            </td>
            <td>
              Type<br />{business.type}
            </td>
            <td>
              <div style={{ width: "215%" }}>
                Description<br />{business.description}
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
              Business Hours<br />{displayDayHours(business.hours)}
            </td>
            <td>
              Delivery Hours<br />{displayDayHours(business.delivery_hours)}
            </td>
            <td>
              Accepting Hours<br />{displayDayHours(business.accepting_hours)}
            </td>
          </tr>
          <tr>
            <td>
              Contact Person<br />{`${business.contact_first_name} ${business.contact_last_name}`}
            </td>
            <td>
              Phone #1: {business.phone}
              <br />
              Phone #2: {business.phone2}
            </td>
            <td>
              Email<br />{business.email}
            </td>
            <td>
              Notification Approval<br />{business.notification_approval}
            </td>
            <td>
              Notification Device<br />{business.notification_device_id}
            </td>
          </tr>
          <FillerRow numColumns={5} showMore={showMore} setShowMore={setShowMore} />
          {showMore && (
            <React.Fragment>
              <tr>
                <td>
                  Business License #<br />{business.license}
                </td>
                <td>
                  Business License Expiration<br />
                </td>
                <td>
                  Business Password<br />
                  <div className="wrap-text">{business.password}</div>
                </td>
                <td></td>
                <td>
                  Available Zones<br />{business.available_zones}
                </td>
              </tr>
              <tr>
                <td>
                  EIN #<br />{business.EIN}
                </td>
                <td>
                  US DOT #<br />{business.USDOT}
                </td>
                <td>
                  WA UBI #<br />{business.WAUBI}
                </td>
                <td></td>
                <td>
                  Can Deliver:
                  <FontAwesomeIcon 
                    icon={business.delivery ? Icons.faCheck : Icons.faTimes}
                    color={business.delivery ? "green" : "red"} 
                    className="ml-2" 
                    style={{ position: "relative", top: "0.05rem" }} 
                  />
                  <br />
                  Can Cancel:
                  <FontAwesomeIcon 
                    icon={business.can_cancel ? Icons.faCheck : Icons.faTimes}
                    color={business.can_cancel ? "green" : "red"}
                    className="ml-2" 
                    style={{ position: "relative", top: "0.05rem" }} 
                  />
                  <br />
                  Is Reusable:
                  <FontAwesomeIcon 
                    icon={business.reusable ? Icons.faCheck : Icons.faTimes}
                    color={business.reusable ? "green" : "red"}
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
