import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap'
import CardUI from './ui/Card';

const Home = ({ mpContract, nftContract, web3, accounts }) => {
  // const sender_address = accounts[0];
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadMarketplaceItems = async () => {
    console.log('Loading....');
    try {
      const totalItems = await mpContract.methods.itemCount().call();
      console.log("Total item count: ", totalItems);
      let items = [];
      for (let i = 1; i <= totalItems; i++) {
        const item = await mpContract.methods.items(i).call();
        console.log("ITEM: ", item);
        if (!item.sold) {
          const uri = await nftContract.methods.tokenURI(item.tokenId).call();
          console.log("URI: ", uri);
          const response = await axios.get(uri);
          console.log("RESPONSE: ", response)
          // console.log("RESPONSE JSON: ",response.json())
          const metadata = response.data;
          console.log("METADATA: ", metadata);
          const totalPrice = await mpContract.methods.getTotalPrice(item.itemId).call();
          console.log("TOTALPRICE: ", totalPrice);
          const totalPriceEther = web3.utils.fromWei(totalPrice.toString(), 'ether');
          items.push({
            totalPrice,
            totalPriceEther,
            itemId: item.itemId,
            seller: item.seller,
            buyer: item.buyer,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
          })
        }
      }
      setLoading(false);
      console.log("ITEMS: ", items);
      setItems(items);
    }
    catch (err) {
      console.log(err);
    }

  }
  const buyNft = async (item) => {
    console.log("Buying....")
    try {
      const tx = await mpContract.methods.purchaseItem(item.itemId).send({
        from: accounts[0],
        value: item.totalPrice
      });
      if (tx.status) {
        loadMarketplaceItems();
      } else {
        console.error("Transaction failed.");
      }
    }
    catch (error) {
      console.error("Error purchasing item:", error);
    }
    finally {
      console.log("Purchased!!!");
    }
  }
  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <span className="loading loading-ring loading-md"></span>
      <p className='mx-3 my-0 font-bold text-lg text-primary'>Loading...</p>
    </main>
  )
  return (
    <div className="mt-5 mb-10">
      <h1 className="text-3xl font-bold font-serif mb-4 text-center">NFTs</h1>
      <div className="px-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx}>
              <CardUI item={item} buyNft={buyNft} isNew={idx === items.length - 1} />
            </div>
          )).reverse()
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h1 className="text-3xl font-bold font-serif mb-4 text-center">No listed NFTs</h1>
          </main>
        )}
      </div>
    </div>
  );
}

export default Home
