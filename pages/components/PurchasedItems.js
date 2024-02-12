import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ListCardUI from './ui/ListCard';

const PurchasedItems = ({ mpContract, nftContract, web3, accounts }) => {
  const [loading, setLoading] = useState(true);
  const [purchasedItems, setPurchasedItems] = useState([]);

  const loadPurchasedItems = async () => {
    try {
      const totalItems = await mpContract.methods.itemCount().call();
      console.log("Total item: ", totalItems);
      let purchasedItems = [];
      for (let i = 1; i <= totalItems; i++) {
        const item = await mpContract.methods.items(i).call();
        console.log("Item: ", item);
        console.log(accounts[0]);
        console.log(item.buyer.toLowerCase());
        if (item.buyer.toLowerCase() === accounts[0] && item.sold) {
          const uri = await nftContract.methods.tokenURI(item.itemId).call();
          const response = await axios.get(uri);
          const metadata = response.data;
          const totalPrice = await mpContract.methods.getTotalPrice(item.itemId).call()
          const totalPriceEther = web3.utils.fromWei(totalPrice.toString(),'ether');
          const itemPriceEther = web3.utils.fromWei(item.price.toString(),'ether')
          let itemList = {
            totalPriceEther,
            price: itemPriceEther,
            itemId: item.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            sellerAddress: item.seller,
            buyerAddress: item.buyer
          }
          purchasedItems.push(itemList);
        }
        console.log("Purchased items: ", purchasedItems);
        setPurchasedItems(purchasedItems);
        setLoading(false);
        
      }
    }
    catch (err) {
      console.log("Error",err);
    }
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])

  if (loading) return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <span className="loading loading-ring loading-md"></span>
      <p className='mx-3 my-0 font-bold text-lg text-primary'>Loading...</p>
    </main>
  )

  return (
    <div className="mt-5 mb-10">
      <h1 className="text-3xl font-bold font-serif mb-5 text-center">Purchased NFTs</h1>
        <div className="px-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center">
          {purchasedItems.length > 0 ? (
            purchasedItems.map((item, idx) => (
              <div key={idx}>
                <ListCardUI item={item} isPurchased={true} />
              </div>
            ))
          ) : (
            <main style={{ padding: "1rem 0" }}>
            <h1 className="text-3xl font-bold font-serif mb-4 text-center">No Purchased NFTs</h1>
            </main>
          )}
        </div>
    </div>

  )
}

export default PurchasedItems
