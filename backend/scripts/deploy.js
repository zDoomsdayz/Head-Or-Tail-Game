//chainlink configuration
function getSepoliaConfig() {
  return {
    SubscriptionId: 2802,
    GweiKeyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    CallbackGasLimit: 500000,
    VRFCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
  };
}

function getMaticMumbaiConfig() {
  return {
    SubscriptionId: 5316,
    GweiKeyHash:
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    CallbackGasLimit: 500000,
    VRFCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
  };
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();

  console.log("Account balance:", await ethers.utils.formatEther(weiAmount));

  const selectedNetwork = getSepoliaConfig();
  const Contract = await ethers.getContractFactory("HeadOrTailGame");

  const depositAmount = ethers.utils.parseUnits("0.2", "ether");

  const contract = await Contract.deploy(
    selectedNetwork.SubscriptionId,
    selectedNetwork.GweiKeyHash,
    selectedNetwork.CallbackGasLimit,
    selectedNetwork.VRFCoordinator
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
