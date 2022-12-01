import React from 'react'
import useMetaMask from '../js/metamask'

export default function ProjectInfo() {
    const { connect, disconnect, isActive, account, shouldDisable } = useMetaMask()

    return (
        <>
            <div className='coin-flip__project-info-tab'>
                <div className='coin-flip__project-info'>
                    <img src='https://media.discordapp.net/attachments/970753739931648002/1047909973662892113/a_184b27b2818376dd2563a2724b127b9e.png' className='coin-flip__project-img' alt="Project" style={{ margin: '10px' }} />
                    <div className='coin-flip__project-text font-signika' style={{ margin: '10px' }}>
                        FAQ
                    </div>
                </div>

                {!account ? (<button className='coin-flip__connect-disconnect-btn' onClick={connect} disabled={shouldDisable}>Connect Wallet</button>) : (<button className='coin-flip__connect-disconnect-btn' onClick={disconnect}>Disconnect</button>)}

            </div>
        </>
    )
}