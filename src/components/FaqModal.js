import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function FaqModal(props) {
    const [open, setOpen] = props.displayModalState;
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        FAQ
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <pre>
                        - What is PREY?

                        PREY is our native utility token with an unlimited supply. Printed solely by staking Alter Ego Punks.

                        - What are the Multipliers and Odds of Winning?

                        All of our Multipliers have true odds with no house edge and are provably fair.

                        - Average Win Rates by Multiplier:

                        1.5x = 65% Win Chance
                        2x = 50% Win Chance
                        5x = 25% Win Chance
                        10x = 10% Win Chance

                        - How does it work?

                        This is a simple Coin Flip by betting either on Heads or Tails after choosing the Multiplier rate, and choosing the amount of PREY you wanna bet.

                        - What are the gas fees?

                        The gas fee charge is a small portion between 0.001 - 0.002 AVAX.
                        Note: The gas fee is pegged to what the Avalanche network gas fees is at the time you're betting. It might change if gas fees on the network is high.

                        - How long does it take for each bet to take place?

                        After you click the "Flip Coin" button and connect your wallet, it will take 5 seconds to confirm on the blockchain. Then, a notification will pop up on your screen confirming if you won or lost the bet.

                        - The Page got reloaded and There were no notifications of winning, what happens to my bet?

                        The transactions goes through and succeeds no matter what. You can check your last transaction on Snowtrace explorer and find out the outcome either you've won or lost the bet.

                        - What if I get the "An error occurred" message?

                        You may experience this error message if there's a lot of transactions happening at once. Follow the same steps mentioned in the previous answer above.

                        - How do I collect my winnings?

                        Your winnings will automatically appear in your wallet if you won the bet.
                        </pre>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}