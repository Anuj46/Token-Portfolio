import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "../ui/Button";
import { MdWallet } from "react-icons/md";

const truncateAddress = (address, start = 4, end = 4) => {
  if (!address) return "";
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export default function WalletConnect() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (address) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none" },
            })}
          >
            {!connected ? (
              <Button
                type="pill"
                icon={<MdWallet size={16} />}
                onClick={openConnectModal}
              >
                Connect Wallet
              </Button>
            ) : chain?.unsupported ? (
              <Button type="pill" onClick={openChainModal}>
                Wrong Network
              </Button>
            ) : (
              <div className="wallet-connected">
                <div className="network-info" onClick={openChainModal}>
                   {chain.name}
                </div>

                <div className="account-info" onClick={openAccountModal}>
                  <div className="account-address">
                    {truncateAddress(account.address)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(account.address);
                      }}
                      className="copy-address"
                    >
                      {copied ? "Ok" : "List"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
