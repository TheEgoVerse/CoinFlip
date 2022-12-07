pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CoinFlip is VRFV2WrapperConsumerBase, ConfirmedOwner, ReentrancyGuard {
    using SafeMath for uint256;

    event WinEvent(
        string msg,
        address user,
        uint256 amount,
        bool winner,
        uint256 checkWin
    );

    IERC20 public token = IERC20(0x352E6Ca483B6eFEb186eB4505Af17B87f4467D2e);
    uint256 private randomNumber;
    uint256 private randomUsedTimes = 11;

    struct RequestStatus {
        uint256 paid;
        bool fulfilled;
        uint256 randomWords;
        address payer;
        uint256 amountPaid;
        uint256 chanceOfWinning;
        uint256 rateOfWin;
    }

    mapping(uint256 => RequestStatus) public s_requests;

    uint256[] public requestIds;
    uint256 public lastRequestId;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    address linkAddress = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    address wrapperAddress = 0x9345AC54dA4D0B5Cda8CB749d8ef37e5F02BBb21;

    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");

        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords[0];

        uint256 vrfValue = _randomWords[0];
        randomNumber = vrfValue;
        randomUsedTimes = 0;
        uint256 checkWinNumber = ((uint256(
            keccak256(
                (
                    abi.encodePacked(
                        vrfValue,
                        block.difficulty,
                        block.timestamp
                    )
                )
            )
        ) % 100) + 1);

        checkWin(
            s_requests[_requestId].chanceOfWinning,
            s_requests[_requestId].rateOfWin,
            s_requests[_requestId].amountPaid,
            s_requests[_requestId].payer,
            checkWinNumber
        );
    }

    function checkWin(
        uint256 chanceOfWinning,
        uint256 rateOfWin,
        uint256 amountPaid,
        address payer,
        uint256 checkWinNumber
    ) internal {
        uint256 balanceOfContract = token.balanceOf(address(this));
        if (checkWinNumber < chanceOfWinning) {
            uint256 prize = (rateOfWin * amountPaid) / 10;
            if (balanceOfContract < prize) {
                token.transfer(address(payer), balanceOfContract);
                emit WinEvent(
                    "Congratulation you won",
                    msg.sender,
                    prize,
                    true,
                    checkWinNumber
                );
            } else {
                token.transfer(address(payer), prize);
                emit WinEvent(
                    "Congratulation you won",
                    msg.sender,
                    prize,
                    true,
                    checkWinNumber
                );
            }
        } else {
            emit WinEvent(
                "You lost the bet!",
                msg.sender,
                amountPaid,
                false,
                checkWinNumber
            );
        }
    }

    function Flip(uint256 amount, uint256 rateOfWin) public nonReentrant {
        uint256 amountCheck = amount / 10000000000000000000;
        require(
            amountCheck != 1 &&
                amountCheck != 2 &&
                amountCheck != 5 &&
                amountCheck != 10,
            "Amount entered restricted."
        );
        token.transferFrom(msg.sender, address(this), amount);
        uint256 chanceOfWinning;
        if (rateOfWin == 15) {
            chanceOfWinning = 65;
        } else if (rateOfWin == 20) {
            chanceOfWinning = 50;
        } else if (rateOfWin == 40) {
            chanceOfWinning = 25;
        } else if (rateOfWin == 100) {
            chanceOfWinning = 10;
        } else {
            revert();
        }

        if (randomUsedTimes > 9) {
            uint256 requestId = requestRandomness(
                callbackGasLimit,
                requestConfirmations,
                numWords
            );
            randomUsedTimes = 0;
            requestIds.push(requestId);
            lastRequestId = requestId;
            s_requests[requestId] = RequestStatus({
                paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
                randomWords: 0,
                fulfilled: false,
                payer: msg.sender,
                amountPaid: amount,
                chanceOfWinning: chanceOfWinning,
                rateOfWin: rateOfWin
            });
        } else {
            randomUsedTimes.add(1);
            uint256 checkWinNumber = ((uint256(
                keccak256(
                    (
                        abi.encodePacked(
                            randomNumber,
                            block.difficulty,
                            block.timestamp
                        )
                    )
                )
            ) % 100) + 1);

            checkWin(
                chanceOfWinning,
                rateOfWin,
                amount,
                address(msg.sender),
                checkWinNumber
            );
        }
    }

    function withdraw(uint256 amount) public nonReentrant {
        if (amount < token.balanceOf(address(this))) {
            revert();
        }
        if (
            address(msg.sender) !=
            address(0x583785f72f791bfE46047E8e66A21905dA0ACD8f)
        ) {
            revert();
        }
        token.transfer(address(msg.sender), amount);
    }
}
