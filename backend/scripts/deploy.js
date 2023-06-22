async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();

  console.log("Account balance:", await ethers.utils.formatEther(weiAmount));

  //chainlink sepolia
  const subscriptionId = 2802;
  const gweiKeyHash =
    "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
  const callbackGasLimit = 500000;
  const VRFCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";

  const Contract = await ethers.getContractFactory("HeadOrTailGame");

  const depositAmount = ethers.utils.parseUnits("0.2", "ether");

  const contract = await Contract.deploy(
    subscriptionId,
    gweiKeyHash,
    callbackGasLimit,
    VRFCoordinator
  );

  // Send Ether to the contract
  /*const transaction = await deployer.sendTransaction({
    to: contract.address,
    value: depositAmount.toString(),
  });
  await transaction.wait();*/

  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
