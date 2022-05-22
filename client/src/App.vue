<template>
  <div>
    <div v-if="loading" class="loader">Loading...</div>
    <div v-else class="container" :style="{ width: '650px' }">
      <div class="row mt-4">
        <div class="col-lg-12">
          <h1 class="text-center">Dapp Token ICO</h1>
          <hr />
          <br />
        </div>
        <div class="text-center">
          <p>
            Intoruducing "Dapp Token" (DAPP). Token price is
            <span class="toke-price"></span> Ether. You currently has
            <span class="dapp-balance"></span>&nbsp;DARPP
          </p>
          <br />
          <form class="form-inline w-100">
            <div class="input-group w-100">
              <input
                type="email"
                class="form-control input-lg"
                size="50"
                placeholder="Email Address"
                required="true"
              />
              <div class="input-group-btn">
                <button type="button" class="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </form>
          <br />
          <div class="progress mb-2">
            <div class="progress-bar" :style="{ width: '70%' }"></div>
          </div>
          <p>/ tokens sold</p>
          <div class="alert alert-primary">
            <p>
              <strong>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-exclamation-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                  />
                </svg>
                Notice</strong
              >
              This token sale uses the Rinkeby Test Network with fake ether. Use
              a browser extenstion like Metamask to connect to the test network
              and participate in the ICO. Please be patient if the test network
              runs slowly.
            </p>
          </div>
          <hr />
          <p>Account:</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ethers } from "ethers";
import { abi as DappTokenAbi } from "../../build/contracts/DappToken.json";

export default {
  setup() {
    let loading = ref(false);
    let provider = ref(null);
    const DappTokenAddress = "0x4f37767bf2f8f8dFCEB540d65983cE8ab7F17A0E";
    const DappTokenSaleAddress = "0xbf7c15A5269F22F96F0C11a31468D5e9c7448e04";
    let DappTokenContract = ref(null);
    let DappTokenSaleContract = ref(null);

    const initWeb3 = async () => {
      if (window?.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        // await provider.send("eth_requestAccounts", []);
      } else {
        provider = new ethers.providers.JsonRpcProvider();
      }
    };

    const initContracts = async () => {
      DappTokenContract = new ethers.Contract(
        DappTokenAddress,
        DappTokenAbi,
        provider
      );
      const address = await DappTokenContract.address;
      console.log("Address: ", address);
    };

    onMounted(() => {
      console.log("App initialized...");
      initWeb3();
      initContracts();
    });

    return { loading };
  },
};
</script>

<style>
.loader {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
