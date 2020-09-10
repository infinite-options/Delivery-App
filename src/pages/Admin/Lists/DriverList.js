import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import EditItemField from "utils/Components/EditItemField";
import Rating from '@material-ui/lab/Rating';
import axios from "axios";

function DriverList({ drivers, routes, ...props }) {
  console.log("rendering drivers..");
  const [driverData, setDriverData] = useState(Object.entries(drivers));
  const [dataEdit, setDataEdit] = useState(); // undefined, 'add', or `${driver_id}`

  // console.log(driverData);

  useEffect(() => {
    const driverData = Object.entries(drivers);
    if (props.filter) {
      setDriverData(() => {
        return driverData.filter(driver => {
          // console.log(driver[1][props.filter.option], props.filter.value);
          // eslint-disable-next-line
          return driver[1][props.filter.option] == props.filter.value
        });
      });
    }
    else setDriverData(driverData);
  }, [drivers, props.filter]);

  const editDriver = (action, id, data) => {
    // console.log("editing business.........");
    if (action === 'edit') setDataEdit(id);
    else if (action === 'add') setDataEdit('add');
    else {
      if (action === 'save') { 
        console.log("SAVED:", data);
        // driver's table currently does not have all the needed data, 
        // sending this temporary object for now
        const dataForNow = {
          // Add keyword items
        }; 
        // axios.post(ENDPOINT_URL, dataForNow)
        // .then(response => {
        //   const dataResponse = response.data.result.result;
        //   props.dispatch({ type: 'update-list', payload: { dataType: 'drivers', value: dataResponse } });
        // });
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
          onClick={() => editDriver('add')}
        >
          <FontAwesomeIcon icon={Icons.faPlus} className="mr-2" />
          Add Driver
        </button>
      )}
      {dataEdit === 'add' && (
        <DriverEdit driver={{}} id={dataEdit} handleEdit={editDriver} />
      )}
      {driverData.map((driver, index) => (
        <React.Fragment key={index}>
          {dataEdit !== driver[0] ? (
            <DriverItem
              key={index}
              index={index}
              driver={driver[1]}
              id={driver[0]}
              routes={routes}
              handleEdit={editDriver}
            />
          ) : (
            <DriverEdit 
              driver={driver[1]} 
              id={driver[0]} 
              handleEdit={editDriver} 
            />
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

function DriverItem({ driver, id, ...props }) {
  const [hidden, setHidden] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const address = `${driver.street}${(driver.unit ? ` ${driver.unit}` : "")} 
                   ${driver.city} ${driver.state} ${driver.zip}`;
  const driver_id = Number(id.substring(id.indexOf("-") + 1, id.length));

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
                <span>Driver {driver_id}: {`${driver.first_name} ${driver.last_name[0]}.`}</span>
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
                      <span>
                        Bank Account #
                        <br />
                        {driver.bank_account_info}
                      </span>
                    </div>
                    <div className="level-item">
                      <span>
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

function DriverEdit({ driver, id, ...props }) {
  const [driverData, setDriverData] = useState(driver);
  const exists = Boolean(Object.values(driver).length);
  const driver_id = Number(id.substring(id.indexOf("-") + 1, id.length));

  const handleChange = (e, type) => {
    e.persist();
    setDriverData(prevDriverData => ({
      ...prevDriverData,
      [type]: e.target.value,
    }));
    // console.log(driverData);
  };

  return (
    <React.Fragment>
      {!Object.values(driver).length && (
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
            onClick={() => props.handleEdit('save', undefined, driverData)}
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
              <th style={{ width: "40%" }}>
                <div style={{ width: "240px" }}>
                  <span>
                    {exists ? 
                      `Driver ${driver_id}: ${`${driver.first_name} ${driver.last_name[0]}.`}` : 
                      'New Driver: '
                    }
                  </span>
                </div>
              </th>
              <th style={{ width: "20%" }} />
              <th style={{ width: "20%" }} />
              <th style={{ width: "20%" }}>
                {exists && (
                  <React.Fragment>
                    <button
                      className="button is-super-small is-pulled-right"
                      onClick={() => props.handleEdit('save', id, driverData)}
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
                <div className="level">
                  <div className="level-item">
                    <span style={{ width: "100%", textAlign: "left" }}>
                      First &amp; Middle Name:
                      <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                      Last Name:
                    </span>
                  </div>
                  <div className="level-item">
                    <div style={{ width: "100%", textAlign: "left" }}>
                      <EditItemField 
                        type={'first_name'} value={driverData.first_name} 
                        handleChange={handleChange} 
                      />
                      <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                      <EditItemField 
                        type={'last_name'} value={driverData.last_name} 
                        handleChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>
              </td>
              <td>
                # of hours/week<br />
                <EditItemField 
                  type={'weekly_workload'} value={driverData.weekly_workload} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                <div style={{ width: "215%" }}>
                  <div className="level" style={{ marginBottom: 0 }}>
                    <div className="level-item">
                      Driver's License #
                    </div>
                    <div className="level-item">
                      License Expiration
                    </div>
                    <div className="level-item">
                      Vehicle Types
                    </div>
                  </div>
                  <div className="level">
                    <div className="level-item" style={{ maxWidth: "35%" }}>
                    <EditItemField 
                      className="mr-1" 
                      type={'drivers_license'} value={driverData.drivers_license} 
                      handleChange={handleChange} 
                    />
                    </div>
                    <div className="level-item" style={{ maxWidth: "36%" }}>
                    <EditItemField 
                      className="mr-1" 
                      type={'drivers_license_exp'} value={driverData.drivers_license_exp} 
                      handleChange={handleChange} 
                    />
                    </div>
                    <div className="level-item" style={{ maxWidth: "29%" }}>
                    <EditItemField 
                      type={'vehicle_types'} value={driverData.vehicle_types} 
                      handleChange={handleChange} 
                    />
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ borderLeft: "hidden" }} />
            </tr>
            <tr>
              <td>
                <div className="level">
                  <div className="level-item" style={{ flexShrink: 1 }}>
                    <span className="mr-1" style={{ width: "100%" }}>
                      Emergency Contact:
                      <br />
                      <EditItemField 
                        style={{ marginTop: "0.35rem" }} 
                        type={'emergency_contact_phone'} value={driverData.emergency_contact_phone} 
                        placeholder={'Phone'} 
                        handleChange={handleChange} 
                      />
                    </span>
                  </div>
                  <div className="level-item" style={{ flexShrink: 1 }}>
                    <span style={{ width: "100%", textAlign: "left" }}>
                      <EditItemField 
                        className="mb-1" 
                        type={'emergency_contact_name'} value={driverData.emergency_contact_name} 
                        placeholder={'Name'} 
                        handleChange={handleChange} 
                      />
                      <br />
                      <EditItemField 
                        type={'emergency_contact_relationship'} value={driverData.emergency_contact_relationship} 
                        placeholder={'Relationship'} 
                        handleChange={handleChange} 
                      />
                    </span>
                  </div>
                </div>
              </td>
              <td>
                Preferred Routes<br />
                <EditItemField 
                  type={'preferred_routes'} value={driverData.preferred_routes} 
                  handleChange={handleChange} 
                />
                {/* {driver.preferred_routes.map((route, index) => (
                  <p>Route {route.id}: <span>ROUTE COLOR</span></p>
                ))} */}
              </td>
              <td>
                Days Available<br />
                <EditItemField 
                  type={'days'} value={driverData.days} 
                  handleChange={handleChange} 
                />
              </td>
              <td>
                Times Available<br />
                <EditItemField 
                  type={'hours'} value={driverData.hours} 
                  handleChange={handleChange} 
                />
              </td>
            </tr>
            <FillerRow numColumns={4} />
            {/* {showMore && (  */}
              <React.Fragment>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    Address:<br />
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      <EditItemField 
                        className="mr-1 mb-1" style={{ width: "65%" }} 
                        type={'street'} value={driverData.street} 
                        placeholder='Street'
                        handleChange={handleChange} 
                      />
                      <EditItemField 
                        className="mr-1 mb-1" style={{ width: "30%" }} 
                        type={'unit'} value={driverData.unit} 
                        placeholder='Unit (optional)'
                        handleChange={handleChange} 
                      />
                      <EditItemField 
                        className="mr-1 mb-1" style={{ width: "44%" }} 
                        type={'city'} value={driverData.city} 
                        placeholder='City'
                        handleChange={handleChange} 
                      />
                      <EditItemField 
                        className="mr-1 mb-1" style={{ width: "20%" }} 
                        type={'state'} value={driverData.state}
                        placeholder='State' 
                        handleChange={handleChange} 
                      />
                      <EditItemField 
                        style={{ width: "30%" }} 
                        type={'zip'} value={driverData.zip} 
                        placeholder='ZIP Code'
                        handleChange={handleChange} 
                      />
                    </div>
                  </td>
                  <td>
                    Insurance Carrier<br />
                    <EditItemField 
                      type={'insurance_carrier'} value={driverData.insurance_carrier} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Insurance Number<br />
                    <EditItemField 
                      type={'insurance_number'} value={driverData.insurance_number} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Insurance Expiration<br />
                    <EditItemField 
                      type={'insurance_expiration'} value={driverData.insurance_expiration} 
                      handleChange={handleChange} 
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="level">
                      <div className="level-item" style={{ flexShrink: 1 }}>
                        <span className="mr-1">
                          Phone #1<br />
                          <EditItemField 
                            type={'phone'} value={driverData.phone} 
                            handleChange={handleChange} 
                          />
                        </span>
                      </div>
                      <div className="level-item" style={{ flexShrink: 1 }}>
                        <span>
                          Phone #2<br />
                          <EditItemField 
                            type={'phone2'} value={driverData.phone2} 
                            handleChange={handleChange} 
                          />
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    Email<br />
                    <EditItemField 
                      type={'email'} value={driverData.email} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Account Password<br />
                    <EditItemField 
                      type={'password'} value={driverData.password} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Business ID<br />
                    <EditItemField 
                      type={'business_id'} value={driverData.business_id} 
                      handleChange={handleChange} 
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="level">
                      <div className="level-item" style={{ flexShrink: 1 }}>
                        <span className="mr-1">
                          Bank Account #
                          <br />
                          <EditItemField 
                            type={'bank_account_info'} value={driverData.bank_account_info} 
                            handleChange={handleChange} 
                          />
                        </span>
                      </div>
                      <div className="level-item" style={{ flexShrink: 1 }}>
                        <span>
                          Bank Routing #
                          <br />
                          <EditItemField 
                            type={'bank_routing_info'} value={driverData.bank_routing_info} 
                            handleChange={handleChange} 
                          />
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    SSN<br />
                    <EditItemField 
                      type={'ssn'} value={driverData.ssn} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Hourly Rate<br />
                    <EditItemField 
                      type={'hourly_rate'} value={driverData.hourly_rate} 
                      handleChange={handleChange} 
                    />
                  </td>
                  <td>
                    Delivery Fee<br />
                    <EditItemField 
                      type={'delivery_fee'} value={driverData.delivery_fee} 
                      handleChange={handleChange} 
                    />
                  </td>
                </tr>
              </React.Fragment>
            {/* )} */}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default DriverList;
