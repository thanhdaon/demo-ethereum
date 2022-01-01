// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9;

contract Lottery {
    address public creator;
    address[] public players;

    constructor() {
        creator = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function drawn() public restricted {
        address winner = pickWinner();
        payable(winner).transfer(address(this).balance);
        reset();
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function pickWinner() private view returns (address) {
        return players[random() % players.length];
    }

    function random() private view returns (uint256) {
        bytes memory encoded = abi.encodePacked(
            block.difficulty,
            block.timestamp,
            players
        );
        return uint256(keccak256(encoded));
    }

    function reset() private {
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == creator);
        _;
    }
}
