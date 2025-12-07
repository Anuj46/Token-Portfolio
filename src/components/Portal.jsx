import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const portalRoot = document.getElementById("portal-root");
  return createPortal(children, portalRoot);
};

export default Portal;
