import React from 'react';
import { Navbar, Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { useWeb3 } from '../utils/Web3Provider';

const Dashboard = () => {
  const { web3, accounts, nftContract, mpContract, web3Handler } = useWeb3();
  return (
    <div>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Nav className="mr-auto">
            {accounts ? (
              <Button variant="outline-light">
                {accounts[0].slice(0, 5) + '...' + accounts[0].slice(38, 42)}
              </Button>
            ) : (
              <Button onClick={web3Handler} variant="outline-light">
                Connect Wallet
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row>
          <Col lg={12} className="d-flex text-center">
            <div className="content mx-auto">
              <h1>NFT MARKETPLACE</h1>
              <p>Learning to mint NFTs.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;