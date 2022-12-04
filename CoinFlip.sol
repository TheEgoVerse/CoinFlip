pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinFlip {
    event WinEvent(
        string msg,
        address user,
        uint256 amount,
        bool winner,
        uint256 checkWin
    );

    IERC20 public token = IERC20(0x830ddEe8f48E183e6B490cf22e10f958FC25Ef39);

    function Flip(uint256 amount, uint256 rateOfWin) public payable {
        if (amount > 10000000000000000000) {
            revert();
        } else {
            if (token.allowance(address(msg.sender), address(this)) < amount) {
                revert();
            }
            token.transferFrom(msg.sender, address(this), amount);
            uint256 chanceOfWinning;
            if(rateOfWin == 15) {
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

            uint256 checkWin = ((uint256(
                keccak256((abi.encodePacked(block.difficulty, block.timestamp)))
            ) % 100) + 1);
            uint256 balanceOfContract = token.balanceOf(address(this));
            if (checkWin < chanceOfWinning) {
                uint256 prize = (rateOfWin/10 * amount);
                if (balanceOfContract < prize) {
                    token.transfer(address(msg.sender), balanceOfContract);
                    emit WinEvent(
                        "Congratulation you won",
                        msg.sender,
                        prize,
                        true,
                        checkWin
                    );
                } else {
                    token.transfer(address(msg.sender), prize);
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
                    amount,
                    false,
                    checkWin
                );
            }
        }
    }
}
