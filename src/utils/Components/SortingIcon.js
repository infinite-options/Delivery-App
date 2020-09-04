import React from "react";
import Icons from "utils/Icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// NOTE: Try doing the sorting in this component? Rather than creating 
//       a reducer for every single list. Probably possible?
//       My thoughts: each list component has a useState hook (Ex: [routeData, setRouteData]),
//                    then <SortingIcon type="id" data={routeData} update={setRouteData} />.
//                    What would happen is: update([...data].sort((a, b) => (condition ? a[1][type] - b[1][type] : b[1][type] - a[1][type]))),
//                                          condition = should sort be ascending or descending?
function SortingIcon({ type, data, update, typeOf, ...props }) {
  const handleClick = () => {
    console.log("testy");
    update(prevState => {
      const newValue = prevState.sortBy === type ? -prevState.value: -1;

      // switch (typeOf) {
      //   case 'number':
      return {
        sortBy: type,
        value: newValue,
        list: [...prevState.list].sort((a, b) => {
          switch (typeOf) {
            case 'number':
              return newValue === 1 ? a[1][type] - b[1][type] : b[1][type] - a[1][type];
            case 'string':
              // sorting by primary key
              if (type === 'id') return newValue === 1 ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0]);
              // sorting by full name
              if (type.includes('name')) {
                // name data can come as 'xxxxx_first_name' or 'first_name'
                const userType = type.substring(0, type.indexOf('-')) ? `${type.substring(0, type.indexOf('-'))}_` : ''; // Ex: userType = 'customer_'
                const name_a = `${a[1][`${userType}first_name`]} ${a[1][`${userType}last_name`]}`;
                const name_b = `${b[1][`${userType}first_name`]} ${b[1][`${userType}last_name`]}`;
                return newValue === 1 ? name_a.localeCompare(name_b) : name_b.localeCompare(name_a);
              }
              // sorting by full address
              if (type.includes('address')) {
                const addressType = type.substring(0, type.indexOf('-'));
                // const address_a = a[1][];
                // const address_b = ;
                // NOTE: Finish this
              }
              return newValue === 1 ? a[1].localeCompare(b[1]) : b[1].localeCompare(a[1]);
            
            default: return prevState;
          }
        }),
      };
        
      //   default: 
      //     return prevState;
      // }
    });
  };

  return (
    <span className="fa-layers no-select ml-1" style={{ cursor: "pointer" }} onClick={handleClick}>
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