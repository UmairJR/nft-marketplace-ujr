import React from 'react'
import PurchasedItems from './components/PurchasedItems'

const mypurchasesitems = () => {
  return (
    <div>
      <PurchasedItems mpContract={mpContract} nftContract={nftContract} web3={web3} accounts={accounts}/>
    </div>
  )
}

export default mypurchasesitems
