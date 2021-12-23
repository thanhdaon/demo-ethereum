import web3 from "ethereum/web3";
import CampaignFactory from "ethereum/build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x0293D70dE53dE970c063A510CE5EE095e756D0b4"
);

export default instance;
