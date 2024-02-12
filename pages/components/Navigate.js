import React from 'react';
import NavbarUI from './ui/Navbar';

const Navigate = ({ accounts, web3Handler }) => {

  return (
    <>
      <NavbarUI web3Handler={web3Handler} accounts={accounts} />
    </>
  );
};

export default Navigate;
