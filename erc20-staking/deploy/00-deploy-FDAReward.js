module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const FDAReward = await deploy("FDAReward", {
        from: deployer,
        args: [],
        log: true,
    })
}

module.exports.tags = ["all", "FDAReward"]