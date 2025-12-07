import React, { useEffect } from "react";
import "../../styles/components/ui/popup.css";

const Popup = ({ open, onClose, children }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="popup_overlay" onClick={onClose}>
      <div className="popup_container" onClick={(e) => e.stopPropagation()}>
        <div className="popup_body">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
