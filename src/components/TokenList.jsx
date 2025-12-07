import React from "react";
import { PiStarFill } from "react-icons/pi";
import { GoCheckCircleFill } from "react-icons/go";
import { MdRadioButtonUnchecked } from "react-icons/md";
import "../styles/components/tokenList.css";

const TokenList = ({ title, tokens, selectedTokens, onSelect }) => {
  return (
    <div>
      <p className="wishlist_popup_content_heading">{title}</p>

      <div className="wishlist_popup_content_items">
        {tokens.map((item) => {
          const selectedItem = selectedTokens.includes(item.id);

          return (
            <div
              key={item.id}
              className={`wishlist_popup_content_item ${
                selectedItem ? "wishlist_popup_content_item_active" : ""
              }`}
              onClick={() => onSelect(item.id)}
            >
              <div className="wishlist_popup_content_item_name">
                <img
                  className="wishlist_popup_content_item_image"
                  src={item.image}
                  alt={item.symbol}
                />
                <span>
                  {item.name} ({item.symbol})
                </span>
              </div>

              <div className="wishlist_popup_content_action">
                {selectedItem && <PiStarFill size={11} color="#A9E851" />}

                {selectedItem ? (
                  <GoCheckCircleFill size={18} color="#A9E851" />
                ) : (
                  <MdRadioButtonUnchecked size={18} color="#6B7280" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenList;
