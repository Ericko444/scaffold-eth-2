// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./LandManagement.sol";
import "./SaleMarketplace.sol";
import "./ExchangeAndNotary.sol";
import "./LandAuction.sol";

contract LandRegistry is
	LandManagement,
	SaleMarketplace,
	ExchangeAndNotary,
	LandAuction
{
	bytes32 public constant NOTARY_ROLEEEEE = keccak256("NOTARY_ROLE");

	constructor(address notary) LandManagement() {
		_setupRole(NOTARY_ROLEEEEE, notary);
	}
}
