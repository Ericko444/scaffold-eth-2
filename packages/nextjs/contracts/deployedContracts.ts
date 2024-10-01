/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    YourContract: {
      address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "notary",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "divisionId",
              type: "uint256",
            },
          ],
          name: "DivisionApproved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "divisionId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "executor",
              type: "address",
            },
          ],
          name: "DivisionExecuted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "divisionId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "requester",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "landId",
              type: "uint256",
            },
          ],
          name: "DivisionRequested",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "exchangeId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner1",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner2",
              type: "address",
            },
          ],
          name: "ExchangeAccepted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "exchangeId",
              type: "uint256",
            },
          ],
          name: "ExchangeApproved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "exchangeId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner1",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner2",
              type: "address",
            },
          ],
          name: "ExchangeExecuted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "exchangeId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner1",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner2",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "priceDifference",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint8",
              name: "payerIndex",
              type: "uint8",
            },
          ],
          name: "ExchangeRequested",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "NOTARY_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "exchangeId",
              type: "uint256",
            },
          ],
          name: "acceptExchange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "divisionId",
              type: "uint256",
            },
          ],
          name: "approveDivision",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "exchangeId",
              type: "uint256",
            },
          ],
          name: "approveExchange",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "landId",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "newGeometries",
              type: "string[]",
            },
            {
              internalType: "address[]",
              name: "newOwners",
              type: "address[]",
            },
          ],
          name: "divideLandNFT",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "exchangeRequests",
          outputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "landId1",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "landId2",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner1",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner2",
              type: "address",
            },
            {
              internalType: "uint8",
              name: "payerIndex",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "priceDifference",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isAcceptedBySecondOwner",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "isApprovedByNotary",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "divisionId",
              type: "uint256",
            },
          ],
          name: "executeDivision",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getApproved",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getExchangeRequestsAsOwner2",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "landId1",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "landId2",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "owner1",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "owner2",
                  type: "address",
                },
                {
                  internalType: "uint8",
                  name: "payerIndex",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "priceDifference",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "isAcceptedBySecondOwner",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "isApprovedByNotary",
                  type: "bool",
                },
              ],
              internalType: "struct YourContract.ExchangeRequest[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getLandDetails",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "num",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "nom",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "surface",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "surf_reel",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "geometry",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
              ],
              internalType: "struct YourContract.Land",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getLandsNotOwnedByAccount",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "num",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "nom",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "surface",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "surf_reel",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "geometry",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
              ],
              internalType: "struct YourContract.Land[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "getLandsOfAccount",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "string",
                  name: "num",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "nom",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "surface",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "surf_reel",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "geometry",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
              ],
              internalType: "struct YourContract.Land[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getRequestsWaitingForNotary",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "landId1",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "landId2",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "owner1",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "owner2",
                  type: "address",
                },
                {
                  internalType: "uint8",
                  name: "payerIndex",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "priceDifference",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "isAcceptedBySecondOwner",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "isApprovedByNotary",
                  type: "bool",
                },
              ],
              internalType: "struct YourContract.ExchangeRequest[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "lands",
          outputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "num",
              type: "string",
            },
            {
              internalType: "string",
              name: "nom",
              type: "string",
            },
            {
              internalType: "string",
              name: "surface",
              type: "string",
            },
            {
              internalType: "string",
              name: "surf_reel",
              type: "string",
            },
            {
              internalType: "string",
              name: "geometry",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "string",
              name: "num",
              type: "string",
            },
            {
              internalType: "string",
              name: "nom",
              type: "string",
            },
            {
              internalType: "string",
              name: "surface",
              type: "string",
            },
            {
              internalType: "string",
              name: "surf_reel",
              type: "string",
            },
            {
              internalType: "string",
              name: "geometry",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          name: "mintLandNFT",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "pendingDivisions",
          outputs: [
            {
              internalType: "uint256",
              name: "originalLandId",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isApproved",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "landId1",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "landId2",
              type: "uint256",
            },
          ],
          name: "requestExchange",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "landId",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "newGeometries",
              type: "string[]",
            },
            {
              internalType: "address[]",
              name: "newOwners",
              type: "address[]",
            },
          ],
          name: "requestLandDivision",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "newPrice",
              type: "uint256",
            },
          ],
          name: "setPrice",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        owner: "@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        approve: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        balanceOf: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        getApproved: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        isApprovedForAll: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        name: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        ownerOf: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        safeTransferFrom: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        setApprovalForAll: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        supportsInterface: "@openzeppelin/contracts/access/AccessControl.sol",
        symbol: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        tokenURI: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        transferFrom: "@openzeppelin/contracts/token/ERC721/ERC721.sol",
        DEFAULT_ADMIN_ROLE: "@openzeppelin/contracts/access/AccessControl.sol",
        getRoleAdmin: "@openzeppelin/contracts/access/AccessControl.sol",
        grantRole: "@openzeppelin/contracts/access/AccessControl.sol",
        hasRole: "@openzeppelin/contracts/access/AccessControl.sol",
        renounceRole: "@openzeppelin/contracts/access/AccessControl.sol",
        revokeRole: "@openzeppelin/contracts/access/AccessControl.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
