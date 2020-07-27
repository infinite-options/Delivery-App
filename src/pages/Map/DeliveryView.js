import React, { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icons from "Icons/Icons";
import moment from 'moment';
import 'moment-timezone';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

// function getWeekDays(weekStart) {
//   const days = [weekStart];
//   for (let i = 1; i < 7; i += 1) {
//     days.push(moment(weekStart).add(i, 'days').toDate());
//   }
//   return days;
// }

// function getWeekRange(date) {
//   return {
//     from: moment(date).startOf('week').toDate(),
//     to: moment(date).endOf('week').toDate(),
//   };
// }

function DeliveryView(props) {
  const times = Object.keys(props.times).map((idx) => [props.times[idx].value]);
  const weekdays = moment.weekdays();
  const columns = props.type === "day" ? times : weekdays;

  const today = moment();
  const toweek = today.week() // TOday.. TOweek... haha funny
  const [day, setDay] = useState(today);
  const [week, setWeek] = useState(toweek);
  // console.log(day, week);

  // const [hoverRange, setHoverRange] = useState();
  // const [selectedDays, setSelectedDays] = useState([]);  

  // const daysAreSelected = selectedDays.length > 0;
  // const modifiers = {
  //   hoverRange : hoverRange,
  //   selectedRange: daysAreSelected && {
  //     from: selectedDays[0],
  //     to: selectedDays[6],
  //   },
  //   hoverRangeStart: hoverRange && hoverRange.from,
  //   hoverRangeEnd: hoverRange && hoverRange.to,
  //   selectedRangeStart: daysAreSelected && selectedDays[0],
  //   selectedRangeEnd: daysAreSelected && selectedDays[6],
  // };

  // const handleDayChange = (date) => {
  //   setSelectedDays(getWeekDays(getWeekRange(date).from));
  // };

  // const handleDayEnter = (date) => {
  //   setHoverRange(getWeekRange(date));
  // };

  // const handleDayLeave = () => {
  //   setHoverRange();
  // };

  // const handleWeekClick = (weekNumber, days, e) => {
  //   setSelectedDays(days);
  // };

  const handleTodayClick = (type) => {
    if (day !== today) setDay(today);
    if (week != toweek) setWeek(toweek);
  };
  
  const handleCalendarShift = (type, direction=1) => {
    if (type === "day") {
      setDay(prevDay => {
        const currentWeek = moment(prevDay).week();
        const nextDay = prevDay.clone().add(direction, "d");
        const nextWeek = moment(nextDay).week();
        if (nextWeek !== currentWeek) setWeek(nextWeek);
        return nextDay;
      });
    }
    else {
      setWeek(prevWeek => {
        const date = day.clone().add(direction * 7, "d");
        // console.log(date);
        return moment(date).week();
      });
      setDay(prevDay => prevDay.clone().add(direction * 7, "d"));
    }
  };

  return (
    <div className={"modal" + (props.visible ? " is-active" : "")}>
      <div className="modal-background" onClick={props.onClick} />
      <div className="modal-card" style={{ width: "75vw" }}>
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
                      {value + (props.type === "week" ? ` [${day.clone().add(idx - moment(day).weekday(), "d").format("MM/DD")}]` : "")}
                                                           
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
