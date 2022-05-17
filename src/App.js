import React, { useState, useCallback, useEffect } from "react";
import "./style/index.css";
import abi from "./abi";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useNetwork,
  useContractWrite,
  useBalance,
} from "wagmi";
import { useNFTDrop } from "@thirdweb-dev/react";
import web3 from "web3";
import NFTPage from "./NFTPage";
function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const { activeChain, switchNetwork } = useNetwork();
  const [ownedNFT, setOwnedNFT] = useState([]);
  const { connect, connectors, isConnecting, pendingConnector } = useConnect();
  const nftDrop = useNFTDrop("0x310dE633632f53492791b59206DdA7aF08A909fC");

  const { data: account } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: account?.address,
  });

  const { disconnect } = useDisconnect();
  const { write: mintApe } = useContractWrite(
    {
      addressOrName: "0x1F62AaBFa4aD4A5D782AF0cE0aBfF990ABf130E1",
      contractInterface: abi,
    },
    "safeMint"
  );
  useEffect(() => {
    if (account && activeChain?.id !== 4) {
      setErrorMessage("Please Connect With Rinkeby Network");
    } else {
      setErrorMessage("");
    }
  }, [activeChain]);
  const mintPig = () => {
    const quantity = 1; // how many unique NFTs you want to claim
    nftDrop
      .claimTo(account?.address, quantity)
      .then((d) => console.log(d))
      .catch((e) => console.log(e));
  };
  const getMintedNFT = () => {
    nftDrop
      .getAllClaimed(account?.address)
      .then((d) => {
        setOwnedNFT(d);
        console.log(d);
      })
      .catch((e) => console.log(e));
  };
  // useEffect(() => {
  //   if(account?.address){
  //     nftDrop.getOwned(account?.address).then((d) => {
  //       setOwnedNFT(d);
  //       console.log(d);
  //     });
  //   }
  //   else{
  //     setOwnedNFT([])
  //   }

  // }, [account?.address]);
  return (
    <div className="App">
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Public Private Mint
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg ">
          {account && errorMessage && (
            <div className="rounded-md bg-red-50 mx-8 p-4  shadow-sm">
              <div className="flex justify-center">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-600">
                    {errorMessage}
                  </h3>
                  {"account" && (
                    <button
                      onClick={() => {
                        switchNetwork(4);
                      }}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Connect With Rinkeby
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {account && !errorMessage ? (
            <div className="px-4">
              <div className="px-4 py-5 my-4 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt
                  className="text-md font-extrabold cursor-pointer text-gray-500 truncate"
                  onClick={() => {
                    navigator.clipboard.writeText("account");
                  }}
                >
                  <abbr title="Click To Copy">{account.address}</abbr>
                </dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {balance && balance.formatted} ETH
                </dd>
                <button
                  onClick={disconnect}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Disconnect Wallet
                </button>
              </div>
              <div className="bg-white py-4 px-4 mt-6 shadow sm:rounded-lg sm:px-10">
                <div className="space-y-6">
                  <div className="flex justify-center space-x-4 items-center">
                    <button
                      onClick={() => {
                        mintApe({
                          args: [account.address],
                          overrides: {
                            from: account?.address,
                            gasLimit: "300000",
                            value: web3.utils.toWei("0.01", "ether"),
                          },
                        });
                      }}
                      type="button"
                      className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Mint Bored Mutant ape
                    </button>
                    <button
                      onClick={mintPig}
                      type="button"
                      className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Mint Pig
                    </button>
                    <button
                      onClick={getMintedNFT}
                      type="button"
                      className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      getMintedNFT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !account?.address ? (
            <div className="mx-8 flex space-x-3">
              {connectors.map((x) => (
                <button
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={!x.ready}
                  key={x.id}
                  onClick={() => connect(x)}
                >
                  {x.name}
                  {isConnecting &&
                    pendingConnector?.id === x.id &&
                    " (connecting)"}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {account?.address && ownedNFT.length > 0 && (
        <NFTPage ownedNFT={ownedNFT} />
      )}
    </div>
  );
}

export default App;
