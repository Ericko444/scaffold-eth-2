//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */

/* TODO : 
	Exchange The owner1 is the requester, and should notify the owner2, if the owner2 approve the exchange, then it will go to the notary for approval
	The transaction is finalized after the execution of the exchange
	Request owner 2 => Owner2 approval => Notary approval => Execution
 */
contract YourContract is Ownable, ERC721, AccessControl, ReentrancyGuard {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	// Define the notary role
	bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");

	struct Land {
		uint256 id;
		string num;
		string nom;
		string surface;
		string surf_reel;
		string geometry; // New: Store the geometry (coordinates) as a string or URI
		uint256 price;
	}

	struct PendingExchange {
		uint256 landId1;
		uint256 landId2;
		address owner1;
		address owner2;
		uint256 priceDifference;
		bool isApproved;
	}

	struct PendingDivision {
		uint256 originalLandId;
		string[] newGeometries;
		address[] newOwners;
		bool isApproved;
	}

	mapping(uint256 => Land) public lands;
	mapping(uint256 => PendingExchange) public pendingExchanges;
	mapping(uint256 => PendingDivision) public pendingDivisions;

	uint256 private exchangeCounter;
	uint256 private divisionRequestCounter;

	constructor(address notary) ERC721("LandRegistry", "LAND") {
		// Grant the notary role to the provided address
		_setupRole(NOTARY_ROLE, notary);
	}

	// Override supportsInterface to resolve multiple inheritance issue
	function supportsInterface(
		bytes4 interfaceId
	) public view virtual override(ERC721, AccessControl) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	// Mint a new land NFT with a set price
	function mintLandNFT(
		address recipient,
		string memory num,
		string memory nom,
		string memory surface,
		string memory surf_reel,
		string memory geometry, // New: Geometry field for coordinates
		uint256 price
	) public returns (uint256) {
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();

		_mint(recipient, newItemId);

		lands[newItemId] = Land(
			newItemId,
			num,
			nom,
			surface,
			surf_reel,
			geometry,
			price
		);

		return newItemId;
	}

	// Get land details
	function getLandDetails(uint256 tokenId) public view returns (Land memory) {
		require(_exists(tokenId), "Land does not exist");
		return lands[tokenId];
	}

	// Allow the owner to set or update the price of the land
	function setPrice(uint256 tokenId, uint256 newPrice) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"Only the owner can set the price"
		);
		lands[tokenId].price = newPrice;
	}

	// Request land exchange between two owners (to be approved by the notary)
	function requestExchange(uint256 landId1, uint256 landId2) public {
		address owner1 = ownerOf(landId1);
		address owner2 = ownerOf(landId2);

		require(
			msg.sender == owner1 || msg.sender == owner2,
			"You are not authorized to initiate the exchange"
		);
		require(owner1 != owner2, "Both lands are owned by the same person");

		uint256 price1 = lands[landId1].price;
		uint256 price2 = lands[landId2].price;

		uint256 priceDifference = (price1 > price2)
			? (price1 - price2)
			: (price2 - price1);

		// Create a pending exchange record
		exchangeCounter++;
		pendingExchanges[exchangeCounter] = PendingExchange({
			landId1: landId1,
			landId2: landId2,
			owner1: owner1,
			owner2: owner2,
			priceDifference: priceDifference,
			isApproved: false
		});

		// Emit event for exchange request (optional)
		emit ExchangeRequested(
			exchangeCounter,
			owner1,
			owner2,
			priceDifference
		);
	}

	// Notary approves the land exchange
	function approveExchange(uint256 exchangeId) public onlyRole(NOTARY_ROLE) {
		PendingExchange storage exchange = pendingExchanges[exchangeId];
		require(!exchange.isApproved, "Exchange has already been approved");

		// Mark the exchange as approved
		exchange.isApproved = true;

		// Emit event for approval (optional)
		emit ExchangeApproved(exchangeId);
	}

	// Execute the approved exchange (only callable after notary approval)
	function executeExchange(uint256 exchangeId) public payable nonReentrant {
		PendingExchange storage exchange = pendingExchanges[exchangeId];
		require(
			exchange.isApproved,
			"Exchange has not been approved by the notary"
		);

		address owner1 = exchange.owner1;
		address owner2 = exchange.owner2;

		uint256 landId1 = exchange.landId1;
		uint256 landId2 = exchange.landId2;

		uint256 price1 = lands[landId1].price;
		uint256 price2 = lands[landId2].price;

		if (price1 > price2) {
			require(
				msg.value >= exchange.priceDifference,
				"Insufficient Ether sent to balance the exchange"
			);

			// Transfer ownership of the land NFTs
			_transfer(owner1, owner2, landId1);
			_transfer(owner2, owner1, landId2);

			// Pay the price difference to the owner of the more expensive land
			payable(owner1).transfer(exchange.priceDifference);
		} else if (price2 > price1) {
			require(
				msg.value >= exchange.priceDifference,
				"Insufficient Ether sent to balance the exchange"
			);

			// Transfer ownership of the land NFTs
			_transfer(owner1, owner2, landId1);
			_transfer(owner2, owner1, landId2);

			// Pay the price difference to the owner of the more expensive land
			payable(owner2).transfer(exchange.priceDifference);
		} else {
			// If prices are equal, just exchange the lands
			_transfer(owner1, owner2, landId1);
			_transfer(owner2, owner1, landId2);
		}

		// Emit event for exchange execution (optional)
		emit ExchangeExecuted(exchangeId, owner1, owner2);
	}

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

		// Retire the original NFT (optional: you can burn it or leave it)
		_burn(landId);

		// Mint new NFTs for each divided portion
		for (uint256 i = 0; i < newGeometries.length; i++) {
			_tokenIds.increment();
			uint256 newItemId = _tokenIds.current();

			// Mint a new land NFT for each portion
			_mint(newOwners[i], newItemId);

			string memory iString = uintToString(i);

			// Update the land data with the new geometries
			lands[newItemId] = Land(
				newItemId,
				string(abi.encodePacked(lands[landId].num, iString)), // Retain original details if needed
				string(abi.encodePacked(lands[landId].nom, iString)),
				lands[landId].surface,
				lands[landId].surf_reel,
				newGeometries[i], // New geometry for the divided plot
				lands[landId].price // You can adjust price as needed
			);
		}
	}

	// Request division of an existing land NFT
	function requestLandDivision(
		uint256 landId,
		string[] memory newGeometries,
		address[] memory newOwners
	) public {
		require(
			ownerOf(landId) == msg.sender,
			"Only the owner can request a division"
		);
		require(
			newGeometries.length == newOwners.length,
			"Mismatch between new geometries and owners"
		);

		// Create a new pending division request
		divisionRequestCounter++;
		pendingDivisions[divisionRequestCounter] = PendingDivision({
			originalLandId: landId,
			newGeometries: newGeometries,
			newOwners: newOwners,
			isApproved: false
		});

		// Emit an event for division request (optional)
		emit DivisionRequested(divisionRequestCounter, msg.sender, landId);
	}

	// Notary approves the land division request
	function approveDivision(uint256 divisionId) public onlyRole(NOTARY_ROLE) {
		PendingDivision storage division = pendingDivisions[divisionId];
		require(!division.isApproved, "Division has already been approved");

		// Mark the division as approved
		division.isApproved = true;

		// Emit an event for division approval (optional)
		emit DivisionApproved(divisionId);
	}

	// Execute the approved land division
	function executeDivision(uint256 divisionId) public {
		PendingDivision storage division = pendingDivisions[divisionId];
		require(
			division.isApproved,
			"Division has not been approved by the notary"
		);

		uint256 originalLandId = division.originalLandId;
		string[] memory newGeometries = division.newGeometries;
		address[] memory newOwners = division.newOwners;

		// Burn the original NFT (optional: based on logic, you can also leave it untouched)
		_burn(originalLandId);

		// Mint new NFTs for each divided portion
		for (uint256 i = 0; i < newGeometries.length; i++) {
			_tokenIds.increment();
			uint256 newItemId = _tokenIds.current();

			// Mint a new land NFT for each divided portion
			_mint(newOwners[i], newItemId);

			// Update the land data with the new geometries
			lands[newItemId] = Land(
				newItemId,
				lands[originalLandId].num, // Retain original details if needed
				lands[originalLandId].nom,
				lands[originalLandId].surface,
				lands[originalLandId].surf_reel,
				newGeometries[i], // New geometry for the divided plot
				lands[originalLandId].price // You can adjust price as needed
			);
		}

		// Emit an event for division execution (optional)
		emit DivisionExecuted(divisionId, msg.sender);
	}

	// Events (optional)
	event ExchangeRequested(
		uint256 exchangeId,
		address indexed owner1,
		address indexed owner2,
		uint256 priceDifference
	);
	event ExchangeApproved(uint256 exchangeId);
	event ExchangeExecuted(
		uint256 exchangeId,
		address indexed owner1,
		address indexed owner2
	);
	event DivisionRequested(
		uint256 divisionId,
		address indexed requester,
		uint256 landId
	);
	event DivisionApproved(uint256 divisionId);
	event DivisionExecuted(uint256 divisionId, address indexed executor);
}
