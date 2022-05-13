import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider, chain, createClient, defaultChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const infuraId = process.env.REACT_APP_INFURA_ID;

const chains = defaultChains;
const defaultChain = chain.mainnet;

const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const temps = chains.find((x) => x.id === chainId) ?? defaultChain;
    const rpcUrl = temps.rpcUrls.infura
      ? `${temps.rpcUrls.infura}/${infuraId}`
      : temps.rpcUrls.default;
    return [
      new MetaMaskConnector({ chains: [chain.mainnet, chain.rinkeby] ,options: {
        rpc: { [temps.id]: rpcUrl },
      }}),
      new WalletConnectConnector({
        chains: [chain.mainnet, chain.rinkeby],
        options: {
          qrcode: true,
          rpc: { [temps.id]: rpcUrl },
        },
      }),
    ];
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider client={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
