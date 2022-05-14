// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2 < 0.9.0;

contract DappTokenSale {
  address admin;

  constructor() {
    admin = msg.sender;
  }
}