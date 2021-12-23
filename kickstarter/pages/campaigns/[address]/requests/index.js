import Layout from "components/Layout";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import buildCampaignContract from "ethereum/campaign";
import RequestRow from "components/RequestRow";

function Requests({ address, requests, requestCount, approversCount }) {
  const { Header, Row, HeaderCell, Body } = Table;

  function renderRows() {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  }

  return (
    <Layout title="Request">
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const address = ctx.params.address;
  const campaign = buildCampaignContract(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approverCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((_, i) => campaign.methods.requests(i).call())
  );

  return {
    props: {
      address,
      requests: requests.map((r) => ({
        description: r["description"],
        value: r["value"],
        recipient: r["recipient"],
        complete: r["complete"],
        approvalCount: r["approvalCount"],
      })),
      requestCount,
      approversCount,
    },
  };
}

export default Requests;
