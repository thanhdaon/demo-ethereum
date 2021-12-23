import { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "components/Layout";
import buildCampaignContract from "ethereum/campaign";
import web3 from "ethereum/web3";

function RequestNew({ contractAddress }) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const campaign = buildCampaignContract(contractAddress);

    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMsg}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
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

export async function getServerSideProps(ctx) {
  const contractAddress = ctx.params.address;
  return {
    props: { contractAddress },
  };
}

export default RequestNew;
