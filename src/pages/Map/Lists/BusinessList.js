import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import axios from "axios";

function BusinessList({ businesses, props }) {
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
  const address = `${props.business.street}${(props.business.unit ? ` ${props.business.unit}` : "")} ${props.business.city} ${props.business.state} ${props.business.zip}`;

  return (
    <div className="box list-item">
      <table
        className="table is-hoverable is-fullwidth is-size-7"
        style={{ backgroundColor: "#f8f7fa" }}
      >
        <thead>
          <tr className="list-item-head">
            <th>
              {/* <button className="tooltip mx-1" onClick={() => setHidden(prevHidden => !prevHidden)}> */}
              <button
                className="mx-1"
                onClick={() => setHidden((prevHidden) => !prevHidden)}
              >
                <FontAwesomeIcon
                  icon={hidden ? Icons.faCaretDown : Icons.faCaretUp}
                />
                {/* <span className="tooltiptext">{hidden ? "Expand" : "Collapse"}</span> */}
              </button>
              Business {props.id}: {props.business.name}
            </th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody className="has-text-centered" hidden={hidden}>
          <tr>
            <td className="pr-0">
                Name<br />{props.business.name}
            </td>
            <td>
                Type<br />{props.business.type}
            </td>
            <td>
                Hours of Operation<br />{props.business.hours}
            </td>
          </tr>
          <tr>
            <td>
                Address<br />{address}
            </td>
            <td>
                {props.business.latitude}
                <br />
                {props.business.longitude}
            </td>
            <td>
                Business Description <br />{props.business.description}
            </td>
          </tr>
          <tr>
            <td>
                Phone #1: {props.business.phone1}
                <br />
                Phone #2: {props.business.phone2}
            </td>
            <td>
                Contact Person<br />PLACEHOLDER
            </td>
            <td>
                Email<br />
                {props.business.email}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BusinessList;
