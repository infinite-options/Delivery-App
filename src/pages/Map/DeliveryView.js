import React, { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import moment from 'moment';
import 'moment-timezone';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

function DeliveryView(props) {
  const times = Object.keys(props.times).map((idx) => [props.times[idx].value]);
  const weekdays = moment.weekdays();
  const columns = props.type === "day" ? times : weekdays;

  const today = moment();
  const toweek = today.week() // TOday.. TOweek... haha funny
  const [day, setDay] = useState(today);
  const [week, setWeek] = useState(toweek);
  // console.log(day, week);

  // Temp table values
  let drivers = [];
  let distance = [];
  // max min
  let amtDeliveries = [];
  let timeDelivery = [];
  let timeDestination = [];
  let totalTimeDeliveries =[];
  for (let idx in columns) drivers.push(Math.floor(Math.random() * (10 - 1) + 1));
  for (let idx in columns) distance.push(Math.floor(Math.random() * (50 - 5) + 5));
  // max min
  for (let idx in columns) amtDeliveries.push(Math.floor(Math.random() * (15 - 2) + 15));
  for (let idx in columns) timeDelivery.push(Math.floor(Math.random() * (90 - 15) + 15));
  for (let idx in columns) timeDestination.push(Math.floor(Math.random() * (15 - 2) + 2));
  for (let idx in columns) totalTimeDeliveries.push(Math.floor(Math.random() * (300 - 50) + 50));

  const handleTodayClick = (type) => {
    if (day !== today) setDay(today);
    if (week != toweek) setWeek(toweek);
  };
  
  const handleCalendarShift = (type, direction=1) => {
    if (type === "day") {
      setDay(prevDay => {
        const currentWeek = prevDay.week();
        const nextDay = prevDay.clone().add(direction, "d");
        const nextWeek = nextDay.week();
        if (nextWeek !== currentWeek) setWeek(nextWeek);
        return nextDay;
      });
    }
    else {
      setWeek(prevWeek => {
        const date = day.clone().add(direction * 7, "d");
        // console.log(date);
        return date.week();
      });
      setDay(prevDay => prevDay.clone().add(direction * 7, "d"));
    }
  };

  return (
    <div className={"modal" + (props.visible ? " is-active" : "")}>
      <div className="modal-background" onClick={props.onClick} />
      <div className="modal-card" style={{ width: "80vw" }}>
        <header className="modal-card-head">
          <div className="buttons has-addons">
            <button className="button mr-4" onClick={() => handleTodayClick(props.type)}>Today</button>
            <button className="button" onClick={() => handleCalendarShift(props.type, -1)}>
              <FontAwesomeIcon icon={Icons.faChevronLeft} />
            </button>
            <button className="button" onClick={() => handleCalendarShift(props.type)}>
              <FontAwesomeIcon icon={Icons.faChevronRight} />
            </button>
            <button className="button is-small is-static ml-4" style={{width: "150px"}}>{props.type === "day" ? `${weekdays[day.weekday()]}: ${day.format("MM-DD-YYYY")}` : `Week ${week} - ${day.clone().weekday(6).format("YYYY")}`}</button>
          </div>
        </header>
        <section className="modal-card-body">
          <table className="table is-fullwidth is-bordered">
            <thead>
              <tr>
                <th>{props.type === "day" ? "Time Window" : "Day"}</th>
                {columns.map((value, idx) => (
                  <th className="has-text-centered" key={idx}>
                    <p
                      style={{
                        width: "100%",
                        display: "inline-block",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      {value + (props.type === "week" ? ` [${day.clone().add(idx - day.weekday(), "d").format("MM/DD")}]` : "")}
                                                           
                    </p>
                    <div className="level has-text-weight-light">
                      <div
                        className="level-left"
                        style={{
                          width: "50%",
                          display: "inline-block",
                          borderRight: "1px solid lightgrey",
                        }}
                      >
                        <div className="level-item" style={{ width: "100%" }}>
                          Min
                        </div>
                      </div>
                      <div
                        className="level-right"
                        style={{
                          width: "50%",
                          display: "inline-block",
                          margin: "auto",
                        }}
                      >
                        <div className="level-item" style={{ width: "100%" }}>
                          Max
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th># Drivers</th>
                {drivers.map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
              <tr>
                <th>Distance Driven</th>
                {distance.map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
              <tr>
                <th># Deliveries</th>
                {amtDeliveries.map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
              <tr>
                <th>Time Taken / Delivery</th>
                {timeDelivery.map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
              <tr>
                <th>Time Taken @ Location</th>
                {timeDestination.map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
              <tr>
                <th>Total Deliveries Time</th>
                {totalTimeDeliveries.map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default DeliveryView;
