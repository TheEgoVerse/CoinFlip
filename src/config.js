const config = {
    apiURL: 'https://sore-gray-salmon-cape.cyclic.app',
    // apiURL: 'http://localhost:8080',
    tokenAddress: '0x64636972995038A203F41D7Ab60658F3B60ea3f4',
    contractAddress: '0x7fc41CAeF8816d3535486292822e467b67dD8E50',
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