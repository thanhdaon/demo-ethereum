const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let accounts;
let inbox;
const INIT_MESSAGE = "Hi there!";

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  const contract = new web3.eth.Contract(abi); // tell web3 about what methods an Inbox contract has

  inbox = await contract
    .deploy({ data: evm.bytecode.object, arguments: [INIT_MESSAGE] }) // tells web3 that we want to deploy a new copy of this contract
    .send({ from: accounts[0], gas: "1000000" }); // instructs web3 to send out a transaction that creates this contract
});

describe("Inbox", () => {
  it("Deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("Has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INIT_MESSAGE);
  });

  it("Can change the message", async () => {
    const changeMessage = "Hi there, new!";
    await inbox.methods.setMessage(changeMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, changeMessage);
  });
});
