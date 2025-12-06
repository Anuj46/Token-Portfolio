import React from "react";
import "../../styles/components/ui/button.css";

const Button = ({
  children,
  icon,
  type = "simple",
  varient = "primary",
  disabeled = false,
  onClick,
}) => {
  return (
    <button
      className={`button ${varient}_button ${type}_button`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;
