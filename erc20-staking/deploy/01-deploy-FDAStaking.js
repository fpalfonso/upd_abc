const { ethers } = require("hardhat")

module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const FDAReward = await deployments.get("FDAReward")
    
    const FDAStaking = await deploy("FDAStaking", {
        from: deployer,
        args: [FDAReward.address, FDAReward.address],
        log: true,
    })
}

module.exports.tags = ["all", "FDAStaking"]