import React from 'react'
import Create from './components/Create'

const CreatePage = () => {
  return (
    <Create mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts} />
  )
}

export default CreatePage
