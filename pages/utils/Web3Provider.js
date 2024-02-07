// Web3Provider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import NFT from '../abis/NFT.json';
import Marketplace from '../abis/Marketplace.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [mpContract, setMpContract] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const initializeWeb3 = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3Instance.eth.getAccounts();
        console.log('Current account:', accounts[0]);
        const nftContract = new web3Instance.eth.Contract(
          NFT.abi,
          "0xbBe838256d98f691B83A9e59f72c8c17e83bE0c5"
        );
        const mpContract = new web3Instance.eth.Contract(
          Marketplace.abi,
          "0xCB87CdD7e13203A59437fE7Ba55dA78161DA1879"
        );
        setWeb3(web3Instance);
        setAccounts(accounts);
        setNftContract(nftContract);
        setMpContract(mpContract);
      } else {
        console.error('MetaMask not detected');
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
    }
  };
  const web3Handler = async () => {
    try {
      if (!initialized) {
        // Connect only if not already initialized
        await initializeWeb3();
        setInitialized(true);
      }
    } catch (error) {
      console.error('Error connecting Web3:', error);
    }
  };
  useEffect(() => {
    // initializeWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, accounts, nftContract, mpContract, web3Handler }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
