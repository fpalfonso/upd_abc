<script lang="ts">
  import { ethers } from "ethers";
  import type { JsonRpcSigner } from "ethers";
  import { Contract } from "ethers";
  import { ABI } from "./abi";

  let data: number = 0;
  const connectWallet = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const account = await provider.send("eth_accounts", []);
    console.log(account);
  };

  // const readData = async () => {
  //   const { ethereum } = window as any;
  //   const provider = new ethers.BrowserProvider(ethereum);
  //   const signer = await provider.getSigner();
  //   const contract = await initializeContract(signer);
  //   data = await contract.data();
  //   alert(data);
  // };

  // const setData = async () => {
  //   const { ethereum } = window as any;
  //   const provider = new ethers.BrowserProvider(ethereum);
  //   const signer = await provider.getSigner();
  //   const contract = await initializeContract(signer);
  //   await contract.setData(100);
  // };

  // const initializeContract = async (signer: JsonRpcSigner) => {
  //   return new Contract(
  //     "0x015811FBe271CCAeFA00250e3d6D9c33cB6A185A",
  //     ABI,
  //     signer
  //   );
  // };
</script>

<!--  

  1. Connect wallet DONE
  2. Read Functions 
  3. Write Functions
-->

<main>
  <button on:click={connectWallet}>Connect Wallet</button>
  <!-- <button on:click={readData}>{data}</button>
  <button on:click={setData}>Set Data</button> -->
</main>