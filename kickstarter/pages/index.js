import factory from "ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "components/Layout";
import Link from "next/link";
import Router from "next/router";

function Home({ campaigns }) {
  const items = campaigns.map((address) => ({
    header: address,
    description: (
      <Link href={`/campaigns/${address}`}>
        <a>View Campaign</a>
      </Link>
    ),
    fluid: true,
  }));

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
          onClick={() => Router.push("/campaigns/new")}
        />
        <Card.Group items={items} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: { campaigns },
  };
}

export default Home;
