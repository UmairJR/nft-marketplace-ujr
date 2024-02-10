import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import market from '../../public/market.png';

const Navigate = ({ accounts, web3Handler}) => {
  const linkStyles = {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s ease-in-out',
    marginRight: '10px',
  };
  return (
    <Navbar expand="lg" bg="secondary" variant="dark">
      <Container>
        <Navbar.Brand>
          <img src="./market.png" width="40" height="40" className="" alt="" />
          &nbsp; UJR NFT Marketplace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            
              <Link href="/" style={linkStyles}>Home </Link>
           
              <Link href="/create" style={linkStyles}>Create</Link>
          
              <Link href="/my-listed-items" style={linkStyles}>My Listed Items </Link>
            
            
              <Link href="/my-purchases" style={linkStyles}>My Purchases</Link>
           
          </Nav>
          <Nav className="mr-auto">
            {accounts ? (
              <Button variant="outline-light">
                {accounts[0].slice(0, 5) + '...' + accounts[0].slice(38, 42)}
              </Button>
            ) : (
              <>
              <Button onClick={web3Handler} variant="outline-light">
                Connect Wallet
              </Button>
             
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigate;
