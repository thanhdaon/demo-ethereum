import { useEffect, useState } from "react";

import web3 from "web3/connect";
import lottery from "web3/lottery";

function App() {
  const [creator, setCreator] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("web3 version:", web3.version);
  }, []);

  useEffect(() => {
    (async function () {
      try {
        setCreator(await lottery.methods.creator().call());
        setPlayers(await lottery.methods.getPlayers().call());
        setBalance(await web3.eth.getBalance(lottery.options.address));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  function onBetAmountChange(e) {
    setBetAmount(e.target.value);
  }

  async function onBet() {
    try {
      const accounts = await web3.eth.getAccounts();

      setMessage("Waiting on transaction success ...");
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(betAmount, "ether"),
      });
      setMessage("You have been entered!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function onPickWinner() {
    try {
      const accounts = await web3.eth.getAccounts();

      setMessage("Waiting on transaction success ...");
      await lottery.methods.endRound().send({
        from: accounts[0],
      });
      setMessage("You have been entered!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {creator}. <br />
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />

      <div>
        <h4>Want to try yout luck ?</h4>
        <div>
          <label>Amount of ether to enter</label>{" "}
          <input onChange={onBetAmountChange} value={betAmount} />
        </div>
        <button onClick={onBet}>Enter</button>
      </div>

      <hr />
      <h4>Ready to pick a winner ? </h4>
      <button onClick={onPickWinner}>Pick a Winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
