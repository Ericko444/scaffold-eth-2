// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract BaseLandRegistry {
	using Counters for Counters.Counter;
	Counters.Counter internal _tokenIds; // Declare the shared _tokenIds variable
}
