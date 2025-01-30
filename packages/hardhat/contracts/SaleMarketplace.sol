// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./LandManagement.sol"; // Import the contract to interact with Land data

contract SaleMarketplace is LandManagement {
	event LandListedForSale(
		uint256 indexed tokenId,
		address indexed seller,
		uint256 price
	);
	event LandUnlisted(uint256 indexed tokenId, address indexed seller);
	event LandSold(
		uint256 indexed tokenId,
		address indexed seller,
		address indexed buyer,
		uint256 price
	);

	// Function to list land for sale
	function listLandForSale(uint256 tokenId, uint256 salePrice) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"Only the owner can list the land for sale"
		);
		require(!lands[tokenId].isForSale, "Land is already listed for sale");
		require(salePrice > 0, "Sale price must be greater than zero");

		lands[tokenId].isForSale = true;
		lands[tokenId].price = salePrice;
		lands[tokenId].seller = payable(msg.sender);

		emit LandListedForSale(tokenId, msg.sender, salePrice);
	}

	// Function to unlist land from sale
	function unlistLand(uint256 tokenId) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"Only the owner can unlist the land"
		);
		require(lands[tokenId].isForSale, "Land is not listed for sale");

		lands[tokenId].isForSale = false;
		lands[tokenId].seller = payable(msg.sender);

		emit LandUnlisted(tokenId, msg.sender);
	}

	// Function to purchase land
	function purchaseLand(uint256 tokenId) public payable {
		require(lands[tokenId].isForSale, "Land is not listed for sale");
		address seller = lands[tokenId].seller;
		require(msg.sender != seller, "Seller cannot buy their own land");
		require(
			msg.value >= lands[tokenId].price,
			"Insufficient funds to purchase the land"
		);

		uint256 salePrice = lands[tokenId].price;

		// Transfer the ownership of the land
		_transfer(seller, msg.sender, tokenId);

		// Mark land as no longer for sale
		lands[tokenId].isForSale = false;
		lands[tokenId].seller = payable(msg.sender);

		// Transfer the sale price to the seller
		(bool success, ) = seller.call{ value: salePrice }("");
		require(success, "Transfer to seller failed");

		emit LandSold(tokenId, seller, msg.sender, salePrice);
	}
}
