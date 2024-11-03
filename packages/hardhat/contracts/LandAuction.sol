// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./LandManagement.sol";

import "hardhat/console.sol";

contract LandAuction is LandManagement {
	bytes32 public constant NOTARY_ROLEE = keccak256("NOTARY_ROLE");

	struct Auction {
		uint256 landId;
		address payable highestBidder;
		uint256 highestBid;
		uint256 endTime;
		bool active;
		bool ended;
		bool isPending;
		mapping(address => uint256) bids;
		address[] bidders;
	}

	// Struct for returning auction info (without mappings)
	struct AuctionInfo {
		uint256 landId;
		address highestBidder;
		uint256 highestBid;
		uint256 endTime;
		bool active;
		bool ended;
		bool isPending;
	}

	uint256[] public auctionIds;
	mapping(uint256 => Auction) public auctions;

	event AuctionCreated(uint256 indexed landId);
	event AuctionStarted(uint256 indexed landId, uint256 endTime);
	event NewBidPlaced(
		uint256 indexed landId,
		address indexed bidder,
		uint256 bid
	);
	event AuctionEnded(
		uint256 indexed landId,
		address winner,
		uint256 winningBid
	);
	event BidRefunded(uint256 indexed landId, address bidder, uint256 bid);

	// Function to create an auction (Only notary can do this)
	function createAuction(uint256 landId) public onlyRole(NOTARY_ROLEE) {
		require(
			ownerOf(landId) ==
				address(0x1a98EbD96CDB77A8Ea6cE8Bc3EcCd3B449712c7B),
			"Only government lands can be auctioned"
		);
		require(
			!auctions[landId].active && !auctions[landId].isPending,
			"Auction already exists for this land"
		);

		Auction storage auction = auctions[landId];
		auction.landId = landId;
		auction.active = false;
		auction.ended = false;
		auction.isPending = true;

		auctionIds.push(landId);
		emit AuctionCreated(landId);
	}

	// Function to start an auction after it has been created
	function startAuction(
		uint256 landId,
		uint256 duration
	) public onlyRole(NOTARY_ROLEE) {
		Auction storage auction = auctions[landId];
		require(
			auction.isPending,
			"Auction must be created first and be in pending state"
		);
		require(!auction.active, "Auction is already active");

		auction.endTime = block.timestamp + duration;
		auction.active = true;
		auction.isPending = false;

		emit AuctionStarted(landId, auction.endTime);
	}

	// Function to place a bid on an active auction
	function placeBid(uint256 landId) public payable {
		Auction storage auction = auctions[landId];
		require(auction.active, "Auction is not active");
		require(block.timestamp < auction.endTime, "Auction has already ended");
		require(
			msg.value > auction.highestBid,
			"Bid must be higher than the current highest bid"
		);

		if (auction.bids[msg.sender] == 0) {
			auction.bidders.push(msg.sender);
		}

		auction.highestBidder = payable(msg.sender);
		auction.highestBid = msg.value;
		auction.bids[msg.sender] = msg.value;

		emit NewBidPlaced(landId, msg.sender, msg.value);
	}

	function getBids(
		uint256 landId
	)
		public
		view
		returns (address[] memory bidders, uint256[] memory bidAmounts)
	{
		Auction storage auction = auctions[landId];
		uint256 numBidders = auction.bidders.length;
		bidders = new address[](numBidders);
		bidAmounts = new uint256[](numBidders);
		for (uint256 i = 0; i < numBidders; i++) {
			address bidder = auction.bidders[i];
			bidders[i] = bidder;
			bidAmounts[i] = auction.bids[bidder];
		}
		return (bidders, bidAmounts);
	}

	// Function to end the auction and transfer the land to the highest bidder
	function endAuction(uint256 landId) public onlyRole(NOTARY_ROLEE) {
		Auction storage auction = auctions[landId];
		console.log("%s", block.timestamp);
		console.log("%s", auction.endTime);
		require(auction.active, "Auction is not active");
		require(
			block.timestamp >= auction.endTime,
			"Auction has not ended yet"
		);
		require(!auction.ended, "Auction has already been ended");

		auction.active = false;
		auction.ended = true;

		if (auction.highestBidder != address(0)) {
			_transfer(address(this), auction.highestBidder, landId);
			emit AuctionEnded(
				landId,
				auction.highestBidder,
				auction.highestBid
			);
		}

		for (uint256 i = 0; i < auction.bidders.length; i++) {
			address bidder = auction.bidders[i];
			if (bidder != auction.highestBidder) {
				uint256 refundAmount = auction.bids[bidder];
				if (refundAmount > 0) {
					auction.bids[bidder] = 0;
					payable(bidder).transfer(refundAmount);
					emit BidRefunded(landId, bidder, refundAmount);
				}
			}
		}
	}

	// Helper function to convert Auction to AuctionInfo
	function _getAuctionInfo(
		Auction storage auction
	) internal view returns (AuctionInfo memory) {
		return
			AuctionInfo({
				landId: auction.landId,
				highestBidder: auction.highestBidder,
				highestBid: auction.highestBid,
				endTime: auction.endTime,
				active: auction.active,
				ended: auction.ended,
				isPending: auction.isPending
			});
	}

	// Function to list all auctions
	function getAllAuctions() public view returns (AuctionInfo[] memory) {
		AuctionInfo[] memory auctionList = new AuctionInfo[](auctionIds.length);
		for (uint256 i = 0; i < auctionIds.length; i++) {
			Auction storage auction = auctions[auctionIds[i]];
			auctionList[i] = _getAuctionInfo(auction);
		}
		return auctionList;
	}

	// Function to list active auctions
	function getActiveAuctions() public view returns (AuctionInfo[] memory) {
		uint256 count = 0;
		for (uint256 i = 0; i < auctionIds.length; i++) {
			if (auctions[auctionIds[i]].active) {
				count++;
			}
		}

		AuctionInfo[] memory activeAuctionList = new AuctionInfo[](count);
		uint256 index = 0;
		for (uint256 i = 0; i < auctionIds.length; i++) {
			if (auctions[auctionIds[i]].active) {
				activeAuctionList[index] = _getAuctionInfo(
					auctions[auctionIds[i]]
				);
				index++;
			}
		}

		return activeAuctionList;
	}

	// Function to list pending auctions
	function getPendingAuctions() public view returns (AuctionInfo[] memory) {
		uint256 count = 0;
		for (uint256 i = 0; i < auctionIds.length; i++) {
			if (auctions[auctionIds[i]].isPending) {
				count++;
			}
		}

		AuctionInfo[] memory pendingAuctionList = new AuctionInfo[](count);
		uint256 index = 0;
		for (uint256 i = 0; i < auctionIds.length; i++) {
			if (auctions[auctionIds[i]].isPending) {
				pendingAuctionList[index] = _getAuctionInfo(
					auctions[auctionIds[i]]
				);
				index++;
			}
		}

		return pendingAuctionList;
	}

	// Function to list ended auctions
	function getEndedAuctions() public view returns (AuctionInfo[] memory) {
		uint256 count = 0;
		for (uint256 i = 0; i < auctionIds.length; i++) {
			if (auctions[auctionIds[i]].ended) {
				count++;
			}
		}

		AuctionInfo[] memory endedAuctionList = new AuctionInfo[](count);
		uint256 index = 0;
		for (uint256 i = 0; i < auctionIds.length; i++) {
			if (auctions[auctionIds[i]].ended) {
				endedAuctionList[index] = _getAuctionInfo(
					auctions[auctionIds[i]]
				);
				index++;
			}
		}

		return endedAuctionList;
	}
}
