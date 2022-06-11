import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

let web3;
let provider;

provider = detectEthereumProvider();
if (provider && typeof window !== "undefined") {
  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log("Please connect to MetaMask.");
    } else {
      console.error(error);
    }
  }
} else {
  // We are on the server or the user is not using metamask
  const provider = new Web3.providers.HttpProvider("http://localhost:8545");
  web3 = new Web3(provider);
}

export default web3;
