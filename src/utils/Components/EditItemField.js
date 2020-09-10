import React from "react";

function EditItemField({ className, style, value, placeholder, handleChange, type, ...props }) {
  const handleTextareaSize = (e, focus) => {
    focus ? 
      e.target.style.height = `${e.target.scrollHeight + (e.target.scrollHeight !== 58 ? 8 : 0)}px` :
      e.target.style.height = "5em";
  };

  return !props.textarea ? (
    <input 
      className={"input is-super-small" + (className ? " " + className : "")}
      style={style}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => handleChange(e, type)}
    />
  ) : (
    <textarea 
      className={"textarea is-small" + (className ? " " + className : "")}
      style={{ minHeight: "5em", ...style }}
      value={value || ''}
      placeholder={placeholder}
      onFocus={(e) => handleTextareaSize(e, true)}
      onBlur={(e) => handleTextareaSize(e, false)}
      onChange={(e) => handleChange(e, type)}
    />
  );
};

export default EditItemField;
