import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import config from '../config'
import { coinFlip } from '../js/coinflip'
import useMetaMask from '../js/metamask'

export default function FlipOptionForm({ setAlert }) {
    const [disableBtn, setDisableBtn] = useState(false)
    const { account } = useMetaMask()

    return (
        <div className='coin-flip__flip-options-form' style={{ paddingTop: '0px', marginLeft: '20px', marginRight: '20px' }}>
            <div style={{ fontSize: '2rem', color: 'white', backgroundColor: 'black', fontWeight: '700', borderRadius: '0px' }} className='font-signika coin-flip__white-text-box-container' >PREY COIN FLIP</div>
            <form id='coin-flip__form' onSubmit={(event) => coinFlip(event, setAlert, setDisableBtn, account)} style={{ padding: '0px 20px' }}>
                <div style={{ fontSize: '2rem', color: 'black', fontWeight: '700' }} className='font-signika coin-flip__white-text-box-container' >Multiplier</div>
                <div style={{ display: 'flex', flexFlow: 'row wrap', margin: 'auto', justifyContent: 'center' }}>
                    {config.rateOptions.map(x => {
                        return (
                            <div className='coin-flip__form-radio-btn-box' key={x.id}>
                                <input type={'radio'} value={x.id} id={x.id} name='multiplier' />
                                <label htmlFor={x.id} className='coin-flip__form-radio-btn-container' style={{ marginTop: '2px', marginBottom: '2px', marginLeft: '5px', marginRight: '5px' }}>
                                    <div style={{ textAlign: 'center', display: 'flex', flexFlow: 'row wrap', fontSize: '1.8rem', color: 'white' }}>
                                        <div style={{ fontSize: '1.5rem' }}>{x.rate}x</div>
                                    </div>
                                    <div style={{ display: 'block', textAlign: 'center', width: '100%', color: 'white' }}>
                                        {x.chancesOfWinning}%
                                    </div>
                                </label>
                            </div>
                        )
                    })}
                </div>



                <div style={{ fontSize: '2rem', color: 'black', fontWeight: '700', marginTop: '10px' }} className='font-signika coin-flip__white-text-box-container' >Amount</div>
                <div style={{ display: 'flex', flexFlow: 'row wrap', margin: 'auto', justifyContent: 'center' }}>
                    {config.amountOptions.map(x => {
                        return (
                            <div className='coin-flip__form-radio-btn-box' key={x.id}>
                                <input type={'radio'} value={x.id} id={x.id} name='amount' />
                                <label htmlFor={x.id} className='coin-flip__form-radio-btn-container' style={{ marginTop: '2px', marginBottom: '2px', marginLeft: '5px', marginRight: '5px' }}>
                                    <div style={{ textAlign: 'center', display: 'flex', flexFlow: 'row wrap', fontSize: '1.5rem', color: 'white' }}>
                                        <div>{x.amount} Prey</div>
                                    </div>
                                </label>
                            </div>
                        )
                    })}
                </div>


                <div style={{ fontSize: '2rem', color: 'black', fontWeight: '700', marginTop: '10px' }} className='font-signika coin-flip__white-text-box-container' >Your Bet</div>
                <div style={{ display: 'flex', flexFlow: 'row wrap', margin: 'auto', justifyContent: 'center' }}>
                    {config.choices.map(x => {
                        return (
                            <div className='coin-flip__form-radio-btn-box' key={`flip_${x}`} >
                                <input type={'radio'} value={x} id={`flip_${x}`} style={{}} name='flipOptions' />
                                <label htmlFor={`flip_${x}`} className='coin-flip__form-radio-btn-container' style={{ marginTop: '2px', marginBottom: '2px', marginLeft: '5px', marginRight: '5px' }}>
                                    <div style={{ textAlign: 'center', display: 'flex', flexFlow: 'row wrap', fontSize: '1.8rem', color: 'white' }}>
                                        <div>{x}</div>
                                    </div>
                                </label>
                            </div>
                        )
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', background: 'black', marginTop: '20px' }}>
                    <div id="coin-flip-cont">
                        <div id="coin">
                            <img className="front" src='https://media.discordapp.net/attachments/879937579749883944/1044677232020439040/unknown.png' alt='coin-front' />
                            <img className="back" src='https://media.discordapp.net/attachments/879937579749883944/1044677885958553680/tail.png' alt='coin-back' />
                        </div>
                    </div>
                    <input type={"submit"} disabled={disableBtn} style={{ fontSize: '5rem', color: 'black', height: '100%', fontWeight: '700' }} className='font-signika coin-flip__blue-submit-form-btn' value={'Flip Coin'} />
                </div>
            </form>

        </div>
    )
}
