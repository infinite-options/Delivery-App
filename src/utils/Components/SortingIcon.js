import React from "react";
import Icons from "utils/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SortingIcon({ type, data, dispatch }) {
  return (
    <span className="fa-layers no-select ml-1" style={{ cursor: "pointer" }} onClick={() => dispatch({ type: type })}>
      {data.sortBy === type ? (
        <React.Fragment>
          <FontAwesomeIcon 
            icon={Icons.faSortUp} 
            // size="lg" 
            color={data.value === 1 ? "black" : "lightgrey"}
            // style={{ marginBottom: "0px" }} 
          />
          <FontAwesomeIcon 
            icon={Icons.faSortDown} 
            // size="lg" 
            color={data.value === -1 ? "black" : "lightgrey"}
            // style={{ marginTop: "0px" }} 
          />
        </React.Fragment>
      ) : (
        <FontAwesomeIcon icon={Icons.faSort} color="lightgrey" />
      )}
    </span>
  );
}

export default SortingIcon;

{/* <FontAwesomeIcon 
    icon={
    data.sortBy !== type 
        ? Icons.faSort 
        : Icons[data.value === 1 ? 'faSortUp' : 'faSortDown']
    }
    color="lightgrey"
    className="ml-1" 
    style={{ cursor: "pointer" }}
    onClick={() => dispatch({ type: type })}
/>   */}