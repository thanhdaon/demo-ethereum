import { useState } from "react";
import Router from "next/router";
import { Form, Input, Button, Message } from "semantic-ui-react";
import buildCampaignContract from "ethereum/campaign";
import web3 from "ethereum/web3";

function ContributeForm({ address }) {
  const [contribute, setContribute] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const campaign = buildCampaignContract(address);

    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribute, "ether"),
      });

      Router.replaceRoute(`/campaigns/${address}`);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={onSubmit} error={!!errorMsg}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={contribute}
          onChange={(e) => setContribute(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMsg} />
      <Button primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
}

export default ContributeForm;
