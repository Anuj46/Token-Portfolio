import React from "react";
import Icon from "./ui/Icon";
import Button from "./ui/Button";

const Header = () => {
  return (
    <div>
      <div>
        <Icon />
        <span>Token Portfolio</span>
      </div>
      <Button type="pill">Content Wallet</Button>
    </div>
  );
};

export default Header;
