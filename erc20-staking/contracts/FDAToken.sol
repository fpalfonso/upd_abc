// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FDAToken is ERC20, Ownable {
    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _lastStakeTimestamp;
    mapping(address => uint256) private withdrawalDeadline;
    uint256 private _rewardRate = 100;
    bool public completed = false;

    // events
    event Staked(address indexed user, uint256 indexed amount);
    event WithdrewStake(address indexed user, uint256 indexed amount);

    modifier withdrawalDeadlineReached( bool requireReached ) {
        uint256 timeRemaining = withdrawalTimeLeft();
        if( requireReached ) {
            require(timeRemaining == 0, "Withdrawal period is not reached yet");
        } else {
            require(timeRemaining > 0, "Withdrawal period has been reached");
        }
        _;
    }

    constructor(
        uint256 initialSupply,
        address initialOwner
    ) ERC20("FDAToken", "FDA") Ownable(initialOwner) {
        _mint(initialOwner, initialSupply);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function stake(uint256 amount) public {
        if (completed) { revert("Already staked"); }

        withdrawalDeadline[msg.sender] = block.timestamp + 120 seconds;

        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _stakes[msg.sender] += amount;
        _lastStakeTimestamp[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
        _transfer(msg.sender, address(this), amount);
        completed = true;
    }

    function withdraw() public withdrawalDeadlineReached(true)  {
        require(_stakes[msg.sender] > 0, "No staked tokens");

        uint256 stakedAmount = _stakes[msg.sender];
        uint256 reward = (block.timestamp - _lastStakeTimestamp[msg.sender]) *
            _rewardRate;

        _stakes[msg.sender] = 0;
        emit WithdrewStake(msg.sender, reward+stakedAmount);
        _transfer(address(this), msg.sender, stakedAmount);
        _mint(msg.sender, reward);
        completed = false;
    }

    function getStake(address account) public view returns (uint256) {
        return _stakes[account];
    }

    function getCurrentRewards(address account) public view returns (uint256) {
        uint256 reward = (block.timestamp - _lastStakeTimestamp[account]) *
            _rewardRate;
        return reward;
    }

    function getLastStakeTimestamp(address account) public view returns (uint256) {
        return _lastStakeTimestamp[account];
    }

    function withdrawalTimeLeft() public view returns (uint256 _withdrawalTimeLeft) {
        if( block.timestamp >= withdrawalDeadline[msg.sender]) {
            return (0);
        } else {
            return (withdrawalDeadline[msg.sender] - block.timestamp);
        }
    }

}