import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import NoticeIcon from "../assets/icons/notice.js";
import web3 from "../setup/web3";
import dappTokenSaleContract from "../setup/DappTokenSale";
import dappTokenContract from "../setup/DappToken";

export default function Home() {
  let tokensAvailable = 750000;
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState("");

  useEffect(() => {
    let timeOut;

    const initApp = async () => {
      // Initialize the account
      const coinBase = await web3.eth.getCoinbase();
      setAccount(coinBase);

      // Get the  tokens price
      const tokenprice = await dappTokenSaleContract?.methods
        ?.tokenPrice()
        .call();
      setTokenPrice(tokenprice || 0);

      await getTokensSold();

      await getAccountBalance();

      // listen for events
      dappTokenSaleContract.events.Sell({}).on("data", (event) => {
        console.log("Event triggered: ", event);
        // window.location.reload(false);
      });
    };

    initApp();

    if (loading) timeOut = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(timeOut);
  }, [account]);

  const getTokensSold = async () => {
    // Get the tokens sold
    const tokenssold = await dappTokenSaleContract?.methods
      ?.tokensSold()
      .call();
    setTokensSold(tokenssold);
  };

  const getAccountBalance = async () => {
    // Get the account balance
    if (account) {
      const balance = await dappTokenContract?.methods
        ?.balanceOf(account)
        ?.call();
      setBalance(balance);
    }
  };

  const buyTokens = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dappTokenSaleContract?.methods?.buyTokens(value).send({
        from: account,
        value: value * tokenPrice,
      });
      await getTokensSold();
      await getAccountBalance();
    } catch (err) {
      console.log("Error! ", err);
    }
    setLoading(false);
  };

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
                Introducing "Dapp Token" (DAPP). Token price is{" "}
                <span className="toke-price">
                  {web3?.utils?.fromWei(`${tokenPrice || 0}`, "ether")}
                </span>{" "}
                ETH. You currently have{" "}
                <span className="dapp-balance">{balance}</span>
                &nbsp;DAPP tokens.
              </p>
              <br />
              <form
                className="form-inline w-100"
                onSubmit={(e) => buyTokens(e)}
              >
                <div className="input-group w-100">
                  <input
                    type="number"
                    className="form-control input-lg"
                    size="50"
                    placeholder="Number of tokens"
                    onChange={(e) => setValue(e.target.value)}
                    required={true}
                  />
                  <div className="input-group-btn">
                    <button type="submit" className="btn btn-primary">
                      Buy Tokens
                    </button>
                  </div>
                </div>
              </form>
              <br />
              <div className="progress mb-2">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(tokensSold / tokensAvailable) * 100}%`,
                  }}
                ></div>
              </div>
              <p>
                {tokensSold} out of {tokensAvailable} tokens sold
              </p>
              <div className="alert alert-primary">
                <p>
                  <strong>
                    <NoticeIcon />
                  </strong>
                  This token sale uses the Rinkeby Test Network with fake ether.
                  Use a browser extenstion like Metamask to connect to the test
                  network and participate in the ICO. Please be patient if the
                  test network runs slowly.
                </p>
              </div>
              <hr />
              <p>Your account: {account}</p>
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
