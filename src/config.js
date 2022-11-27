const config = {
    apiURL: 'https://sore-gray-salmon-cape.cyclic.app',
    rateOptions: [
        {
            id: '1.5XRATEOPTION',
            rate: 1.5,
            chancesOfWinning: 65
        },
        {
            id: '2XRATEOPTION',
            rate: 2,
            chancesOfWinning: 50
        },
        {
            id: '4XRATEOPTION',
            rate: 4,
            chancesOfWinning: 25
        },
        {
            id: '10XRATEOPTION',
            rate: 10,
            chancesOfWinning: 10
        }
    ],

    amountOptions: [
        {
            id: '1PREYFLIP',
            amount: 1,
        },
        {
            id: '2PREYFLIP',
            amount: 2,
        },
        {
            id: '5PREYFLIP',
            amount: 5,
        },
        {
            id: '10PREYFLIP',
            amount: 10,
        }
    ],
    choices: ['Head', 'Tail']

}

export default config