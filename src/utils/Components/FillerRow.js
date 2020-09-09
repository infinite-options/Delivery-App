import React from "react";
import Icons from "utils/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function FillerRow({ numColumns, showMore, setShowMore }) {
  return (
    <tr className="filler-row">
      {/* loop numColumns - 1 times */}
      {[...Array(numColumns - 1)].map((empty, index) => (
        <td key={index} />
      ))}
      <td style={{ textAlign: "right" }}>
        {setShowMore ? (
          <React.Fragment>
            <span className="has-text-grey mb-1">Show {showMore ? "Less" : "More"}</span>
            <button 
              className="button is-super-small is-light mx-1"
              onClick={() => setShowMore((prevShowMore) => !prevShowMore)}
            >
              <FontAwesomeIcon icon={(showMore ? Icons.faCaretUp : Icons.faCaretDown)} color="grey" />
            </button>
          </React.Fragment>
        ) : (
          <div style={{ marginBottom: "20px" }} />
        )}
      </td>
    </tr>
  );
}

export default FillerRow;
