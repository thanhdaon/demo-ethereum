import Web3 from "web3";

function buildWeb3() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    return new Web3(window.ethereum);
  }

  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/e49819b000fb49b5871e3b51919698e3"
  );

  return new Web3(provider);
}

export default buildWeb3();
