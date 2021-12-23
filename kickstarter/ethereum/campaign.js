import web3 from "ethereum/web3";
import Campaign from "ethereum/build/Campaign.json";

function buildCampaignContract(address) {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
}

export default buildCampaignContract;
