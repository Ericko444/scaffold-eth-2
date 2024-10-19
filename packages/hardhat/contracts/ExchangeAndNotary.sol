// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./LandManagement.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ExchangeAndNotary is LandManagement, ReentrancyGuard {
	bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");

	struct ExchangeRequest {
		uint256 id;
		uint256 landId1;
		uint256 landId2;
		address owner1;
		address owner2;
		uint8 payerIndex;
		uint256 priceDifference;
		bool isAcceptedBySecondOwner;
		bool isApprovedByNotary;
	}

	mapping(uint256 => ExchangeRequest) public exchangeRequests;
	uint256 private exchangeRequestCounter;

	event ExchangeRequested(
		uint256 exchangeId,
		address owner1,
		address owner2,
		uint256 priceDifference,
		uint8 payerIndex
	);
	event ExchangeAccepted(uint256 exchangeId, address owner1, address owner2);
	event ExchangeApproved(uint256 exchangeId);
	event ExchangeExecuted(uint256 exchangeId, address owner1, address owner2);

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

		uint8 payerIndex;
		uint256 priceDifference;
		if (price1 > price2) {
			priceDifference = price1 - price2;
			payerIndex = 2;
		} else if (price2 > price1) {
			priceDifference = price2 - price1;
			payerIndex = 1;
		} else {
			priceDifference = 0;
			payerIndex = 0;
		}

		exchangeRequestCounter++;
		exchangeRequests[exchangeRequestCounter] = ExchangeRequest({
			id: exchangeRequestCounter,
			landId1: landId1,
			landId2: landId2,
			owner1: owner1,
			owner2: owner2,
			payerIndex: payerIndex,
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
	) public payable nonReentrant {
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

		lands[landId1].seller = payable(owner2);
		lands[landId2].seller = payable(owner1);

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
}
