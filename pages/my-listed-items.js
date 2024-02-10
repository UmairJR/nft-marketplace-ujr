import React from 'react'
import ListedItems from './components/ListedItems'

const mylisteditems = () => {
  return (
    <div>
      <ListedItems mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts}/>
    </div>
  )
}

export default mylisteditems
