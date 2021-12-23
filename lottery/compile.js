const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const abi = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Lottery.sol"
].Lottery.abi;

console.log(JSON.stringify(abi));
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Lottery.sol"
].Lottery;
