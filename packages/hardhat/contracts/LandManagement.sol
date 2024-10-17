// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; // Import the Counters library

contract LandManagement is ERC721, AccessControl {
	using Counters for Counters.Counter; // Apply Counters library to Counter
	Counters.Counter internal _tokenIds; // Declare token counter

	struct Land {
		uint256 id;
		string num;
		string nom;
		string surface;
		string surf_reel;
		string geometry;
		uint256 price;
		bool isForSale;
		address payable seller;
	}

	mapping(uint256 => Land) public lands;

	constructor() ERC721("LandRegistry", "LAND") {}

	function supportsInterface(
		bytes4 interfaceId
	) public view virtual override(ERC721, AccessControl) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	// Mint function to create new land NFTs
	function mintLandNFT(
		address recipient,
		string memory num,
		string memory nom,
		string memory surface,
		string memory surf_reel,
		string memory geometry,
		uint256 price
	) public returns (uint256) {
		_tokenIds.increment(); // Increment token ID
		uint256 newItemId = _tokenIds.current(); // Get the current token ID

		_mint(recipient, newItemId); // Mint the new token

		lands[newItemId] = Land({
			id: newItemId,
			num: num,
			nom: nom,
			surface: surface,
			surf_reel: surf_reel,
			geometry: geometry,
			price: price,
			isForSale: true,
			seller: payable(recipient)
		});

		return newItemId;
	}

	// Function to retrieve land details using tokenId
	function getLandDetails(uint256 tokenId) public view returns (Land memory) {
		require(_exists(tokenId), "Land does not exist");
		return lands[tokenId];
	}

	// Retrieve all lands currently for sale
	function getLandsForSale() public view returns (Land[] memory) {
		uint256 totalLands = _tokenIds.current();
		uint256 count = 0;

		for (uint256 i = 1; i <= totalLands; i++) {
			if (lands[i].isForSale) {
				count++;
			}
		}

		Land[] memory landsForSale = new Land[](count);
		uint256 index = 0;

		for (uint256 i = 1; i <= totalLands; i++) {
			if (lands[i].isForSale) {
				landsForSale[index] = lands[i];
				index++;
			}
		}

		return landsForSale;
	}

	// Events
	function uintToString(uint v) internal pure returns (string memory) {
		if (v == 0) {
			return "0";
		}
		uint maxlength = 100;
		bytes memory reversed = new bytes(maxlength);
		uint i = 0;
		while (v != 0) {
			uint remainder = v % 10;
			v = v / 10;
			reversed[i++] = bytes1(uint8(48 + remainder));
		}
		bytes memory s = new bytes(i); // Copying bytes to the correct size
		for (uint j = 0; j < i; j++) {
			s[j] = reversed[i - j - 1]; // Reversing the string
		}
		return string(s);
	}

	// Function to divide an existing land NFT into smaller ones
	function divideLandNFT(
		uint256 landId,
		string[] memory newGeometries,
		address[] memory newOwners
	) public {
		require(
			ownerOf(landId) == msg.sender,
			"Only the owner can divide the land"
		);
		require(
			newGeometries.length == newOwners.length,
			"Mismatch between new geometries and owners"
		);

		// Mint new NFTs for each divided portion
		for (uint256 i = 0; i < newGeometries.length; i++) {
			_tokenIds.increment();
			uint256 newItemId = _tokenIds.current();

			// Mint a new land NFT for each portion
			_mint(newOwners[i], newItemId);

			// Ensure the new token has been minted before performing any operations
			require(_exists(newItemId), "New token does not exist");

			string memory iString = uintToString(i + 1);

			// Update the land data with the new geometries
			string memory num = string(abi.encodePacked("-", iString));
			lands[newItemId] = Land(
				newItemId,
				string(abi.encodePacked(lands[landId].num, num)), // Retain original details if needed
				string(abi.encodePacked(lands[landId].nom, num)),
				lands[landId].surface,
				lands[landId].surf_reel,
				newGeometries[i], // New geometry for the divided plot
				lands[landId].price, // You can adjust price as needed,
				false,
				payable(newOwners[i])
			);
		}

		// Retire the original NFT (optional: you can burn it or leave it)
		_burn(landId);
	}

	// Retrieve all lands owned by an account
	function getLandsOfAccount(
		address owner
	) public view returns (Land[] memory) {
		uint256 totalLands = _tokenIds.current();
		uint256 count = 0;

		// First pass: count how many lands the owner has
		for (uint256 i = 1; i <= totalLands; i++) {
			if (_exists(i) && ownerOf(i) == owner) {
				count++;
			}
		}

		// Create an array with the correct size
		Land[] memory result = new Land[](count);
		uint256 index = 0;

		// Second pass: add the lands owned by the account
		for (uint256 i = 1; i <= totalLands; i++) {
			if (_exists(i) && ownerOf(i) == owner) {
				result[index] = lands[i];
				index++;
			}
		}

		return result;
	}
}
