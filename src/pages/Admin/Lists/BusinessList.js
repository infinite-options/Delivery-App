import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import EditItemField from "utils/Components/EditItemField";
import DayHoursDropdown from "utils/Components/DayHoursDropdown";
import moment from "moment";
import axios from "axios";

const weekdays = moment.weekdays();

const BASE_URL = "https://uqu7qejuee.execute-api.us-west-1.amazonaws.com/dev/api/v2/"

function BusinessList({ businesses, ...props }) {
  console.log("rendering businesses..");
  const [businessData, setBusinessData] = useState(Object.entries(businesses));
  const [dataEdit, setDataEdit] = useState(); // undefined, 'add', or `${business_id}`
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
  
  const editBusiness = (action, id, data) => {
    console.log("adding business.........");
    if (action === 'edit') setDataEdit(id);
    else if (action === 'add') setDataEdit('add');
    else {
      if (action === 'save') { 
        console.log("SAVED:", data);
        // driver's table currently does not have all the needed data, 
        // sending this temporary object for now
        const dataForNow = {
          // Add keyword items
          business_created_at: data.registered,
          business_name: data.name,
          business_type: data.type,
          business_desc: data.description,
          business_contact_first_name: data.contact_first_name,
          business_contact_last_name: data.contact_last_name,
          business_phone_num: data.phone,
          business_phone_num2: data.phone2,
          business_email: data.email,
          business_hours: "{\"Friday\": [\"09:00:00\", \"23:59:59\"], \"Monday\": [\"09:00:00\", \"23:59:59\"], \"Sunday\": [\"09:00:00\", \"23:59:59\"], \"Tuesday\": [\"09:00:00\", \"23:59:59\"], \"Saturday\": [\"09:00:00\", \"21:00:00\"], \"Thursday\": [\"09:00:00\", \"23:59:59\"], \"Wednesday\": [\"09:00:00\", \"23:00:00\"]}",
          business_accepting_hours: "{\"Friday\": [\"09:00:00\", \"23:59:59\"], \"Monday\": [\"09:00:00\", \"23:59:59\"], \"Sunday\": [\"09:00:00\", \"23:59:59\"], \"Tuesday\": [\"09:00:00\", \"23:59:59\"], \"Saturday\": [\"09:00:00\", \"21:00:00\"], \"Thursday\": [\"09:00:00\", \"23:59:59\"], \"Wednesday\": [\"09:00:00\", \"23:00:00\"]}",
          business_delivery_hours: "{\"Friday\": [\"09:00:00\", \"23:59:59\"], \"Monday\": [\"09:00:00\", \"23:59:59\"], \"Sunday\": [\"09:00:00\", \"23:59:59\"], \"Tuesday\": [\"09:00:00\", \"23:59:59\"], \"Saturday\": [\"09:00:00\", \"21:00:00\"], \"Thursday\": [\"09:00:00\", \"23:59:59\"], \"Wednesday\": [\"09:00:00\", \"23:00:00\"]}",
          business_address: data.street,
          business_unit: data.unit,
          business_city: data.city,
          business_state: data.state,
          business_zip: data.zip,
          business_latitude: data.latitude || '',
          business_longitude: data.longitude || '',
          business_EIN: data.EIN,
          business_WAUBI: data.WAUBI,
          business_license: data.license,
          business_USDOT: data.USDOT,
          notification_approval: data.notification_approval,
          notification_device_id: data.notification_device_id,
          can_cancel: `${data.can_cancel}` || "0",
          delivery: `${data.delivery}` || "0",
          reusable: `${data.reusable}` || "0",
          business_image: "https://servingnow.s3-us-west-1.amazonaws.com/kitchen_imgs/landing-logo.png",
          business_password: data.password,
        }; 
        console.log(dataForNow);
        if (id) {

        }
        else {
          axios.post(BASE_URL + "insertNewBusiness", dataForNow)
          .then(response => {
            console.log(response);
            // const dataResponse = response.data.result.result;
            // props.dispatch({ type: 'update-list', payload: { dataType: 'businesses', value: dataResponse } });
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
      setDataEdit();
    }
  };

  return (
    <React.Fragment>
      {dataEdit !== 'add' && (
        <button
          className="button is-small mx-1 is-success is-outlined is-rounded" 
          style={{ marginBottom: "1rem" }}
          onClick={() => editBusiness('add')}
        >
          <FontAwesomeIcon icon={Icons.faPlus} className="mr-2" />
          Add Business
        </button>
      )}
      {dataEdit === 'add' && (
        <BusinessEdit business={{}} id={dataEdit} handleEdit={editBusiness} />
      )}
      {businessData.map((business, index) => (
        <React.Fragment key={index}>
          {dataEdit !== business[0] ? (
            <BusinessItem
              index={index}
              business={business[1]}
              id={business[0]}
              dispatch={props.dispatch}
              handleEdit={editBusiness}
            />
          ) : (
            <BusinessEdit 
              business={business[1]} 
              id={business[0]} 
              handleEdit={editBusiness} 
            />
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

const handleDateTime = (input) => {
  if (input) {
    const split = input.split(/-|T/);
    const date_time = `${split[0]} ${moment.monthsShort(Number(split[1]))} ${split[2]}, ${split[3]}`;
    // for (let section of split) date_time += `${section} `;
    return date_time;
  }
};

function BusinessItem({ business, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [businessDay, setBusinessDay] = useState(0);
  const [deliveryDay, setDeliveryDay] = useState(0);
  const [acceptingDay, setAcceptingDay] = useState(0);
  const address = `${business.street}${(business.unit ? ` ${business.unit}` : "")} 
                   ${business.city} ${business.state} ${business.zip}`;
  const business_id = Number(id.substring(id.indexOf("-") + 1, id.length));

  const sendBusinessText = (businessNumber) => {
    console.log(`Sending Business ${businessNumber} a text..`);
  };

  const handleVisibilitySelect = () => {
    props.dispatch({ type: "toggle-visibility", payload: { id, type: "businesses" } });
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
              {!hidden && (
                <button
                  className="button is-super-small is-pulled-right mr-1"
                  onClick={() => props.handleEdit('edit', id)}
                >
                  <FontAwesomeIcon
                    icon={Icons.faPlus}
                  />
                  {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody className="is-bordered has-text-centered" hidden={hidden}>
          <tr>
            <td>
              Business Image<br /><img src={business.image} alt={`${business.name}`} width="48" height="48" />
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
              Business Hours<br />
              <DayHoursDropdown type={business.hours} />
            </td>
            <td>
              Delivery Hours<br />
              <DayHoursDropdown type={business.delivery_hours} />
            </td>
            <td>
              Accepting Hours<br />
              <DayHoursDropdown type={business.accepting_hours} />
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

function BusinessEdit({ business, id, ...props }) {
  const [businessData, setBusinessData] = useState(business);
  const exists = Boolean(Object.values(business).length);

  const handleChange = (e, type) => {
    e.persist();
    console.log(e.target, e.target.checked, e.target.value);
    
    setBusinessData(prevBusinessData => ({
      ...prevBusinessData,
      [type]: e.target.type !== "checkbox" ? e.target.value : Number(e.target.checked),
    }));
  };

  return (
    <React.Fragment>
      {!exists && (
        <React.Fragment>
          <button
            className="button is-small mx-1 is-danger is-outlined is-rounded" 
            style={{ marginBottom: "1rem" }}
            onClick={() => props.handleEdit('cancel')}
          >
            <FontAwesomeIcon icon={Icons.faTimes} className="mr-2" />
            Cancel
          </button>
          <button
            className="button is-small mx-1 is-success is-outlined is-rounded" 
            onClick={() => props.handleEdit('save', undefined, businessData)}
          >
            <FontAwesomeIcon icon={Icons.faCheck} className="mr-2" />
            Save
          </button>
        </React.Fragment>
      )}
      <div className="box list-item">
        <table
          className="table is-hoverable is-fullwidth is-size-7"
          style={{ backgroundColor: "#f8f7fa" }}
        >
          <thead>
            <tr className="list-item-head">
              <th style={{ width: "20%" }}>
                <div style={{ width: "300%", maxWidth: "325px" }}>
                  <span>
                    {exists ? 
                      `Business ${Number(id.substring(id.indexOf("-") + 1, id.length))}: ` : 
                      'New Business: '
                    }
                  </span>
                  <EditItemField 
                    type={'name'} value={businessData.name}
                    className="ml-1" style={{ width: "50%" }}
                    handleChange={handleChange}
                  />
                </div>
              </th>
              <th style={{ width: "20%" }} />
              <th style={{ width: "20%" }} />
              <th style={{ width: "20%" }} />
              <th style={{ width: "20%" }}>
                {exists && (
                  <React.Fragment>
                    <button
                      className="button is-super-small is-pulled-right"
                      onClick={() => props.handleEdit('save', id, businessData)}
                    >
                      <FontAwesomeIcon
                        icon={Icons.faCheck}
                      />
                    </button>
                    <button
                      className="button is-super-small is-pulled-right mr-1"
                      onClick={() => props.handleEdit('cancel')}
                    >
                      <FontAwesomeIcon
                        icon={Icons.faTimes}
                      />
                    </button>
                  </React.Fragment>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="is-bordered has-text-centered">
            <tr>
              <td>
                Business Image<br />
                <EditItemField 
                  type={'image'} value={businessData.image} 
                  placeholder='Image URL'
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Registered At<br />
                <EditItemField 
                  type={'registered'} value={businessData.registered} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Type<br />
                <EditItemField 
                  type={'type'} value={businessData.type} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                <div style={{ width: "215%" }}>
                  Description<br />
                  <EditItemField 
                    type={'description'} value={businessData.description} 
                    handleChange={handleChange} 
                    textarea
                  />
                </div>
              </td>
              <td style={{ borderLeft: "hidden" }} />
            </tr>
            <tr>
              <td>
                <div style={{ width: "215%" }}>
                  Address<br />
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <EditItemField 
                      type={'street'} value={businessData.street}
                      className="mr-1 mb-1" style={{ width: "65%" }} 
                      placeholder='Street'
                      handleChange={handleChange} 
                    />
                    <EditItemField 
                      type={'unit'} value={businessData.unit} 
                      className="mr-1 mb-1" style={{ width: "30%" }} 
                      placeholder='Unit (optional)'
                      handleChange={handleChange} 
                    />
                    <EditItemField 
                      type={'city'} value={businessData.city} 
                      className="mr-1 mb-1" style={{ width: "43.5%" }} 
                      placeholder='City'
                      handleChange={handleChange} 
                    />
                    <EditItemField 
                      type={'state'} value={businessData.state} 
                      className="mr-1 mb-1" style={{ width: "20%" }} 
                      placeholder='State'
                      handleChange={handleChange} 
                    />
                    <EditItemField 
                      type={'zip'} value={businessData.zip} 
                      style={{ width: "30.25%" }} 
                      placeholder='ZIP Code'
                      handleChange={handleChange} 
                    />
                  </div>
                </div>
              </td>
              <td style={{ borderLeft: "hidden" }} />
              <td>
                Business Hours<br />
                <EditItemField 
                  type={'hours'} value={businessData.hours} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Delivery Hours<br />
                <EditItemField 
                  type={'delivery_hours'} value={businessData.delivery_hours} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Accepting Hours<br />
                <EditItemField 
                  type={'accepting_hours'} value={businessData.accepting_hours} 
                  handleChange={handleChange} 
                />
              </td>
            </tr>
            <tr>
              <td>
                Contact Person<br />
                <div className="level">
                  <EditItemField 
                    type={'contact_first_name'} value={businessData.contact_first_name} 
                    className="level-item mr-1" style={{ maxWidth: "65%" }}
                    placeholder='First &amp; Middle'
                    handleChange={handleChange} 
                  />
                  <EditItemField 
                    type={'contact_last_name'} value={businessData.contact_last_name} 
                    className="level-item" style={{ maxWidth: "30%" }}
                    placeholder='Last'
                    handleChange={handleChange} 
                  />
                </div>
              </td>
              <td>
                Phone #1:
                <EditItemField 
                  type={'phone'} value={businessData.phone} 
                  className="ml-1 mb-1" style={{ maxWidth: "60%" }}
                  handleChange={handleChange} 
                />
                <br />
                Phone #2: 
                <EditItemField 
                  type={'phone2'} value={businessData.phone2} 
                  className="ml-1" style={{ maxWidth: "60%" }}
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Email<br />
                <EditItemField 
                  type={'email'} value={businessData.email} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Notification Approval<br />
                <EditItemField 
                  type={'notification_approval'} value={businessData.notification_approval} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Notification Device<br />
                <EditItemField 
                  type={'notification_device_id'} value={businessData.notification_device_id} 
                  handleChange={handleChange} 
                />
              </td>
            </tr>
            <FillerRow numColumns={5} />
            {/* {showMore && (
              <React.Fragment> */}
                <tr>
                  <td>
                    Business License #<br />{business.license}
                    <EditItemField 
                      type={'license'} value={businessData.license} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Business License Expiration<br />
                  </td>
                  <td>
                    Business Password<br />
                    <EditItemField 
                      type={'password'} value={businessData.password} 
                      handleChange={handleChange} 
                      textarea
                    />
                  </td>
                  <td></td>
                  <td>
                    Available Zones<br />
                    <EditItemField 
                      type={'available_zones'} value={businessData.available_zones} 
                      handleChange={handleChange} 
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    EIN #<br />
                    <EditItemField 
                      type={'EIN'} value={businessData.EIN} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    US DOT #<br />
                    <EditItemField 
                      type={'USDOT'} value={businessData.USDOT} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    WA UBI #<br />
                    <EditItemField 
                      type={'WAUBI'} value={businessData.WAUBI} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td></td>
                  <td>
                    Can Deliver:
                    <EditItemField 
                      type={'delivery'} value={Boolean(businessData.delivery)} 
                      className="ml-1"
                      handleChange={handleChange} 
                      checkbox
                    />
                    <br />
                    Can Cancel:
                    <EditItemField 
                      type={'can_cancel'} value={Boolean(businessData.can_cancel)} 
                      className="ml-1"
                      handleChange={handleChange} 
                      checkbox
                    />
                    <br />
                    Is Reusable:
                    <EditItemField 
                      type={'reusable'} value={Boolean(businessData.reusable)} 
                      className="ml-1"
                      handleChange={handleChange} 
                      checkbox
                    />
                  </td>
                </tr>
              {/* </React.Fragment>
            )} */}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default BusinessList;
