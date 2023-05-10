import logo from './logo.svg';
import './App.css';
import COYToken from "./abi/COYToken.json";
import React, { useState, useEffect} from "react";

const { ethers } = require("ethers");

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [whitelisted, setWhitelisted] = useState(false);

  const COY_ADDRESS = "<YOUR CONTRACT ADDRESS>";

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
      <h1>COYToken</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance} COY</p>
      <p>Whitelisted: {whitelisted.toString()}</p>
      <button onClick={mint}>Mint 100 COY</button>
      <button onClick={addWhitelisted}>Add Whitelisted</button>
      <button onClick={transfer}>Transfer 10 COY</button>
    </div>
  );
}

export default App;