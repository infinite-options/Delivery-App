import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import moment from 'moment';
import 'moment-timezone';
// import DayPicker from 'react-day-picker';
// import 'react-day-picker/lib/style.css';

const weekdays = moment.weekdays();

function DeliveryView(props) {
  console.log("rendering view..");

  const [columns, setColumns] = useState([]);

  const today = moment();
  const toweek = today.week() // TOday.. TOweek... haha funny
  const weekday = today.weekday();
  const [day, setDay] = useState(today);
  const [week, setWeek] = useState(toweek);
  const [index, setIndex] = useState();

  // is it better to use useEffect to declare column & index values vs declaring them outside?
  // does this increase or decrease the page's response times?
  useEffect(() => {
    const times = props.times && Object.keys(props.times).map((idx) => [props.times[idx].value]);
    setColumns(props.type === "day" ? times : weekdays);
  }, []);

  useEffect(() => {
    if (props.type === "day" && day.isSame(today, "d")) setIndex(props.timeSlot);
  }, [props.timeSlot]);

  useEffect(() => {
    if (props.type === "week" && week === toweek) setIndex(today.weekday());
  }, [weekday]);
  // console.log(day, week);

  // Temp table values
  let drivers = [];
  let distance = [];
  // max min
  let amtDeliveries = [];
  let timeDelivery = [];
  let timeDestination = [];
  let totalTimeDeliveries =[];
  for (let i = 0; i < columns.length; i++) drivers.push('N/A');
  for (let i = 0; i < columns.length; i++) distance.push('N/A');
  // max min
  for (let i = 0; i < columns.length; i++) amtDeliveries.push('N/A');
  for (let i = 0; i < columns.length; i++) timeDelivery.push('N/A');
  for (let i = 0; i < columns.length; i++) timeDestination.push('N/A');
  for (let i = 0; i < columns.length; i++) totalTimeDeliveries.push('N/A');

  const handleTodayClick = (type) => {
    if (day !== today) setDay(today);
    if (week !== toweek) setWeek(toweek);
    if (index === -1) setIndex(props.type === "day" ? props.timeSlot : today.weekday());
  };
  
  const handleCalendarShift = (type, direction=1) => {
    if (type === "day") {
      setDay(prevDay => {
        const date = prevDay.clone().add(direction, "d");
        const currentWeek = prevDay.week();
        const nextWeek = date.week();
        if (nextWeek !== currentWeek) setWeek(nextWeek);
        if (today.isSame(date, "d")) setIndex(props.timeSlot);
        else setIndex(-1);
        return date;
      });
    }
    else {
      setDay(prevDay => {
        const date = prevDay.clone().add(direction * 7, "d");
        setWeek(date.week());
        if (today.isSame(date, "d")) setIndex(today.weekday()); 
        else setIndex(-1)
        return date;
      });
    }
  };

  return (
    <div className={"modal" + (props.visible ? " is-active" : "")}>
      <div className="modal-background" onClick={props.onClick} />
      <div className="modal-card" style={{ width: "80vw" }}>
        <header className="modal-card-head">
          <div className="buttons has-addons" style={{minWidth: "220px"}}>
            <button className="button mr-4" onClick={() => handleTodayClick(props.type)}>Today</button>
            <button className="button" onClick={() => handleCalendarShift(props.type, -1)}>
              <FontAwesomeIcon icon={Icons.faChevronLeft} />
            </button>
            <button className="button" onClick={() => handleCalendarShift(props.type)}>
              <FontAwesomeIcon icon={Icons.faChevronRight} />
            </button>
            <button className="button is-small is-static ml-4" style={{width: "150px"}}>
              {props.type === "day" ? `${weekdays[day.weekday()]}: ${day.format("MM-DD-YYYY")}` : `Week ${week} - ${day.clone().weekday(6).format("YYYY")}`}
            </button>
          </div>
        </header>
        <section className="modal-card-body" style={{padding: "0"}}>
          <table className="table is-fullwidth is-bordered is-view" style={{minWidth: "880px"}}>
            <thead>
              <tr>
                <th>{props.type === "day" ? "Time Window" : "Day"}</th>
                {columns.map((value, idx) => (
                  <th className={"has-text-centered" + (index === idx ? " is-today" : "")} key={idx}>
                    <p style={{borderBottom: "1px solid lightgrey"}}>
                      {value + (props.type === "week" ? ` [${day.clone().add(idx - day.weekday(), "d").format("MM/DD")}]` : "")}                                     
                    </p>
                    <ValueRange min="Min" max="Max" isHeader={true} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th title="Current number of drivers"># Drivers</th>
                <RowItems items={drivers} index={index} />
              </tr>
              <tr>
                <th title="Total distance driven">Dist. Driven</th>
                <RowItems items={distance} index={index} />
              </tr>
              <tr>
                <th title="Number of deliveries made"># Deliveries</th>
                <RowItems items={amtDeliveries} index={index} hasRange={true} />
              </tr>
              <tr>
                <th title="Time spent to deliver each product">Time/Delivery</th>
                <RowItems items={timeDelivery} index={index} hasRange={true} />
              </tr>
              <tr>
                <th title="Time spent at each product destination">Time/Location</th>
                <RowItems items={timeDestination} index={index} hasRange={true} />
              </tr>
              <tr>
                <th title="Total time spent">Total Time</th>
                <RowItems items={totalTimeDeliveries} index={index} hasRange={true} isLast={true} />
              </tr>
            </tbody>
          </table>
        </section>
        <footer className="modal-card-foot" />
      </div>
    </div>
  );
}

function RowItems(props) {
  // console.log("rendering items..");
  return (
    <React.Fragment>
      {props.items.map((value, idx) => (
        <td key={idx} className={props.index === idx ? " is-today" + (props.isLast ? "-end" : "") : ""}>
          {props.hasRange ? (
            <ValueRange min={value} max={value} />
          ) : (
            <div className="has-text-centered">{value}</div>
          )}
        </td>
      ))}
    </React.Fragment>
  );
}

function ValueRange(props) {
  // console.log("rendering ranges..");
  return (
    <div className={"level has-text-light-weight" + (props.isHeader ? " has-text-weight-light" : "")}>
      <div
        className="level-left is-split">
        <div className="level-item">{props.min}</div>
      </div>
      <div className="level-right is-split">
        <div className="level-item">{props.max}</div>
      </div>
    </div>
  );
}

export default DeliveryView;
