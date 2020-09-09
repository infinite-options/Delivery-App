import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import FillerRow from "utils/Components/FillerRow";
import Rating from '@material-ui/lab/Rating';
// import axios from "axios";

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
    console.log("adding business.........");
    if (action === 'edit') setDataEdit(id);
    else if (action === 'add') setDataEdit('add');
    else {
      if (action === 'save') { console.log("SAVED:", data); }
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
        <React.Fragment>
          <button
            className="button is-small mx-1 is-danger is-outlined is-rounded" 
            style={{ marginBottom: "1rem" }}
            onClick={() => editDriver('cancel')}
          >
            <FontAwesomeIcon icon={Icons.faTimes} className="mr-2" />
            Cancel
          </button>
          <button
            className="button is-small mx-1 is-success is-outlined is-rounded" 
            onClick={() => editDriver('save', undefined, {})}
          >
            <FontAwesomeIcon icon={Icons.faCheck} className="mr-2" />
            Save
          </button>
          <EditItem driver={{}} id={dataEdit} handleEdit={setDataEdit} />
        </React.Fragment>
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
            <EditItem 
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

function EditItem({ driver, id, ...props }) {
  const [driverData, setDriverData] = useState(driver);
  const exists = Boolean(Object.values(driver).length);
  const address = driver.street ? `${driver.street}${(driver.unit ? ` ${driver.unit}` : "")} 
                   ${driver.city} ${driver.state} ${driver.zip}` : undefined;
  const driver_id = Number(id.substring(id.indexOf("-") + 1, id.length));

  const handleChange = (e, type) => {
    e.persist();
    setDriverData(prevDriverData => ({
      ...prevDriverData,
      [type]: e.target.value,
    }));
  };

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
                <span>
                  {exists ? 
                    `Driver ${driver_id}: ${`${driver.first_name} ${driver.last_name[0]}.`}` : 
                    'New Driver: '
                  }
                </span>
                {/* <input 
                  className="input is-super-small ml-1" 
                  style={{ width: "auto" }} 
                  value={driverData.name} 
                  onChange={(e) => handleChange(e, 'name')}
                /> */}
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
                    <input 
                      className="input is-super-small" 
                      // style={{ width: "auto" }} 
                      value={driverData.first_name || ''} 
                      onChange={(e) => handleChange(e, 'first_name')}
                    />
                    <hr style={{ margin: 0, backgroundColor: "#ededed" }} />
                    <input 
                      className="input is-super-small" 
                      // style={{ width: "auto" }} 
                      value={driverData.last_name || ''} 
                      onChange={(e) => handleChange(e, 'last_name')}
                    />
                  </div>
                </div>
              </div>
            </td>
            {/* <td className="pl-0 has-text-left" style={{ borderLeftWidth: 0 }}>
              <p className="ml-3">{driver.first_name}</p>
              <hr style={{margin: 0, backgroundColor: "#ededed"}}/>
              <p className="ml-3">{driver.last_name}</p>
            </td> */}
            <td>
              # of hours/week<br />
              <input 
                className="input is-super-small" 
                // style={{ width: "auto" }} 
                value={driverData.weekly_workload || ''} 
                onChange={(e) => handleChange(e, 'weekly_workload')}
              />
            </td>
            <td>
              <div style={{ width: "215%" }}>
                <div className="level" style={{ marginBottom: 0 }}>
                  <div className="level-item">
                    <span>
                      Driver's License #<br/>
                      
                    </span>
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
                    <input 
                      className="input is-super-small" 
                      // style={{ width: 0 }} 
                      value={driverData.drivers_license || ''} 
                      onChange={(e) => handleChange(e, 'drivers_license')}
                    />
                  </div>
                  <div className="level-item" style={{ maxWidth: "36%" }}>
                    <input 
                      className="input is-super-small ml-1" 
                      // style={{ width: 0 }} 
                      value={driverData.drivers_license_exp || ''} 
                      onChange={(e) => handleChange(e, 'drivers_license_exp')}
                    />
                  </div>
                  <div className="level-item" style={{ maxWidth: "29%" }}>
                    <input 
                      className="input is-super-small ml-1" 
                      // style={{ width: 0 }} 
                      value={driverData.vehicle_types || ''} 
                      onChange={(e) => handleChange(e, 'vehicle_types')}
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
                    <input 
                      className="input is-super-small"
                      style={{ marginTop: "0.35rem" }} 
                      // style={{ width: 0 }} 
                      value={driverData.emergency_contact_phone || ''} 
                      onChange={(e) => handleChange(e, 'emergency_contact_phone')}
                    />
                  </span>
                </div>
                <div className="level-item" style={{ flexShrink: 1 }}>
                  <span style={{ width: "100%", textAlign: "left" }}>
                    <input 
                      className="input is-super-small mb-1" 
                      // style={{ width: 0 }} 
                      value={driverData.emergency_contact_name || ''} 
                      onChange={(e) => handleChange(e, 'emergency_contact_name')}
                    />
                    <br />
                    <input 
                      className="input is-super-small" 
                      // style={{ width: 0 }} 
                      value={driverData.emergency_contact_relationship || ''} 
                      onChange={(e) => handleChange(e, 'emergency_contact_relationship')}
                    />
                  </span>
                </div>
              </div>
            </td>
            <td>
              Preferred Routes<br />
              <input 
                className="input is-super-small" 
                // style={{ width: 0 }} 
                value={driverData.preferred_routes || ''} 
                onChange={(e) => handleChange(e, 'preferred_routes')}
              />
              {/* {driver.preferred_routes.map((route, index) => (
                <p>Route {route.id}: <span>ROUTE COLOR</span></p>
              ))} */}
            </td>
            <td>
              Days Available<br />
              <input 
                className="input is-super-small" 
                // style={{ width: 0 }} 
                value={driverData.days || ''} 
                onChange={(e) => handleChange(e, 'days')}
              />
            </td>
            <td>
              Times Available<br />
              <input 
                className="input is-super-small" 
                // style={{ width: 0 }} 
                value={driverData.hours || ''} 
                onChange={(e) => handleChange(e, 'hours')}
              />
            </td>
          </tr>
          <FillerRow numColumns={4} />
          {/* {showMore && (  */}
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
          {/* )} */}
        </tbody>
      </table>
    </div>
  );
}

export default DriverList;
