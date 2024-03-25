const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  const INITIAL_BALANCE = ethers.parseEther("1000000");
  
  describe("FDAToken", function () {
    async function deploy() {
      const [account1, account2, account3] = await ethers.getSigners();
  
      const FDAToken = await ethers.getContractFactory("FDAToken");
      const cFDAToken = await FDAToken.deploy(INITIAL_BALANCE, account1);
  
      return { cFDAToken, account1, account2, account3 };
    }
  
    describe("Staking", function () {
      it("should call constructor", async function () {
        const { cFDAToken, account1 } = await loadFixture(deploy);
        const balance = await cFDAToken.balanceOf(account1.address);
        expect(balance).to.be.eq(INITIAL_BALANCE);
        expect(cFDAToken).not.to.be.undefined;
      });
  
      it("should be able to mint", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
        const amount = ethers.parseEther("100");
        await cFDAToken["mint"](account2.address, amount);
        const balance = await cFDAToken.balanceOf(account2);
        expect(balance).to.be.eq(amount);
      });
  
      it("should be able to stake", async function () {
        const { cFDAToken, account1 } = await loadFixture(deploy);
        const amount = ethers.parseEther("100");
        // await cFDAToken["mint"](account2.address, amount);
        await cFDAToken.connect(account1).stake(amount);
  
        const balance = await cFDAToken.balanceOf(account1.address);
        expect(balance).to.be.eq(INITIAL_BALANCE - amount);
      });
  
      it("should be able to get current rewards", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
  
        const amount = ethers.parseEther("100");
        await cFDAToken["mint"](account2.address, amount);
  
        await cFDAToken.connect(account2).stake(amount);
  
        const ONE_HOUR_IN_SEC = 60 * 60;
        const unlockTime = (await time.latest()) + ONE_HOUR_IN_SEC;
  
        await time.increaseTo(unlockTime);
  
        const rewards = await cFDAToken.getCurrentRewards(account2.address);
  
        expect(rewards).to.be.greaterThan(ethers.parseEther("0"));
        //   console.log("current rewards", rewards);
      });
  
      it("should be able to claim rewards", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
  
        const amount = ethers.parseEther("100");
        await cFDAToken["mint"](account2.address, amount);
  
        await cFDAToken.connect(account2).stake(amount);
  
        const ONE_HOUR_IN_SEC = 60 * 60;
        const unlockTime = (await time.latest()) + ONE_HOUR_IN_SEC;
  
        await time.increaseTo(unlockTime);
  
        await cFDAToken.connect(account2).withdraw();
  
        const balance = await cFDAToken.balanceOf(account2);
        //   console.log("balance", balance);
      });
  
      it("Should not allow withdrawing if no tokens are staked", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
        await expect(cFDAToken.connect(account2).withdraw()).to.be.revertedWith("No staked tokens");
      });
      
      it("Should not allow staking more tokens than the balance", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
        await expect(cFDAToken.connect(account2).stake(2000000)).to.be.revertedWith("Insufficient balance");
      });

      it("Should not allow staking more than one time", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
        const amount = ethers.parseEther("100");
        await cFDAToken["mint"](account2.address, amount);
        await cFDAToken.connect(account2).stake(amount);

        await cFDAToken["mint"](account2.address, amount);
        await expect(cFDAToken.connect(account2).stake(amount)).to.be.revertedWith("Already staked");
      });

      it("should not allow withdrawing before 2 minutes", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
        const amount = ethers.parseEther("100");
        await cFDAToken["mint"](account2.address, amount);
        await cFDAToken.connect(account2).stake(amount);

        await expect(cFDAToken.connect(account2).withdraw()).to.be.revertedWith("Withdrawal period is not reached yet");        
      });

      it("should be able to withdraw after 2 minutes", async function () {
        const { cFDAToken, account2 } = await loadFixture(deploy);
  
        const amount = ethers.parseEther("100");
        await cFDAToken["mint"](account2.address, amount);
  
        await cFDAToken.connect(account2).stake(amount);
  
        const TWO_MIN_IN_SEC = 2 * 60;
        const unlockTime = (await time.latest()) + TWO_MIN_IN_SEC;
  
        await time.increaseTo(unlockTime);
  
        await cFDAToken.connect(account2).withdraw();
  
        const balance = await cFDAToken.balanceOf(account2);
        console.log("balance", balance);
      });
    });
  });