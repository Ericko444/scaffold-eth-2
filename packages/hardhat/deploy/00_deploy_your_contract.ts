import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: ["0x1a98EbD96CDB77A8Ea6cE8Bc3EcCd3B449712c7B"],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  await yourContract.transferOwnership("0x1a98EbD96CDB77A8Ea6cE8Bc3EcCd3B449712c7B");
  // console.log("👋 Initial greeting:", await yourContract.greeting());
  const tx = await yourContract.mintLandNFT(
    "0x7214676FDD352c1f251EB28251311F592ac335d6",
    "T7260P(2)",   // num
    "MAHASOAVA",   // nom
    "0.24245910533199999", // surface as a string
    "0,2994",       // surf_reel
    ethers.parseEther("1.0")
  );
  await tx.wait();
  console.log("Minted land NFT");

  const tx2 = await yourContract.mintLandNFT(
    "0x93D8857DE05987a87549114594030F7812B7826f",
    "A4563P(5)",   // num
    "RAHARIJAONA", // nom
    "0.3121345231234", // surface as a string
    "0,3512",       // surf_reel
    ethers.parseEther("1.5")
  );
  await tx2.wait();
  console.log("Minted second land NFT to owner2");

  const tx3 = await yourContract.mintLandNFT(
    "0x93D8857DE05987a87549114594030F7812B7826f",
    "A4563P(5) - 2",   // num
    "RAHARIJAONA", // nom
    "0.3121345231234", // surface as a string
    "0,3512",       // surf_reel
    ethers.parseEther("1.5")
  );
  await tx3.wait();
  console.log("Minted second land NFT to owner2");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
