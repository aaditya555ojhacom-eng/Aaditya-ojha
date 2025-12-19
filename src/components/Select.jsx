import React, { forwardRef } from "react";

const Select = forwardRef(
  ({ options = [], label, className = "", ...props }, ref) => {
    return (
      <div>
        {label && <label className="block mb-1">{label}</label>}
        <select
          ref={ref}
          {...props}
          className={`px-3 py-2 rounded-lg border border-gray-200 w-full ${className}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default Select;
