const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('HeadTail', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('HeadOrTailGame');
    const contract = await Game.deploy();

    const [owner, tempAddr1] = await ethers.getSigners();

    const depositAmount = ethers.utils.parseUnits("1", "ether");
    await contract.topUpBalance({value: depositAmount});

    console.log('Signer 1 address: ', owner.address);
    return { contract, owner, tempAddr1 };
  }

  it('should deploy and set the balance', async function () {
    const { contract, owner } = await loadFixture(deployContractAndSetVariables);
    const depositAmount = ethers.utils.parseUnits("1", "ether");
    await contract.topUpBalance({value: depositAmount});
    expect(await contract.getBalance()).to.equal(ethers.utils.parseUnits("2", "ether"));
  });

  it('should not allow others to change rtp', async function () {
    const { contract, tempAddr1 } = await loadFixture(deployContractAndSetVariables);

    await expect(contract.connect(tempAddr1).setRtp(10)).to.be.reverted;
  });

  it('should allow owner to change rtp', async function () {
    const { contract } = await loadFixture(deployContractAndSetVariables);
    await contract.setRtp(10)
    const newRTP = await contract.getRtp()
    expect(newRTP.toString()).to.equal('10');
  });

  it('should win or lose', async function () {
    const { contract, tempAddr1 } = await loadFixture(deployContractAndSetVariables);
    const before = await ethers.provider.getBalance(tempAddr1.address);
    const cost = ethers.utils.parseUnits("0.01", "ether");
    const tx = await contract.connect(tempAddr1).play(true,{value: cost})
    const after = await ethers.provider.getBalance(tempAddr1.address);
    const receipt = await tx.wait()

    for (const event of receipt.events) {
      console.log(`is winner ${event.args.isWinner}`);
    }

    /*let win = 0;
    let lose = 0;
    for(let i = 0; i < 1000; i++) {
      const test = await contract.connect(tempAddr1).play(true,{value: cost});
      const receipt = await test.wait()

      for (const event of receipt.events) {
        event.args.isWinner ? win++ : lose++;
        console.log("Win:", win, "Lose", lose);
      }
    }*/

    expect(before).to.not.equal(after);
  });

  it('should able to bet 0.02', async function () {
    const { contract, tempAddr1 } = await loadFixture(deployContractAndSetVariables);
    const before = await ethers.provider.getBalance(tempAddr1.address);
    const cost = ethers.utils.parseUnits("0.02", "ether");
    const tx = await contract.connect(tempAddr1).play(true,{value: cost})
    const after = await ethers.provider.getBalance(tempAddr1.address);
    const receipt = await tx.wait()

    expect(before).to.not.equal(after);
  });

  it('should able to reject 0.025', async function () {
    const { contract, tempAddr1 } = await loadFixture(deployContractAndSetVariables);
    const before = await ethers.provider.getBalance(tempAddr1.address);
    const cost = ethers.utils.parseUnits("0.02", "ether");
    const tx = await contract.connect(tempAddr1).play(true,{value: cost})
    const after = await ethers.provider.getBalance(tempAddr1.address);
    const receipt = await tx.wait()

    expect(tx).to.be.reverted;
  });
});