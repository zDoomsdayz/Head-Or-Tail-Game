// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract HeadOrTailGame is VRFConsumerBaseV2, Ownable {
    uint256 private gameCount;

    uint256 private rtp;
    uint256 private bonus;
    uint256 private bonusRate;
    uint256 private totalHead;
    uint256 private totalTail;

    uint256 public randomResult;

    uint256 private constant DECIMALS = 10 ** 18;
    uint256[] public allowedBetAmounts;

    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    event GameResult(
        address indexed player,
        uint256 indexed requestId,
        uint gameId,
        bool isWinner,
        uint betAmount,
        uint amountWon,
        bool bonus,
        bool isHead
    );

    struct GameStatus {
        uint256 fees;
        uint256 randomWord;
        address player;
        bool isWinner;
        bool fulfilled;
        bool isHead;
        uint256 betAmount;
    }
    mapping(uint256 => GameStatus) public gameStatus;

    event RequestedRandomNumber(uint256 indexed requestId);

    constructor(
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        address vrfCoordinatorV2
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        rtp = 17;
        bonus = 22;
        gameCount = 0;
        bonusRate = 4;
        allowedBetAmounts = [
            0.01 ether,
            0.02 ether,
            0.03 ether,
            0.04 ether,
            0.05 ether
        ];

        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function play(bool choice) external payable returns (uint256) {
        require(
            isAllowedBetAmount(msg.value),
            "Please send correct amount to play the game."
        );
        require(
            multiply(msg.value, (DECIMALS * bonus) / 10) <
                address(this).balance,
            "We have gone bankrupt."
        );

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        gameStatus[requestId] = GameStatus({
            fees: 0,
            randomWord: 0,
            player: msg.sender,
            isWinner: false,
            fulfilled: false,
            isHead: choice,
            betAmount: msg.value
        });

        emit RequestedRandomNumber(requestId);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        gameStatus[requestId].fulfilled = true;
        gameStatus[requestId].randomWord = randomWords[0];

        uint256 randomNumber = randomWords[0] % 100;

        bool result = randomNumber % 2 == 0;
        bool isWinner = (result == gameStatus[requestId].isHead);
        bool bonusRound = randomNumber < bonusRate;

        result ? totalHead++ : totalTail++;
        uint256 amountWon = 0;

        if (isWinner) {
            amountWon = multiply(
                gameStatus[requestId].betAmount,
                (DECIMALS * (bonusRound ? bonus : rtp)) / 10
            );
            if (amountWon > address(this).balance) {
                amountWon = address(this).balance;
            }
            gameStatus[requestId].isWinner = true;
            //payable(gameStatus[requestId].player).transfer(amountWon);
            (bool success, ) = payable(gameStatus[requestId].player).call{
                value: amountWon
            }("");
            require(success, "Transfer failed");
        }

        gameCount++;
        emit GameResult(
            gameStatus[requestId].player,
            requestId,
            gameCount,
            isWinner,
            gameStatus[requestId].betAmount,
            amountWon,
            bonusRound,
            result
        );

        //(bool success, ) = recentWinner.call{value: address(this).balance}("");
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
