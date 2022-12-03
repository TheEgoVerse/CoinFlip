import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MetaMaskProvider } from './js/metamask';
import { Web3ReactProvider } from '@web3-react/core'
import CoinFlipPage from './page/CoinFlipPage';
import Web3 from 'web3'

const root = ReactDOM.createRoot(document.getElementById('root'));
function getLibrary(provider, connector) {
  return new Web3(provider)
}

root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <CoinFlipPage />
      </MetaMaskProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);
