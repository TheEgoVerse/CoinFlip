import React from 'react'

export default function Alert(props) {
    const alert = props.alertState
    if (!alert || !alert.length) return (<></>)
    return (
        <div className='alert'>
            <div className='alert-container'>
                {alert.map((y, i) => {
                    let bgColor = 'red'
                    if (y.type === 'success') bgColor = 'green'
                    return (
                        <div key={i} style={{ backgroundColor: bgColor }} className='font-signika alert-info'>
                            {y.message}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}