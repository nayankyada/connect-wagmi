import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {providers} from "ethers"
import { Provider, chain, createClient, defaultChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

const infuraId = process.env.REACT_APP_INFURA_ID;
const chains = defaultChains;
const defaultChain = chain.mainnet;
const client = createClient({
  autoConnect: true,
  provider(config) {
    return new providers.InfuraProvider(config.chainId, 'd5ffcd2812e4416d8d3fc5c43918286f')
  },
  connectors({ chainId }) {
    const temps = chains.find((x) => x.id === chainId) ?? defaultChain;
    const rpcUrl = temps.rpcUrls.infura
      ? `${temps.rpcUrls.infura}/${infuraId}`
      : temps.rpcUrls.default;
    return [
      new MetaMaskConnector({
        chains: [chain.mainnet, chain.rinkeby],
        options: {
          rpc: { [temps.id]: rpcUrl },
        },
      }),
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
      <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
        <App />
      </ThirdwebProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
