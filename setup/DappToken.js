import dappTokenArtifact from "../build/contracts/DappToken.json";
import web3 from "./web3";

const instance = new web3.eth.Contract(
  dappTokenArtifact.abi,
  dappTokenArtifact.networks[5777].address
);

export default instance;
