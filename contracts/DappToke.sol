// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2 < 0.9.0;

contract DappToken {

  string public name  = "Dapp Token";
  string public symbol = "DAPP";
  string public standard = "Dapp Token v1.0";
  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf; 

  constructor(uint256 _initialSupply) {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }
}