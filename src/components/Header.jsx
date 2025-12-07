import React from "react";
import Icon from "./Icon";
import Button from "./ui/Button";
import { MdWallet } from "react-icons/md";
import "../styles/components/header.css";
import WalletConnect from "./wallet/WalletConnect";

const Header = () => {
  return (
    <div className="header">
      <div className="header_icon">
        <Icon />
        <span className="header_icon_name">Token Portfolio</span>
      </div>
      <WalletConnect />
    </div>
  );
};

export default Header;
