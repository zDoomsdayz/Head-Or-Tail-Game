// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HeadOrTailGame is Ownable {
    uint256 private gameCount;

    uint256 private rtp;
    uint256 private bonus;
    uint256 private bonusRate;
    uint256 private totalHead;
    uint256 private totalTail;

    uint256 constant private DECIMALS = 10**18;
    uint256[] public allowedBetAmounts;
    
    event GameResult(address indexed player, uint indexed gameId, bool indexed isWinner, uint betAmount, uint amountWon, bool bonus, bool isHead);
    
    constructor() {
        rtp = 17;
        bonus = 22;
        gameCount = 0;
        bonusRate = 4;
        allowedBetAmounts = [0.01 ether, 0.02 ether, 0.03 ether, 0.04 ether, 0.05 ether];
    }
    
    function play(bool choice) external payable {
        require(isAllowedBetAmount(msg.value), "Please send correct amount to play the game.");
        require(multiply(msg.value, DECIMALS * bonus / 10) < address(this).balance, "We have gone bankrupt.");
        
        uint256 randomNumber = getRandomNumber();

        bool result = randomNumber % 2 == 0;
        bool isWinner = (result == choice);
        bool bonusRound = randomNumber < bonusRate;

        result ? totalHead++ : totalTail++;        
        uint256 amountWon = 0;

        if (isWinner) {
            amountWon = multiply(msg.value, DECIMALS *  (bonusRound ? bonus : rtp ) / 10);
            if (amountWon > address(this).balance) {
                amountWon = address(this).balance;
            }
            payable(msg.sender).transfer(amountWon);
        } 
        
        gameCount++;
        emit GameResult(msg.sender, gameCount, isWinner, msg.value, amountWon, bonusRound, result);
    }

    function withdrawFunds() public onlyOwner {
        require(address(this).balance > 0, "Contract balance is empty.");
        payable(owner()).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function topUpBalance() public payable onlyOwner {
        require(msg.value > 0, "Invalid top-up amount");
    }

    function getRtp() public view returns (uint256) {
        return rtp;
    }

    function setRtp(uint256 _rtp) public onlyOwner {
        rtp = _rtp;
    }

    function getBonus() public view returns (uint256) {
        return bonus;
    }

    function setBonus(uint256 _bonus) public onlyOwner {
        bonus = _bonus;
    }

    function getOwner() public view returns (address) {
        return owner();
    }

    function getTotalHead() public view returns (uint256) {
        return totalHead;
    }

    function getTotalTail() public view returns (uint256) {
        return totalTail;
    }

    function getRandomNumber() private view returns (uint256) {
        // Generate a random number between 1 to 10
        uint256 randomNumber = uint256(keccak256(
            abi.encodePacked(block.timestamp, msg.sender, gameCount)
        )) % 10 + 1;

        return randomNumber;
    }

    function multiply(uint256 a, uint256 b) private pure returns (uint256) {
        uint256 result = (a * b) / DECIMALS;
        return result;
    }

    function isAllowedBetAmount(uint256 amount) private view returns (bool) {
        for (uint256 i = 0; i < allowedBetAmounts.length; i++) {
            if (amount == allowedBetAmounts[i]) {
                return true;
            }
        }
        return false;
    }
}