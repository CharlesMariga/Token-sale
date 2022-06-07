import { useState, useEffect } from "react";
import Web3 from "web3";

import "bootstrap/dist/css/bootstrap.min.css";
import detectEthereumProvider from "@metamask/detect-provider";

import dappTokenSaleArtifact from "../build/contracts/DappTokenSale.json";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappTokenSaleContract, setDappTokenSaleContract] = useState(null);

  useEffect(async () => {
    // Set provider
    setProvider(await detectEthereumProvider());

    // Initialize web3
    if (provider) {
      setWeb3(new Web3(window.ethereum));
    } else {
      setProvider(new Web3.providers.HttpProvider("https://localhost:8545"));
      setWeb3(new Web3(provider));
    }

    // Initialize contracts
    if (web3) {
      setDappTokenSaleContract(
        new web3.eth.Contract(
          dappTokenSaleArtifact.abi,
          dappTokenSaleArtifact.networks[5777].address
        )
      );
      dappTokenSaleContract?.setProvider(provider);
    }

    const timeOut = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="container" style={{ width: "650px" }}>
          <div className="row mt-4">
            <div className="col-lg-12">
              <h1 className="text-center">Dapp Token ICO</h1>
              <hr />
              <br />
            </div>
            <div className="text-center">
              <p>
                Intoruducing "Dapp Token" (DAPP). Token price is
                <span className="toke-price"></span> Ether. You currently has
                <span className="dapp-balance"></span>&nbsp;DARPP
              </p>
              <br />
              <form className="form-inline w-100">
                <div className="input-group w-100">
                  <input
                    type="email"
                    className="form-control input-lg"
                    size="50"
                    placeholder="Email Address"
                    required={true}
                  />
                  <div className="input-group-btn">
                    <button type="button" className="btn btn-primary">
                      Subscribe
                    </button>
                  </div>
                </div>
              </form>
              <br />
              <div className="progress mb-2">
                <div className="progress-bar" style={{ width: "70%" }}></div>
              </div>
              <p>/ tokens sold</p>
              <div className="alert alert-primary">
                <p>
                  <strong>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                    Notice
                  </strong>
                  This token sale uses the Rinkeby Test Network with fake ether.
                  Use a browser extenstion like Metamask to connect to the test
                  network and participate in the ICO. Please be patient if the
                  test network runs slowly.
                </p>
              </div>
              <hr />
              <p>Account:</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .loader {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
