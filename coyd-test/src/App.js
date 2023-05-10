import logo from './logo.svg';
import './App.css';
import COYToken from "./abi/COYToken.json";
import React, { useState, useEffect} from "react";
import Web3 from "web3";

const { ethers } = require("ethers");
const COY_ABI = COYToken.abi;
const COY_ADDRESS = "<YOUR CONTRACT ADDRESS>";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [goal, setGoal] = useState('');
  const [burned, setBurned] = useState(0);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
        const contract = new web3.eth.Contract(COY_ABI, COY_ADDRESS);
        setContract(contract);
        const balance = await contract.methods.balanceOf(accounts[0]).call();
        setBalance(balance);
        const totalSupply = await contract.methods.totalSupply().call();
        console.log(totalSupply);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask to connect to Ethereum network");
    }
  }

  async function donateForTransaction() {
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;
    const totalCost = gasPrice * gasLimit;
    const value = web3.utils.toBN(totalCost).add(web3.utils.toBN(amount));
    await contract.methods.donate('<Foundation Account>').send({ from: accounts[0], value: amount });
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    setBalance(balance);
  }

  async function justDonate(){
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;
    const totalCost = gasPrice * gasLimit;
    const value = web3.utils.toBN(totalCost).add(web3.utils.toBN(amount));
    await contract.methods.justDonate().send({ from: accounts[0], value: amount });
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    setBalance(balance);
  }

  async function burnTokens() {
    const goalByte = ethers.utils.formatBytes32String(goal)
    await contract.methods.burn(amount, goalByte).send({ from: accounts[0] });
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    setBalance(balance);
    const burned = await contract.methods.burnedTokens(goalByte).call();
    setBurned(burned);
    console.log(goal, burned);
  }

  return (
    <div>
      <button className='button' onClick={connectWallet}>Connect to Wallet</button>
      <div>Account: {accounts.length > 0 ? accounts[0] : "Not connected"}</div>
      <div>COY Token Balance: {balance}</div>
      <div>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button className='button' onClick={donateForTransaction}>거래를 위한 기부</button>
        <button className='button' onClick={justDonate}>그냥 기부</button>
      </div>
      <div>
        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <button className='button' onClick={burnTokens}>Burn Tokens</button>
      </div>
    </div>
  );
}

export default App;