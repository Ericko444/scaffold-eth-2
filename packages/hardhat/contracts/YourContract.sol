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

	struct ExchangeRequest {
		uint256 id; // The unique ID of the exchange request
		uint256 landId1;
		uint256 landId2;
		address owner1;
		address owner2;
		uint8 payerIndex; // Index of the payer (1 for owner1, 2 for owner2)
		uint256 priceDifference;
		bool isAcceptedBySecondOwner;
		bool isApprovedByNotary;
	}

	struct PendingDivision {
		uint256 originalLandId;
		string[] newGeometries;
		address[] newOwners;
		bool isApproved;
	}

	mapping(uint256 => Land) public lands;
	mapping(uint256 => ExchangeRequest) public exchangeRequests;
	uint256 private exchangeRequestCounter;
	mapping(uint256 => PendingDivision) public pendingDivisions;
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

	// Retrieve all lands owned by an account
	function getLandsOfAccount(
		address owner
	) public view returns (Land[] memory) {
		uint256 totalLands = _tokenIds.current();
		uint256 count = 0;

		// First pass: count how many lands the owner has
		for (uint256 i = 1; i <= totalLands; i++) {
			if (ownerOf(i) == owner) {
				count++;
			}
		}

		// Create an array with the correct size
		Land[] memory result = new Land[](count);
		uint256 index = 0;

		// Second pass: add the lands owned by the account
		for (uint256 i = 1; i <= totalLands; i++) {
			if (ownerOf(i) == owner) {
				result[index] = lands[i];
				index++;
			}
		}

		return result;
	}

	function getLandsNotOwnedByAccount(
		address owner
	) public view returns (Land[] memory) {
		uint256 totalLands = _tokenIds.current();
		uint256 count = 0;

		// First pass: count how many lands are not owned by the account
		for (uint256 i = 1; i <= totalLands; i++) {
			if (ownerOf(i) != owner) {
				count++;
			}
		}

		// Create an array with the correct size
		Land[] memory result = new Land[](count);
		uint256 index = 0;

		// Second pass: add the lands not owned by the account
		for (uint256 i = 1; i <= totalLands; i++) {
			if (ownerOf(i) != owner) {
				result[index] = lands[i];
				index++;
			}
		}

		return result;
	}

	// Allow the owner to set or update the price of the land
	function setPrice(uint256 tokenId, uint256 newPrice) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"Only the owner can set the price"
		);
		lands[tokenId].price = newPrice;
	}

	// Request a land exchange between two owners
	function requestExchange(uint256 landId1, uint256 landId2) public {
		address owner1 = ownerOf(landId1);
		address owner2 = ownerOf(landId2);

		require(
			msg.sender == owner1,
			"Only the owner of land 1 can request the exchange"
		);
		require(owner1 != owner2, "Both lands are owned by the same person");

		uint256 price1 = lands[landId1].price;
		uint256 price2 = lands[landId2].price;

		// Determine the price difference and who pays (1 for owner1, 2 for owner2)
		uint8 payerIndex;
		uint256 priceDifference;
		if (price1 > price2) {
			priceDifference = price1 - price2;
			payerIndex = 2; // Owner 2 pays the difference
		} else if (price2 > price1) {
			priceDifference = price2 - price1;
			payerIndex = 1; // Owner 1 pays the difference
		} else {
			priceDifference = 0;
			payerIndex = 0; // No payment needed if prices are the same
		}

		// Create a new exchange request
		exchangeRequestCounter++;
		exchangeRequests[exchangeRequestCounter] = ExchangeRequest({
			id: exchangeRequestCounter,
			landId1: landId1,
			landId2: landId2,
			owner1: owner1,
			owner2: owner2,
			payerIndex: payerIndex, // Store payer index (1 or 2)
			priceDifference: priceDifference,
			isAcceptedBySecondOwner: false,
			isApprovedByNotary: false
		});

		emit ExchangeRequested(
			exchangeRequestCounter,
			owner1,
			owner2,
			priceDifference,
			payerIndex
		);
	}

	// The second owner accepts the exchange request
	function acceptExchange(uint256 exchangeId) public {
		ExchangeRequest storage request = exchangeRequests[exchangeId];
		require(
			msg.sender == request.owner2,
			"Only the second owner can accept the exchange"
		);

		request.isAcceptedBySecondOwner = true;

		emit ExchangeAccepted(exchangeId, request.owner1, request.owner2);
	}

	// The notary approves the exchange request
	function approveExchange(
		uint256 exchangeId
	) public payable onlyRole(NOTARY_ROLE) {
		ExchangeRequest storage request = exchangeRequests[exchangeId];
		require(
			request.isAcceptedBySecondOwner,
			"The second owner must accept the exchange before notary approval"
		);

		uint value = msg.value;

		request.isApprovedByNotary = true;

		emit ExchangeApproved(exchangeId);

		// Execute the exchange
		executeExchange(exchangeId, value);
	}

	// Execute the approved land exchange
	function executeExchange(
		uint256 exchangeId,
		uint value
	) internal nonReentrant {
		ExchangeRequest storage request = exchangeRequests[exchangeId];
		require(
			request.isApprovedByNotary,
			"The notary must approve the exchange"
		);

		address owner1 = request.owner1;
		address owner2 = request.owner2;
		uint8 payerIndex = request.payerIndex;

		uint256 landId1 = request.landId1;
		uint256 landId2 = request.landId2;

		// If there is a price difference, the payer must cover it
		if (request.priceDifference > 0) {
			if (payerIndex == 1) {
				// Owner 1 pays the difference
				require(
					value >= request.priceDifference,
					"Insufficient Ether sent to balance the exchange"
				);
				payable(owner2).transfer(request.priceDifference);
			} else if (payerIndex == 2) {
				// Owner 2 pays the difference
				require(
					value >= request.priceDifference,
					"Insufficient Ether sent to balance the exchange"
				);
				payable(owner1).transfer(request.priceDifference);
			}
		}

		// Transfer the land NFTs between owners
		_transfer(owner1, owner2, landId1);
		_transfer(owner2, owner1, landId2);

		emit ExchangeExecuted(exchangeId, owner1, owner2);
	}

	// Get a list of exchange requests where the provided address is the second owner (owner2)
	function getExchangeRequestsAsOwner2(
		address owner
	) public view returns (ExchangeRequest[] memory) {
		uint256 totalRequests = exchangeRequestCounter;
		uint256 count = 0;

		// First pass: count how many exchange requests have this address as owner2
		for (uint256 i = 1; i <= totalRequests; i++) {
			if (exchangeRequests[i].owner2 == owner) {
				count++;
			}
		}

		// Create an array with the correct size
		ExchangeRequest[] memory result = new ExchangeRequest[](count);
		uint256 index = 0;

		// Second pass: collect the exchange requests where this address is owner2
		for (uint256 i = 1; i <= totalRequests; i++) {
			if (exchangeRequests[i].owner2 == owner) {
				result[index] = exchangeRequests[i];
				index++;
			}
		}

		return result;
	}

	// Get all exchange requests waiting for notary approval
	function getRequestsWaitingForNotary()
		public
		view
		returns (ExchangeRequest[] memory)
	{
		uint256 totalRequests = exchangeRequestCounter;
		uint256 count = 0;

		// First pass: count how many exchange requests are waiting for notary approval
		for (uint256 i = 1; i <= totalRequests; i++) {
			if (
				exchangeRequests[i].isAcceptedBySecondOwner &&
				!exchangeRequests[i].isApprovedByNotary
			) {
				count++;
			}
		}

		// Create an array with the correct size
		ExchangeRequest[] memory result = new ExchangeRequest[](count);
		uint256 index = 0;

		// Second pass: collect the requests waiting for notary approval
		for (uint256 i = 1; i <= totalRequests; i++) {
			if (
				exchangeRequests[i].isAcceptedBySecondOwner &&
				!exchangeRequests[i].isApprovedByNotary
			) {
				result[index] = exchangeRequests[i];
				index++;
			}
		}

		return result;
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
		uint256 priceDifference,
		uint8 payerIndex
	);
	event ExchangeAccepted(
		uint256 exchangeId,
		address indexed owner1,
		address indexed owner2
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
