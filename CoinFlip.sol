pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CoinFlip is VRFV2WrapperConsumerBase, ConfirmedOwner {
    using SafeMath for uint256;

    event WinEvent(
        string msg,
        address user,
        uint256 amount,
        bool winner,
        uint256 checkWin
    );

    IERC20 public token = IERC20(0x352E6Ca483B6eFEb186eB4505Af17B87f4467D2e);

    bool internal locked;
    modifier reEntrancy() {
        require(!locked, "No Reentracy");
        locked = true;
        _;
        locked = false;
    }

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
        s_requests[_requestId].randomWords = _randomWords[0].mod(100).add(1);

        uint256 checkWin = _randomWords[0].mod(100).add(1);
        uint256 balanceOfContract = token.balanceOf(address(this));
        if (checkWin < s_requests[_requestId].chanceOfWinning) {
            uint256 prize = ((s_requests[_requestId].rateOfWin * s_requests[_requestId].amountPaid) / 10);
            if (balanceOfContract < prize) {
                token.transfer(address(s_requests[_requestId].payer), balanceOfContract);
                emit WinEvent(
                    "Congratulation you won",
                    msg.sender,
                    prize,
                    true,
                    checkWin
                );
            } else {
                token.transfer(address(s_requests[_requestId].payer), prize);
                emit WinEvent(
                    "Congratulation you won",
                    msg.sender,
                    prize,
                    true,
                    checkWin
                );
            }
        } else {
            emit WinEvent(
                "You lost the bet!",
                msg.sender,
                s_requests[_requestId].amountPaid,
                false,
                checkWin
            );
        }
    }

    function Flip(uint256 amount, uint256 rateOfWin) public reEntrancy {
        uint256 amountCheck = amount / 10000000000000000000;
        require(
            amountCheck != 1 &&
                amountCheck != 2 &&
                amountCheck != 5 &&
                amountCheck != 10,
            "Amount entered restricted."
        );

        require(
            (token.allowance(address(this), address(msg.sender)) < amount),
            "Token transfer not allowed."
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

        uint256 requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
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
    }

    function withdraw(uint256 amount) public reEntrancy {
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
