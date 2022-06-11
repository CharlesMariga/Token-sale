import dappTokenSaleArtifact from "../build/contracts/DappTokenSale.json";
import web3 from "./web3";

const instance = new web3.eth.Contract(
  dappTokenSaleArtifact.abi,
  dappTokenSaleArtifact.networks[5777].address
);

export default instance;
