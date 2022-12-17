import { Web3Auth } from "@web3auth/modal";
import Web3 from "web3";
import config from "../config";
import { showAlert, sleep } from "./utility";
import { Avalanche, BinTools, Buffer, BN } from "avalanche"
import { ethers } from "ethers";

export const coinFlip = async (event, setAlert, setDisableBtn, account) => {
    event.preventDefault()
    try {
        setDisableBtn(true)
        const payload = {}
        const multipliers = document.getElementsByName('multiplier');
        let rateOfWin = 1.5
        for (const multipler of multipliers) {
            if (multipler.checked && !payload.multiplier) {
                payload.multiplier = multipler.value
                let multiplerInConfig = config.rateOptions.find(x => x.id === multipler.value)
                if (multiplerInConfig) rateOfWin = multiplerInConfig.rate
                break;
            }
        }


        const amounts = document.getElementsByName('amount');
        for (const amount of amounts) {
            if (amount.checked && !payload.amount) {
                payload.amount = amount.value
                break;
            }
        }

        const flipChoices = document.getElementsByName('flipOptions');
        for (const flipChoice of flipChoices) {
            if (flipChoice.checked && !payload.flipChoice) {
                payload.flipChoice = flipChoice.value
                break;
            }
        }
        if (!payload.multiplier) {
            setDisableBtn(false)
            return showAlert(setAlert, 'You need to choose multiplier')
        }
        if (!payload.amount) {
            setDisableBtn(false)
            return showAlert(setAlert, 'You need to choose amount you want to bet.')
        }
        if (!payload.flipChoice) {
            setDisableBtn(false)
            return showAlert(setAlert, 'You need to choose your flip choice')
        }
        payload.walletAddress = account
        const web3 = new Web3(Web3.givenProvider);

        let contractAddress = config.contractAddress

        let fromAddress = account

        let contractABI = [
            {
                "inputs": [],
                "name": "acceptOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rateOfWin",
                        "type": "uint256"
                    }
                ],
                "name": "Flip",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferRequested",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "Paused",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_requestId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_randomWords",
                        "type": "uint256[]"
                    }
                ],
                "name": "rawFulfillRandomWords",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "addr",
                        "type": "address"
                    }
                ],
                "name": "setLinkAddress",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "addr",
                        "type": "address"
                    }
                ],
                "name": "setWrapperAddress",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "Unpaused",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "msg",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "winner",
                        "type": "bool"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "checkWin",
                        "type": "uint256"
                    }
                ],
                "name": "WinEvent",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "withdrawLink",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getTransactions",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "lastRequestId",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "paused",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "requestIds",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "s_requests",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "paid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "fulfilled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "randomWords",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "payer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountPaid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "chanceOfWinning",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rateOfWin",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "token",
                "outputs": [
                    {
                        "internalType": "contract IERC20",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "transactions",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        let amountById = config.amountOptions.find(x => x.id === payload.amount)
        let contract = new web3.eth.Contract(contractABI, contractAddress, { from: fromAddress })
        let amount = web3.utils.toHex(web3.utils.toWei(amountById.amount.toString()));

        let data = contract.methods.Flip(amount, web3.utils.toHex((rateOfWin * 10).toString())).encodeABI()
        const transactionParameters = {
            nonce: '0x00',
            to: contractAddress,
            gasPrice: '0x00', 
            from: window.ethereum.selectedAddress,
            value: '0x00',
            data: data,
        };
        let gasPrice = await web3.eth.getGasPrice()
        transactionParameters.gasPrice = web3.utils.toHex(gasPrice)
        let gasLimit = await web3.eth.estimateGas(transactionParameters); // estimate the gas limit for this transaction
        transactionParameters.gas = web3.utils.toHex(gasLimit)
        const tokenAddress = config.tokenAddress
        const tokenABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "Burned", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "Minted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "Snapshot", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "TransferSent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "AirdropAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "BreedingAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ExtensionAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "GameAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "StakingAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_OnePrey", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "snapshotId", "type": "uint256" }], "name": "balanceOfAt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_airdropAddress", "type": "address" }], "name": "setAirdropAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_breedingAddress", "type": "address" }], "name": "setBreedingAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_extensionAddress", "type": "address" }], "name": "setExtensionAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_gameAddress", "type": "address" }], "name": "setGameAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_stakingAddress", "type": "address" }], "name": "setStakingAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "snapshot", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalBurned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalMinted", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "snapshotId", "type": "uint256" }], "name": "totalSupplyAt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferPrey", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
        let tokenContract = new web3.eth.Contract(tokenABI, tokenAddress)
        let allowance = await tokenContract.methods.allowance(account, contractAddress).call()
        if (allowance < web3.utils.toWei(amountById.amount.toString())) {
            let tokenData = tokenContract.methods.approve(contractAddress, web3.utils.toHex(web3.utils.toWei('10000'))).encodeABI()

            const tokenTransactionParameters = {
                nonce: '0x00',
                to: tokenAddress,
                gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
                gas: '0x2710', // customizable by user during MetaMask confirmation.              
                from: window.ethereum.selectedAddress,
                value: '0x00',
                data: tokenData,
            };
            let gasPrice2 = await web3.eth.getGasPrice()
            tokenTransactionParameters.gasPrice = web3.utils.toHex(gasPrice2)
            let gasLimit = await web3.eth.estimateGas(tokenTransactionParameters); // estimate the gas limit for this transaction
            tokenTransactionParameters.gas = web3.utils.toHex(gasLimit)
    
            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tokenTransactionParameters],
            });
            await sleep(4000)
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        payload.txHash = txHash
        checkContract()

        function checkContract() {


            const provider = new ethers.providers.Web3Provider(
                window.ethereum
            );
            const contract2 = new ethers.Contract(config.contractAddress, contractABI, provider);

            contract2.once("WinEvent", (msg, user, amount, winner, checkWin) => {
                if (user !== account) {
                    return checkContract
                }
                console.log(msg, user, amount, winner, checkWin)
                var flipTail = [
                    "fliptail900",
                    "fliptail1260",
                    "fliptail1620",
                    "fliptail1980"
                ];
                var flipHead = [
                    "fliphead1080",
                    "fliphead1440",
                    "fliphead1800",
                    "fliphead2160"
                ]
                const getSpin = (spinArray) => {
                    var spin = spinArray[Math.floor(Math.random() * spinArray.length)];
                    return spin;
                }
                // if (b.transactionHash === txHash) {
                let flipChoice = ''
                let winLose = ''
                if (winner === false) {
                    flipChoice = (payload.flipChoice === 'Head' ? 'Tail' : 'Head')
                    winLose = false
                } else {
                    winLose = true
                    flipChoice = payload.flipChoice
                }
                document.getElementById("coin").className = ''
                setTimeout(() => {
                    document.getElementById("coin").classList.add(getSpin(flipChoice === 'Head' ? flipHead : flipTail));
                }, 300);

                setTimeout(() => {
                    setDisableBtn(false)
                    if (!winLose) {
                        return showAlert(setAlert, 'You lost the bet.')
                    } else {
                        return showAlert(setAlert, `Congratulation! You won ${amount / 1000000000000000000} PREY!`, 'success')
                    }
                }, 3500);

                // } else {
                // checkContract(txHash)
                // }
            });

            contract.once('WinEvent', (a, b) => {
            })
        }
    } catch (err) {
        console.log(err)
        setDisableBtn(false)
        return showAlert(setAlert, JSON.stringify(err))
    }
}