import React from "react";
import "../../styles/components/ui/button.css";

const Button = ({
  children,
  icon,
  type = "simple",
  varient = "primary",
  disabled = false,
  onClick,
  responsive,
}) => {
  return (
    <button
      className={`button ${varient}_button ${type}_button ${
        disabled && "disabled_button"
      } ${responsive && "responsive_button"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className={`${responsive && "responsive_button_text"}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;
