const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

async function deploy() {
  const mnemonic =
    "army type juice mouse muscle crystal barely worry oyster calm machine economy";
  const targetNetwork =
    "https://rinkeby.infura.io/v3/e49819b000fb49b5871e3b51919698e3";

  const provider = new HDWalletProvider(mnemonic, targetNetwork);
  const web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();

  console.log("Attemping to deploy from account", accounts[0]);

  const contract = new web3.eth.Contract(abi);

  const result = await contract
    .deploy({ data: evm.bytecode.object, arguments: ["Hi there!"] })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deploy to", result.options.address);

  provider.engine.stop();
}

deploy();
