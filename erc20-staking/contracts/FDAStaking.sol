// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FDAStaking {
    ERC20 public _FDAToken; // staking token
    ERC20 public _FDAReward; // reward token

    // how much they staked
    mapping(address => uint256) public _balances;

    // how much each address has been paid
    mapping(address => uint256) public _userRewardPerTokenPaid;

    // how much rewards each address has
    mapping(address => uint256) public _rewards;


    uint256 public _totalSupply;
    uint256 public _rewardPerTokenStored;
    uint256 public _lastUpdateTime;

    uint256 public constant _rewardRate = 100; // 100 reward tokens per second

    modifier updateReward(address account) {
        _rewardPerTokenStored = rewardPerToken();
        _lastUpdateTime = block.timestamp;
        _rewards[account] = earned(account);
        _userRewardPerTokenPaid[account] = _rewardPerTokenStored;
        _;
    }

    constructor(address FDAToken, address FDAReward) {
        _FDAToken = ERC20(FDAToken);
        _FDAReward = ERC20(FDAReward);
    }



    function earned(address account) public view returns(uint256) {
        uint256 currentBalance = _balances[account];
        uint256 amountPaid = _userRewardPerTokenPaid[account];
        uint256 currentRewardPerToken = rewardPerToken();
        uint256 pastRewards = _rewards[account];

        uint256 _earned = ((currentBalance * (currentRewardPerToken - amountPaid))/1e18) + pastRewards;
        return _earned; 
    }

    // calculate the rewards per token
    function rewardPerToken() public view returns(uint256) {
        if (_totalSupply == 0) {
            return _rewardPerTokenStored;
        }

        return _rewardPerTokenStored + (((block.timestamp - _lastUpdateTime) * _rewardRate * 1e18)/_totalSupply);
    }

    // staking function
    function stake(uint amount) public updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0 tokens");
        require(_FDAToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
        // keep track of how much this user has staked
        // keep track of how much token we have total
        // transfer the token to this contract
        _balances[msg.sender] += amount;
        _totalSupply += amount;

       bool success = _FDAToken.transferFrom(msg.sender, address(this), amount);
       require(success, "Transfer failed");
    }

    // withdraw function
    function withdraw(uint256 amount) public updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0 tokens");
        _balances[msg.sender] -= amount;
        _totalSupply -= amount;

        bool success = _FDAToken.transfer(msg.sender, amount);
        require(success, "Transfer failed");
    }

    // claim the rewards function
    function claimReward() public updateReward(msg.sender) {
        // 100 reward tokens per second
        uint reward = _rewards[msg.sender];
        bool success = _FDAReward.transfer(msg.sender, reward);
        require(success, "Transfer failed");
    }
}