import React from "react";
import Icons from "utils/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function FillerRow({ numColumns, showMore, setShowMore }) {
  return (
    <tr className="filler-row">
      {/* loop numColumns - 1 times */}
      {[...Array(numColumns - 1)].map((empty , idx) => (
        <td key={idx} />
      ))}
      <td style={{ textAlign: "right" }}>
        <span className="has-text-grey">Show {showMore ? "Less" : "More"}</span>
        <button 
          className="button is-super-small is-light mx-1"
          onClick={() => setShowMore((prevShowMore) => !prevShowMore)}
        >
          <FontAwesomeIcon icon={(showMore ? Icons.faCaretUp : Icons.faCaretDown)} color="grey" />
        </button>
      </td>
    </tr>
  );
}

export default FillerRow;
