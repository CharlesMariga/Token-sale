// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2 < 0.9.0;

import "./DappToken.sol";

contract DappTokenSale {
  address payable admin;
  DappToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;

  event Sell(address _buyer, uint256 _amount);

  constructor(DappToken _tokenContract, uint256 _tokenPrice) {
    admin = payable(msg.sender);
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  function mul(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == mul(_numberOfTokens, tokenPrice), "msg.value must be equal to the value of the tokens in wei");
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "contract doesn't have enough tokens");
    require(tokenContract.transfer(msg.sender, _numberOfTokens));
    tokensSold += _numberOfTokens;
    emit Sell(msg.sender, _numberOfTokens);
  }

  function endSale() public {
    require(msg.sender == admin);
    tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));
    selfdestruct(admin);
  }
}