import { expect } from "chai";
import { ethers } from "hardhat";
import { LandRegistry } from "../typechain-types";

describe("LandRegistry", function () {
    let yourContract: LandRegistry;
    before(async () => {
        const [owner] = await ethers.getSigners();
        const yourContractFactory = await ethers.getContractFactory("LandRegistry");
        yourContract = (await yourContractFactory.deploy(owner.address)) as LandRegistry;
        await yourContract.waitForDeployment();
    });

    describe("Deploiement du contrat", function () {
        it("Le message de deploiement apparait", async function () {
            expect("Building Unstoppable Apps!!!").to.equal("Building Unstoppable Apps!!!");
        });
    });
});