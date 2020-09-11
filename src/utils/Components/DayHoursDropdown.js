import React, { useState } from "react";
import Icons from "utils/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

const weekdays = moment.weekdays();

const DayHoursDropdown = ({ type, ...props }) => {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(type ? JSON.parse(type) : []);
  const [selectedDay, setSelectedDay] = useState(weekdays[0]);
//   console.log(days[selectedDay]);

  return (
    <React.Fragment>
      <div className={"dropdown has-text-left mr-1" + (open ? " is-active" : "")}>
        <div className="dropdown-trigger">
          <button className="button is-super-small" /*style={{ width: "2.75rem" }}*/ onClick={() => setOpen(prevOpen => !prevOpen)} aria-haspopup="true" aria-controls="dropdown-menu">
            {/* <span>{selectedDay.substring(0, 3)}</span> */}
            <span>{selectedDay}</span>
            <FontAwesomeIcon icon={Icons.faCaretDown} className="ml-1" />
          </button>
        </div>
        <div className="dropdown-menu" style={{ paddingTop: 0, minWidth: "8rem" }} id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {weekdays.map((day, index) => (
              <button 
                key={index} 
                className="button is-small is-white dropdown-item" 
                disabled={day === selectedDay} 
                onClick={() => { setSelectedDay(day); setOpen(false); }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
      {days[selectedDay] && (
        <TimeRange days={days} selectedDay={selectedDay} />
      )}
    </React.Fragment>
  );
};

const convertTo12Hr = (time) => {
//   const time24 = time.substring(0, days[selectedDay][0].length - 3);
  const hour24 = Number(time.substring(0, 2));
  const isPM = Math.floor(hour24 / 12)
  if (isPM) {
    const timePM = hour24 % 12;

    return (
      (Math.floor(timePM / 10) ? "" : "0") + timePM + 
      time.substring(2, time.length - 3) + "pm"
    );
  }
  return (
    time.substring(0, time.length - 3) + "am"
  );
};

function TimeRange({ days, selectedDay, ...props }) {
  const beginTime = convertTo12Hr(days[selectedDay][0]); // days[selectedDay][0].substring(0, days[selectedDay][0].length - 3);
  const closeTime = convertTo12Hr(days[selectedDay][1]); // days[selectedDay][1].substring(0, days[selectedDay][0].length - 3);
  return (
    <p>
      {beginTime} - {closeTime}
    </p>
  );
};

export default DayHoursDropdown;
