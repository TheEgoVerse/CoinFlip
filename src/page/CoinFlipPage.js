import React, { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import CoinFlip from '../components/CoinFlip'
import FlipOptionForm from '../components/FlipOptionForm'
import ProjectInfo from '../components/ProjectInfo'
import useMetaMask from '../js/metamask'
import web3 from 'web3'
import RecentTransactions from '../components/RecentTransactions'
import FaqModal from '../components/FaqModal'
export default function CoinFlipPage() {
    const [alert, setAlert] = useState([])
    const [displayModal, setDisplayModal] = useState(false)
    return (
        <>
            <FaqModal displayModalState={[displayModal, setDisplayModal]} />
            <Alert alertState={alert} />
            <ProjectInfo />
            <div className='coin-flip__container'>
                <FlipOptionForm setAlert={setAlert} />
                <RecentTransactions />
            </div>
        </>
    )
}
