import crypto from 'crypto-browserify'
export const updateStateObject = (setState, objectKey, value) => {
    setState((prevState) => ({
        ...prevState,
        [`${objectKey}`]: value
    }))
}


export const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export const showAlert = (setAlert, message, alert = 'danger') => {
    const id = crypto.randomBytes(16).toString('hex')
    setAlert((prevState) => ([
        ...prevState.slice(0, 3),
        { type: alert, message: message, id: id},
    ]))
    setTimeout(() => {
        hideAlert(setAlert, id)
    }, 10000);
}

export const hideAlert = (setAlert, id) => {
    setAlert((prevState) => ([
        ...prevState.filter(x => x.id !== id)
    ]))
}