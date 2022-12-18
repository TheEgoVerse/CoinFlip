import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import Timestamp from 'react-timestamp';
import Web3 from 'web3';
import config from '../config';
import useMetaMask from '../js/metamask';
import snowtrace from './../assets/img/snowtrace.png'
export default function RecentTransactions() {
    const { account } = useMetaMask()
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        getRecentTransactions()
    }, [])
    async function getRecentTransactions() {
        try {
            const web3 = new Web3(Web3.givenProvider);
            let contractAddress = config.contractAddress
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
            let contract = new web3.eth.Contract(contractABI, contractAddress)
            let transactions = await contract.methods.getTransactions().call()
            transactions = [...transactions]
            transactions = transactions.reverse().slice(0, 10)
            transactions = await Promise.all(transactions.map(async x => {
                let tx = (await web3.eth.getBlock(x))
                return { transactionSignature: tx.transactions[0], usedAt: tx.timestamp * 1000 }
            }))
            setTransactions(transactions)
            checkTransaction()
            function checkTransaction() {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const contract2 = new ethers.Contract(config.contractAddress, contractABI, provider);
    
                contract2.once('WinEvent', async (...parameters) => {
                    const event = (parameters[parameters.length-1])
                    
                    console.log(event)
                    if (event.blockNumber) {
                        let tx = (await web3.eth.getBlock(event.blockNumber))
                        if (transactions.length === 15) {
                            setTransactions((prev) => [
                                { transactionSignature: tx.transactions[0], usedAt: tx.timestamp * 1000 },
                                ...prev.filter(x => x.transactionSignature !== tx.transactions[0]).slice(0, 14),
                            ])
                        } else {
                            setTransactions((prev) => [
                                { transactionSignature: tx.transactions[0], usedAt: tx.timestamp * 1000 },
                                ...prev.filter(x => x.transactionSignature !== tx.transactions[0])
                            ])
                        }
                    }
                })
            }
        } catch (err) {
            console.log(err)
            return setTransactions([])
        }
    }
    const explorer = 'https://snowtrace.io'
    return (
        <div className='coin-flip__flip-options-form' style={{ paddingTop: '0px', marginLeft: '20px', marginRight: '20px' }}>
            <div style={{ fontSize: '2rem', color: 'white', backgroundColor: 'black', fontWeight: '700', borderRadius: '0px' }} className='font-signika coin-flip__white-text-box-container' >Recent Transactions</div>
            <div className='coin-flip__recent-transactions'>
                {transactions.map(x => {
                    return (
                        <div key={x.transactionSignature} className='coin-flip__transaction'>
                            <div>
                                <a style={{ textDecoration: 'none', fontSize: '1.3rem' }} className='font-signika' href={`${explorer}/tx/${x.transactionSignature}`}>
                                    [{x.transactionSignature.slice(0, 5)}...{x.transactionSignature.slice(-2)}]
                                </a>
                            </div>
                            <Timestamp relative date={new Date(x.usedAt)} autoUpdate className='font-signika' style={{ fontSize: '1.3rem' }} />
                        </div>
                    )
                })}
            </div>

            <a href={`${explorer}/address/${config.contractAddress}`} style={{ textDecoration: 'none' }}><div style={{ fontSize: '2rem', color: 'white', backgroundColor: 'black', fontWeight: '700', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='font-signika coin-flip__white-text-box-container' ><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={snowtrace} alt='snowtrace logo' style={{ height: '2.5rem', marginLeft: '10px', marginRight: '10px' }} /></span> <span style={{ marginLeft: '10px', marginRight: '10px' }}>Contract Address</span></div></a>
        </div >
    )
}
