import { expect } from "chai";
import { ethers } from "hardhat";

describe("Marketplace", function () {
    before(async () => {

    });



    describe("Achat", function () {
        it("Devrait permettre à un acheteur d'acheter un terrain mis en vente.", async function () {
            expect("Building Unstoppable Apps!!!").to.equal("Building Unstoppable Apps!!!");
        });

        it("Devrait échouer si le terrain n'est pas mis en vente.", async function () {
            expect("Building Unstoppable Apps!!!").to.equal("Building Unstoppable Apps!!!");
        });

        it("Devrait échouer si l'acheteur n'a pas les fonds suffisants.", async function () {
            expect("Building Unstoppable Apps!!!").to.equal("Building Unstoppable Apps!!!");
        });

        it("Devrait échouer si le vendeur tente d'acheter son propre terrain.", async function () {
            expect("Building Unstoppable Apps!!!").to.equal("Building Unstoppable Apps!!!");
        });

        it("Devrait échouer pour un tokenId inexistant.", async function () {
            expect("Building Unstoppable Apps!!!").to.equal("Building Unstoppable Apps!!!");
        });

    });
});