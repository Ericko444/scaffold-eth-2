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
    "0x744D70747E0337D0C68d63Fc82B1562525cE35fA",
    "T7260P(2)",   // num
    "MAHASOAVA",   // nom
    "0.24245910533199999", // surface as a string
    "0,2994",       // surf_reel
    `"geometry": {"type": "Polygon","coordinates": [[[47.05264176331643,-19.887306227883506],[47.052678202427657,-19.887375899879981],[47.052463495690908,-19.887598356504579],[47.052161210154118,-19.887544256622991],[47.052133721432547,-19.887621396699188],[47.052010594036986,-19.887582133935556],[47.051938055272856,-19.887530378549304],[47.051873797148033,-19.887455298238329],[47.051872654977601,-19.887453963705603],[47.052063758270762,-19.887487516753712],[47.052238091051848,-19.887373504257479],[47.052238375119437,-19.887373318478904],[47.052210762287487,-19.887282477012626],[47.052210531903704,-19.887281719089234],[47.05236664737469,-19.887022535828972],[47.052377329339386,-19.886992994503132],[47.052501316775661,-19.887103773349637],[47.052570879762719,-19.887255096421462],[47.05264176331643,-19.887306227883506]]]}`,
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
    `"geometry": {"type": "Polygon","coordinates": [[[47.052377329339386,-19.886992994503132],[47.05236664737469,-19.887022535828972],[47.052210531903704,-19.887281719089234],[47.052210762287487,-19.887282477012626],[47.052238375119437,-19.887373318478904],[47.052238091051848,-19.887373504257479],[47.052063758270762,-19.887487516753712],[47.051872654977601,-19.887453963705603],[47.051827816349757,-19.887456856149853],[47.05169194816915,-19.887486025950764],[47.051692595538462,-19.887414628533875],[47.051707091222156,-19.887241531222298],[47.051572855960259,-19.887088674289842],[47.0515194106816,-19.886993817811398],[47.051447631080237,-19.886814742718535],[47.05149132072431,-19.886837903592866],[47.051533180629981,-19.886878106518328],[47.052198128306387,-19.886628234972719],[47.052271801607823,-19.886692643144208],[47.052325057559223,-19.886815014991164],[47.052369920934318,-19.886938550680622],[47.052377329339386,-19.886992994503132]]]}`,
    ethers.parseEther("1.5")
  );
  await tx2.wait();
  console.log("Minted second land NFT to owner2");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
