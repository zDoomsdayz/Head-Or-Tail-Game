// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HeadOrTailGame is Ownable {
    
    address public htContract;

    function getRandomNumber() external view returns (uint256) {
        require(msg.sender == htContract,"Not allowed");
        uint256 randomNumber = uint256(keccak256(
            block.timestamp, msg.sender, block.difficulty, block.gaslimit, block.number, blockhash(block.number - 1)
        )) % 10 + 1;
        return randomNumber;
    }

    function changeHTcontract(address _new) public onlyOwner {
        htContract = _new;
    }
}