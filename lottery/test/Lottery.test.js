const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Loterry Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert.equal(players.length, 1);
    assert.equal(players[0], accounts[0]);
  });

  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[3] });

    assert.equal(players.length, 3);
    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200,
      });
      assert.fail();
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call endRound", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    try {
      await lottery.methods.endRound().send({
        from: accounts[2],
      });
      assert.fail();
    } catch (error) {
      assert(error);
    }

    try {
      await lottery.methods.endRound().send({
        from: accounts[0],
        gas: "1000000",
      });
    } catch (error) {
      assert.fail(error);
    }
  });

  it("sends money to the winer and resets the lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether"),
    });

    const initBalance = await web3.eth.getBalance(accounts[1]);
    assert(initBalance < web3.utils.toWei("98", "ether"));

    await lottery.methods.endRound().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initBalance;
    assert(difference > web3.utils.toWei("1.9", "ether"));

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.equal(players.length, 0);

    const contractBalance = await web3.eth.getBalance(lottery.options.address);
    assert.equal(contractBalance, 0);
  });
});
