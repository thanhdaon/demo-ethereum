import React, { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "components/Layout";
import factory from "ethereum/factory";
import web3 from "ethereum/web3";

function CampaignNew() {
  const [minimumContribution, setMinimunContribution] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h3>Create Campaign</h3>
      <Form onSubmit={onSubmit} error>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimunContribution(e.target.value)}
          />
        </Form.Field>
        {errorMsg && <Message error header="Oops!" content={errorMsg} />}
        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
}

export default CampaignNew;
