<script lang="ts">
  import { ethers } from "ethers";
  import type { JsonRpcSigner } from "ethers";
  import { Contract } from "ethers";
  import { ABI } from "./abi";
  import { writable } from "svelte/store";
  import { onDestroy } from "svelte";

  let connected = false;
  let tokensToStake = 0;
  let tokensToMint = 0;
  let userAddress = '';
  let userTokenBalance = 0;
  $: updatedTokenBalance = userTokenBalance;
  let withdrawalDeadline = 0;
  let interval;
  let FDAToken;
  let isStaked = false;

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const account = await provider.send("eth_accounts", []);
    connected = true;
    console.log(account);

    // get staking contract
    const signer = await provider.getSigner();
    const networkId = await provider.getNetwork().then((network: { chainId: any; }) => network.chainId);
    const contract = await initializeContract(signer);
    console.log(contract);

    // Get user's address and token balance
    userAddress = await signer.getAddress();
    userTokenBalance = await contract.balanceOf(userAddress);

  };

  const refreshUserTokenBalance = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    userTokenBalance = await contract.balanceOf(userAddress);
    console.log("refreshed token balance");
  };

  const stakeTokens = async () => {
    try {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      const tx = await contract.stake(tokensToStake);
      await tx.wait(); // Wait for transaction to be mined
      console.log("Staked", tokensToStake, "tokens");
      alert("Staked " + tokensToStake + " FDA tokens");
      isStaked = true;

      // Fetch and display token balance after successful stake
      await refreshUserTokenBalance();
      

    } catch (error) {
      console.log(error.reason);
      alert(error.reason);
    }
  };

  const withdrawTokens = async () => {
    try {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      const tx = await contract.withdraw();
      await tx.wait(); // Wait for transaction to be mined
      console.log("Withdrawn tokens");
      alert("Withdrawn tokens");
      isStaked = false;
      await refreshUserTokenBalance();
    } catch (error) {
      console.log(error.reason);
      if (error.reason === "Withdrawal period is not reached yet") {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = await initializeContract(signer);
        const timeLeft =await contract.withdrawalTimeLeft();
        alert("You can withdraw after: " + timeLeft + " seconds");
      } else {
        alert(error.reason);
      }
    }
  };

  const mintTokens = async () => {
    try {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      
      const tx = await contract.mint(userAddress, tokensToMint);
      await tx.wait(); // Wait for transaction to be mined
      console.log("Minted", tokensToMint, "tokens");
      alert("Minted " + tokensToMint + " tokens");
      console.log(contract.signer);
      await refreshUserTokenBalance();
      
    } catch (error) {
      console.log(error);
      alert(error.reason);
    }
  };

  const initializeContract = async (signer: JsonRpcSigner) => {
    return new Contract(
      "0x015811FBe271CCAeFA00250e3d6D9c33cB6A185A",
      ABI,
      signer
    );
  };

</script>

<!--  

  1. Connect wallet DONE
  2. Mint tokens
  3. Stake
  4. Withdraw
  5. Countdown in alert
-->

<h1>Welcome to my FDAToken Staking dApp!</h1>

<main>
  
  {#if connected}
    <p>Connected to MetaMask</p>
    <p>User Address: {userAddress}</p>
    <p>Your FDA Token Balance: {updatedTokenBalance}</p>

    <!-- Minting Section -->
    <h2>Mint Tokens</h2>
    <input type="number" bind:value={tokensToMint} min="0" step="1" />
    <button on:click={mintTokens}>Mint Tokens</button>

    <!-- Staking Section -->
    <h2>Stake Tokens</h2>
    <input type="number" bind:value={tokensToStake} min="0" step="1" />
    <button on:click={stakeTokens}>Stake Tokens</button>

    <!-- Withdraw Section -->
    <h2>Withdraw Tokens</h2>
    <button on:click={withdrawTokens}>Withdraw Tokens</button>

    
  {:else}
    <button on:click={connectWallet}>Connect to MetaMask</button>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    
    margin: 0 auto;
  }

  h1 {
    color: #ffffff;
    text-align: center;
  }

  h2 {
    margin-top: 20px;
  }

  input[type="number"] {
    max-width: 240px;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  button {
    max-width: 240px;
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
  }
</style>

