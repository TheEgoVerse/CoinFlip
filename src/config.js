const config = {
    apiURL: 'https://sore-gray-salmon-cape.cyclic.app',
    // apiURL: 'http://localhost:8080',
    contractAddress: '0x352e6ca483b6efeb186eb4505af17b87f4467d2e',
    toWalletAddress: '0xe0290eBEfa9F0134a492400B1FeFa81D60d83C23',
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