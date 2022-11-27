import React, { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import CoinFlip from '../components/CoinFlip'
import FlipOptionForm from '../components/FlipOptionForm'
import ProjectInfo from '../components/ProjectInfo'
import useMetaMask from '../js/metamask'
import web3 from 'web3'
export default function CoinFlipPage() {
    const [alert, setAlert] = useState([])
    const { connect, disconnect, isActive, account, shouldDisable } = useMetaMask()
    
    return (
        <>
            <Alert alertState={alert} />
            <ProjectInfo />
            {!account ? (<button className='coin-flip__connect-disconnect-btn' onClick={connect} disabled={shouldDisable}>Connect Wallet</button>) : (<button className='coin-flip__connect-disconnect-btn' onClick={disconnect}>Disconnect</button>)}
            <div className='coin-flip__container'>
                <CoinFlip />
                <FlipOptionForm setAlert={setAlert} />
            </div>
        </>
    )
}
