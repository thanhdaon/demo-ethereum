import Link from "next/link";
import Head from "next/head";
import { Container, Menu } from "semantic-ui-react";

const Layout = ({ title, children }) => {
  return (
    <div>
      {title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}

      <Container>
        <Menu style={{ marginTop: "10px" }}>
          <Link href="/" passHref={true}>
            <Menu.Item>CrowdCoin</Menu.Item>
          </Link>

          <Menu.Menu position="right">
            <Menu.Item>Campaigns</Menu.Item>
            <Link href="/campaigns/new" passHref={true}>
              <Menu.Item>+</Menu.Item>
            </Link>
          </Menu.Menu>
        </Menu>
        {children}
      </Container>
    </div>
  );
};
export default Layout;
