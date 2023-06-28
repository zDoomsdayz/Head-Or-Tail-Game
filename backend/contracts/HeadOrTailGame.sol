// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface R {
    function getRandomNumber() external view returns (uint256);
}
  


contract HeadOrTailGame is Ownable {

    address private PEPE;
    IERC20 pepe = IERC20(PEPE);
    R private _random;
    
    uint256 private gameCount;

    uint256 private rtp;
    uint256 private bonus;
    uint256 private bonusRate;
    uint256 private totalHead;
    uint256 private totalTail;

    uint256 constant private DECIMALS = 10**18;
    uint256[] public allowedBetAmounts;
    
    event GameResult(address indexed player, uint indexed gameId, bool indexed isWinner, uint betAmount, uint amountWon, bool bonus, bool isHead);
    
    constructor(address _PEPE, address _rand) {
        _random = R(_rand);
        rtp = 17;
        bonus = 22;
        gameCount = 0;
        bonusRate = 4;
        allowedBetAmounts = [250000000, 500000000, 1000000000, 10000000000];
        PEPE = _PEPE;
    }
    
    function play(uint256 betAmount, bool choice) external  {
        require(isAllowedBetAmount(betAmount), "Invalid bet amount");
        require(pepe.allowance(msg.sender, address(this)) >= betAmount, "Insufficient allowance. Please approve the correct amount.");
        require(pepe.balanceOf(msg.sender) >= betAmount, "Insufficient balance");


        uint256 randomNumber = _random.getRandomNumber();

        bool result = randomNumber % 2 == 0;
        bool isWinner = (result == choice);
        bool bonusRound = randomNumber < bonusRate;

        result ? totalHead++ : totalTail++;        
        uint256 amountWon = 0;

        if (isWinner) {
            amountWon = multiply(betAmount, (bonusRound ? bonus : rtp));
            if (amountWon > pepe.balanceOf(address(this))) {
                amountWon = pepe.balanceOf(address(this));
            }
            pepe.transferFrom(msg.sender, address(this), amountWon);
        }

        gameCount++;
        emit GameResult(msg.sender, gameCount, isWinner, betAmount, amountWon, bonusRound, result);
    }

    function withdrawFunds() public onlyOwner {
        require(address(this).balance > 0, "Contract balance is empty.");
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawPEPE() public onlyOwner {
        require(pepe.balanceOf(address(this)) > 0, "Contract balance is empty.");
        pepe.transfer(owner(), pepe.balanceOf(address(this)));
    }

    function getBalance() public view returns (uint256) {
        return pepe.balanceOf(address(this));
    }

    function addLiquidity(uint256 amount) public onlyOwner {
        require(amount > 0, "Invalid top-up amount");
        erc20Token.transferFrom(owner(), address(this), amount);
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

    function getPEPE() public view returns (address) {
        return PEPE;
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