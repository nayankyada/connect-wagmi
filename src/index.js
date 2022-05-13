import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function getLibrary(provider) {
  const library = new Web3(provider);
  library.pollingInterval = 8000;
  return library;
}
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThirdwebProvider desiredChainId={ChainId.Rinkeby} walletConnectors={[
        "walletConnect",
        { name: "injected", options: { shimDisconnect: false } },
        {
          name: "walletLink",
          options: {
            appName: "Example App",
          },
        },
        {
          name: "magic",
          options: {
            apiKey: "d5ffcd2812e4416d8d3fc5c43918286f",
            rpcUrls: {
              [ChainId.Rinkeby]: "https://rinkeby.infura.io/v3",
            },
          },
        },
      ]}>
        <App />
      </ThirdwebProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
