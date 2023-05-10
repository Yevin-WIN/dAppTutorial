// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract COYToken is ERC20, Ownable {
    address private _owner;

    mapping (bytes32 => uint256) public burnedTokens;
    
    event Burned(address indexed account, uint256 amount, bytes32 indexed goal);
    event TxComplete(address indexed buyer, address indexed seller, uint256 amount);
    event Donated(address indexed donater, uint256 amount);

    constructor() ERC20("COYToken", "COY") {
        _owner = msg.sender;

    }

    function donate(address seller) public payable {
        require(msg.value > 0, "No tokens");
        payable(_owner).transfer(msg.value);
        _mint(msg.sender, msg.value / 5 * 2);
        _mint(seller, msg.value / 5 * 3);
        emit TxComplete(msg.sender, seller, msg.value);
    }

    function justDonate() public payable {
        require(msg.value > 0, "No tokens deposited");
        payable(_owner).transfer(msg.value);
        _mint(msg.sender, msg.value);
        emit Donated(msg.sender, msg.value);
    }

    function burn(uint256 amount, bytes32 goal) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Not enough balance to burn");
        _burn(msg.sender, amount);
        burnedTokens[goal] += amount;
        emit Burned(msg.sender, amount, goal);
    }
}
