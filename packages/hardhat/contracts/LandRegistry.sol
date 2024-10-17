// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./LandManagement.sol";
import "./SaleMarketplace.sol";
import "./ExchangeAndNotary.sol";

contract LandRegistry is LandManagement, SaleMarketplace, ExchangeAndNotary {
	constructor(address notary) LandManagement() {
		_setupRole(NOTARY_ROLE, notary);
	}
}
