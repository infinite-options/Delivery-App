import React, { useState, useEffect, useRef } from "react";

import moment from 'moment';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(moment(weekStart).add(i, 'days').toDate());
  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date).startOf('week').toDate(),
    to: moment(date).endOf('week').toDate(),
  };
}

function DeliveryView(props) {
  const weekdays = [
    { value: "Sunday" },
    { value: "Monday" },
    { value: "Tuesday" },
    { value: "Wednesday" },
    { value: "Thursday" },
    { value: "Friday" },
    { value: "Saturday" },
  ];
  const columns = props.type === "day" ? props.times : weekdays;
  const [hoverRange, setHoverRange] = useState();
  const [selectedDays, setSelectedDays] = useState([]);  

  const daysAreSelected = selectedDays.length > 0;
  const modifiers = {
    hoverRange : hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[6],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[6],
  };

  const handleDayChange = (date) => {
    setSelectedDays(getWeekDays(getWeekRange(date).from));
  };

  const handleDayEnter = (date) => {
    setHoverRange(getWeekRange(date));
  };

  const handleDayLeave = () => {
    setHoverRange();
  };

  const handleWeekClick = (weekNumber, days, e) => {
    setSelectedDays(days);
  };

  return (
    <div className={"modal" + (props.visible ? " is-active" : "")}>
      <div className="modal-background" onClick={props.onClick} />
      <div className="modal-card" style={{ width: "75vw" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">
            {props.type === "day" ? "Day" : "Week"}
          </p>
          <DayPicker 
            showWeekNumbers
            showOutsideDays
            modifiers={modifiers}
            onDayClick={handleDayChange}
            onDayMouseEnter={handleDayEnter}
            onDayMouseLeave={handleDayLeave}
            onWeekClick={handleWeekClick}
          />
          {selectedDays.length === 7 && (
            <div>
              {moment(selectedDays[0]).format('LL')} –{' '}
              {moment(selectedDays[6]).format('LL')}
            </div>
          )}
        </header>
        <section className="modal-card-body">
          <table className="table is-fullwidth is-bordered">
            <thead>
              <tr>
                <th>{props.type === "day" ? "Time Window" : "Day"}</th>
                {columns.map((time, idx) => (
                  <th className="has-text-centered" key={idx}>
                    <p
                      style={{
                        width: "100%",
                        display: "inline-block",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      {time.value}
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
              </tr>
              <tr>
                <th>Distance Driven</th>
              </tr>
              <tr>
                <th># Deliveries</th>
              </tr>
              <tr>
                <th>Time Taken / Delivery</th>
              </tr>
              <tr>
                <th>Time Taken @ Location</th>
              </tr>
              <tr>
                <th>Total Deliveries Time</th>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default DeliveryView;
