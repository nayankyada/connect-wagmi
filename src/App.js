import React, { useState, useCallback, useEffect } from "react";
import "./style/index.css";
import createContract from "./contract";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useBalance,
} from "wagmi";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    activeChain,
    chains,
    error: networkError,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect({
   
  });

  const { data: account } = useAccount();
  const { data: balance } = useBalance({addressOrName:account?.address,watch:true});

  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (account && activeChain?.id !== 4) {
      setErrorMessage("Please Connect With Rinkeby Network");
    }
    else{
      setErrorMessage("")
    }
  }, [activeChain]);

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
                    <button onClick={() => {switchNetwork(4)}} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                <button onClick={disconnect} className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Disconnect Wallet
                </button>
              </div>
              <div className="bg-white py-4 px-4 mt-6 shadow sm:rounded-lg sm:px-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Mint Bored Mutant ape
                    </button>
                    <button
                      type="button"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Mint Pig
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
      {account && account.address}
    </div>
  );
}

export default App;
