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

	struct PendingExchange {
		uint256 landId1;
		uint256 landId2;
		address owner1;
		address owner2;
		uint256 priceDifference;
		bool isApproved;
	}

	mapping(uint256 => Land) public lands;
	mapping(uint256 => PendingExchange) public pendingExchanges;

	uint256 private exchangeCounter;

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
}
