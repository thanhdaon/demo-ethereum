// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

contract Inbox {
    string public message;

    constructor(string memory inititalMessage) {
        message = inititalMessage;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
