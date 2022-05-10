// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2 < 0.9.0;

contract DappToken {

  uint256 public totalSupply;

  constructor() {
    totalSupply = 1000000;
  }
}