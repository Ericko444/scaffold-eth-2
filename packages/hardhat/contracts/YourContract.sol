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
		uint256 price;
	}

	struct ExchangeRequest {
		uint256 landId1;
		uint256 landId2;
		address owner1;
		address owner2;
		uint8 payerIndex; // Index of the payer (1 for owner1, 2 for owner2)
		uint256 priceDifference;
		bool isAcceptedBySecondOwner;
		bool isApprovedByNotary;
	}

	mapping(uint256 => Land) public lands;
	mapping(uint256 => ExchangeRequest) public exchangeRequests;

	uint256 private exchangeRequestCounter;

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
		uint256 price
	) public returns (uint256) {
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();

		_mint(recipient, newItemId);

		lands[newItemId] = Land(newItemId, num, nom, surface, surf_reel, price);

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
	function approveExchange(uint256 exchangeId) public onlyRole(NOTARY_ROLE) {
		ExchangeRequest storage request = exchangeRequests[exchangeId];
		require(
			request.isAcceptedBySecondOwner,
			"The second owner must accept the exchange before notary approval"
		);

		request.isApprovedByNotary = true;

		emit ExchangeApproved(exchangeId);

		// Execute the exchange
		executeExchange(exchangeId);
	}

	// Execute the approved land exchange
	function executeExchange(uint256 exchangeId) internal nonReentrant {
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
					msg.value >= request.priceDifference,
					"Insufficient Ether sent to balance the exchange"
				);
				payable(owner2).transfer(request.priceDifference);
			} else if (payerIndex == 2) {
				// Owner 2 pays the difference
				require(
					msg.value >= request.priceDifference,
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

	// Events
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
}
