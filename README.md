# Arbitrum Bootcamp

Name: Francis Donald P. Alfonso

Student Number: 2020-05690

# Smart Contract
The smart contract applied is an ERC20 staking contract.

1. The owner of the account can mint for their own account.
2. Staking is a single-use action, meaning once we stake we cannot re-stake again
3. Withdraws from the contract removes the entire principal balance and any accrued interest
    - Can only withdraw after 2 minutes

Deployed and Verified:
```
Successfully submitted source code for contract
contracts/FDAToken.sol:FDAToken at 0x015811FBe271CCAeFA00250e3d6D9c33cB6A185A
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FDAToken on the block explorer.
https://sepolia.arbiscan.io/address/0x015811FBe271CCAeFA00250e3d6D9c33cB6A185A#code

Successfully verified contract FDAToken on Sourcify.
https://repo.sourcify.dev/contracts/full_match/421614/0x015811FBe271CCAeFA00250e3d6D9c33cB6A185A/
```

# Staking App
The contract is deployed in arbitrum Sepolia. Make sure to add the network in your MetaMask. The app has these following functions:
1. Connect with your MetaMask wallet.
2. Mint tokens
3. Stake tokens
4. Withdraw
    - When trying to withdraw before 2 minutes after staking, an alert will pop up with the remaining seconds left.

Note: I need to approve the transactions first. Inform me if you want to interact with the app in order to approve transactions.


