import React, { useState, useReducer, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "utils/Icons/Icons";
import moment from 'moment';
import 'moment-timezone';

const weekdays = moment.weekdays();

function reducer(state, action) {
  switch(action.type) {
    case 'today':
      return {
        ...state,
        ...(state.day !== action.payload.today) && { day: action.payload.today },
        ...(state.week !== action.payload.toweek) && { week: action.payload.toweek },
        ...(state.index === -1) && { index: action.payload.slot }
      };
    case 'day-shift':
      const dayDate = state.day.clone().add(action.payload.direction, "d");
      const currentWeek = state.day.week();
      const nextWeek = dayDate.week();
      return {
        ...state,
        day: dayDate,
        ...(state.weeknextWeek !== currentWeek) && { week: nextWeek },
        ...(action.payload.today.isSame(dayDate, "d") ? { index: action.payload.slot } : { index: -1 })
      };
    case 'week-shift':
      const weekDate = state.day.clone().add(action.payload.direction * 7, "d");
      return {
        ...state,
        day: weekDate,
        week: weekDate.week(),
        ...(action.payload.today.isSame(weekDate, "d") ? { index: action.payload.slot } : { index: -1 })
      };
    case 'time-change':
      return {
        ...state,
        index: action.payload,
      }
    default: 
      return state;
  }
};

function DeliveryView(props) {
  console.log("rendering view..");

  const times = props.times && Object.keys(props.times).map((idx) => [props.times[idx].value]);
  const columns = props.type === "day" ? times : weekdays;

  // reason I call this inside of the component instead of outside is because
  // any time the component rerenders, the date will be updated as well.
  // basically, my budget way of keeping the date updated
  const today = moment();
  const toweek = today.week();

  const [dateData, dateDispatch] = useReducer(reducer, {
    day: today,
    week: toweek,
    index: props.type === "day" ? props.timeSlot : today.weekday(),
  });
  const weekday = dateData.day.weekday();

  useEffect(() => {
    // first condition prevents dispatch from running on component initialization
    // since index is already defined and therefore running dispatch would be redundant
    if (dateData.index !== props.timeSlot && props.type === "day" && dateData.day.isSame(today, "d")) dateDispatch({ type: "time-change", payload: props.timeSlot });
  }, [props.timeSlot]);

  // try updating day value instantly when day changes - 
  // this works BUT can be delayed if computer goes to sleep (apparently):
  //
  // setTimeout(
  //   dayChange,
  //   moment("24:00:00", "hh:mm:ss").diff(moment(), 'seconds')
  // );
  // function dayChange() {
  //   /* do something */
  // }

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
    const data = { type, today, toweek, slot: type === "day" ? props.timeSlot : weekday };
    dateDispatch({ type: "today", payload: data });
  };
  
  const handleCalendarShift = (type, direction=1) => {
    const data = { today, slot: type === "day" ? props.timeSlot : weekday, direction };
    dateDispatch({ type: `${type}-shift`, payload: data });
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
              {props.type === "day" ? `${weekdays[weekday]}: ${dateData.day.format("MM-DD-YYYY")}` : `Week ${dateData.week} - ${dateData.day.clone().weekday(6).format("YYYY")}`}
            </button>
            {/* <button onClick={() => setIndex(index + 1)}></button> */}
          </div>
        </header>
        <section className="modal-card-body" style={{padding: "0"}}>
          <table className="table is-fullwidth is-bordered is-view" style={{minWidth: "880px"}}>
            <thead>
              <tr>
                <th>{props.type === "day" ? "Time Window" : "Day"}</th>
                {columns.map((value, idx) => (
                  <th className={"has-text-centered" + (dateData.index === idx ? " is-today" : "")} key={idx}>
                    <p style={{borderBottom: "1px solid lightgrey"}}>
                      {value + (props.type === "week" ? ` [${dateData.day.clone().add(idx - weekday, "d").format("MM/DD")}]` : "")}                                     
                    </p>
                    <ValueRange min="Min" max="Max" isHeader={true} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th title="Current number of drivers"># Drivers</th>
                <RowItems items={drivers} index={dateData.index} />
              </tr>
              <tr>
                <th title="Total distance driven">Dist. Driven</th>
                <RowItems items={distance} index={dateData.index} />
              </tr>
              <tr>
                <th title="Number of deliveries made"># Deliveries</th>
                <RowItems items={amtDeliveries} index={dateData.index} hasRange={true} />
              </tr>
              <tr>
                <th title="Time spent to deliver each product">Time/Delivery</th>
                <RowItems items={timeDelivery} index={dateData.index} hasRange={true} />
              </tr>
              <tr>
                <th title="Time spent at each product destination">Time/Location</th>
                <RowItems items={timeDestination} index={dateData.index} hasRange={true} />
              </tr>
              <tr>
                <th title="Total time spent">Total Time</th>
                <RowItems items={totalTimeDeliveries} index={dateData.index} hasRange={true} isLast={true} />
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
