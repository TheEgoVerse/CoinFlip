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
        getRecentTransactions(account)
    }, [account])
    async function getRecentTransactions(walletAddress) {
        try {
            let req = await fetch(`${config.apiURL}/get-transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            let res = await req.json()
            if (res.error) return setTransactions([])
            else return setTransactions(res.transactions)
        } catch {
            return setTransactions([])
        }
    }
    const explorer = 'https://testnet.snowtrace.io'
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

            <a href={`${explorer}/address/${config.contractAddress}`} style={{textDecoration: 'none'}}><div style={{ fontSize: '2rem', color: 'white', backgroundColor: 'black', fontWeight: '700', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='font-signika coin-flip__white-text-box-container' ><span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={snowtrace} alt='snowtrace logo' style={{height: '2.5rem', marginLeft: '10px', marginRight: '10px'}}/></span> <span style={{marginLeft: '10px', marginRight: '10px'}}>Contract Address</span></div></a>
        </div >
    )
}
