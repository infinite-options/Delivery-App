import React from "react";

function EditItemField({ className, style, value, placeholder, handleChange, type, ...props }) {
  return (
    <input 
      className={"input is-super-small" + " " + className}
      style={style}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => handleChange(e, type)}
    />
  );
};

export default EditItemField;
