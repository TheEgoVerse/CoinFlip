pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract CoinFlip is
    VRFV2WrapperConsumerBase,
    ConfirmedOwner,
    ReentrancyGuard,
    Pausable
{
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
    struct Transaction {
        uint56 blockNumber;
    }
    uint256[] public transactions;
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
    }

    function checkWin(
        uint256 chanceOfWinning,
        uint256 rateOfWin,
        uint256 amountPaid,
        address payer,
        uint256 checkWinNumber
    ) internal {
        transactions.push(block.number);
        uint256 balanceOfContract = token.balanceOf(address(this));
        if (checkWinNumber < chanceOfWinning) {
            uint256 prize = (rateOfWin * amountPaid) / 10;
            if (balanceOfContract < prize) {
                token.transfer(address(payer), balanceOfContract);
                emit WinEvent(
                    "Congratulation you won",
                    payer,
                    prize,
                    true,
                    checkWinNumber
                );
            } else {
                token.transfer(address(payer), prize);
                emit WinEvent(
                    "Congratulation you won",
                    payer,
                    prize,
                    true,
                    checkWinNumber
                );
            }
        } else {
            emit WinEvent(
                "You lost the bet!",
                payer,
                amountPaid,
                false,
                checkWinNumber
            );
        }
    }

    function Flip(uint256 amount, uint256 rateOfWin)
        public
        nonReentrant
        whenNotPaused
    {
        uint256 amountCheck = amount / 1000000000000000000;
        if (
            amountCheck != 1 &&
            amountCheck != 2 &&
            amountCheck != 5 &&
            amountCheck != 10
        ) {
            revert("Amount entered restricted.");
        }
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
        } else {
            randomUsedTimes = randomUsedTimes + 1;
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

    function withdraw(uint256 amount) public nonReentrant onlyOwner {
        if (amount > token.balanceOf(address(this))) {
            revert();
        }
        token.transfer(address(msg.sender), amount);
    }

    function getTransactions() public view returns (uint256[] memory) {
        return (transactions);
    }

    function setWrapperAddress(address addr) public onlyOwner {
        wrapperAddress = addr;
    }

    function setLinkAddress(address addr) public onlyOwner {
        linkAddress = addr;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
