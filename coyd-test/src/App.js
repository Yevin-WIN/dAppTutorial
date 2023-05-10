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

  useEffect(() => {
    // Connect to the Ethereum network
    async function connect() {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const network = await provider.getNetwork();
          const contractAddress = "0x55D25E611402fB7daA4D77b4E812B3b07656ba09"; // Replace with your contract address
          const contract = new ethers.Contract(
            contractAddress,
            COYToken.abi,
            signer
          );
          setContract(contract);
          const account = (await signer.getAddress()).toLowerCase();
          setAccount(account);
          const balance = await contract.balanceOf(account);
          setBalance(ethers.utils.formatEther(balance));
          const whitelisted = await contract.hasRole(
            "0x8429d542926e6695b59ac6fbdcd9b37e8b1aeb757afab06ab60b1bb5878c3b49",
            account
          );
          setWhitelisted(whitelisted);
        } catch (error) {
          console.error(error);
        }
      }
    }

    connect();
  }, []);

  async function mint() {
    try {
      const amount = ethers.utils.parseEther("100");
      const tx = await contract.mint(account, amount);
      await tx.wait();
      const balance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error(error);
    }
  }

  async function addWhitelisted() {
    try {
      const address = "0xd1bbbd53ae93700628ca6e33a69e8b18dc80d7b7"; // Replace with the address to whitelist
      const tx = await contract.addWhitelisted(address);
      await tx.wait();
      const whitelisted = await contract.hasRole("0x8429d542926e6695b59ac6fbdcd9b37e8b1aeb757afab06ab60b1bb5878c3b49", address);
      setWhitelisted(whitelisted);
    } catch (error) {
      console.error(error);
    }
  }

  async function transfer() {
    try {
      const recipient = "0xd1bbbd53AE93700628Ca6e33a69E8b18DC80D7b7"; // Replace with the address to transfer to
      const amount = ethers.utils.parseEther("10");
      const tx = await contract.transfer(recipient, amount);
      await tx.wait();
      const balance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error(error);
    }
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