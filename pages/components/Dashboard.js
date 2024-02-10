import React, { useState } from 'react';
import Web3 from 'web3';
import NFT from '../abis/NFT.json';
import Marketplace from '../abis/Marketplace.json';
import { Navbar, Spinner } from 'react-bootstrap';
import { useWeb3 } from '../utils/Web3Provider';
import Navigate from './Navigate';
import Create from './Create';
import Home from './Home';
import ListedItems from './ListedItems';
import PurchasedItems from './PurchasedItems';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [mpContract, setMpContract] = useState(null);
  

  const web3Handler = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        
        const web3Instance = new Web3(window.ethereum);
        
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
      });
        console.log('Current account:', accounts[0]);
        const nftContract = new web3Instance.eth.Contract(
          NFT.abi,
          "0x857B76c752671d549604682bFBc08691A2517279"
        );
        const mpContract = new web3Instance.eth.Contract(
          Marketplace.abi,
          "0xF00B9f871b0306Ca5de7Fb5f2c6abcA9bb8AD3a2"
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='App'>
      <>
        <Navigate web3Handler={web3Handler} accounts={accounts} />
      </>
      <div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
          </div>
        ) : (
          <>
            {router.pathname === '/' && <Home mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts}/>}
            {router.pathname === '/create' && <Create mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts} />}
            {router.pathname === '/my-listed-items' && <ListedItems mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts}/>}
            {router.pathname === '/my-purchases' && <PurchasedItems mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts}/>}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;