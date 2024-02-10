import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap'

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
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div className="flex justify-center">
      {purchasedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Purchased</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {purchasedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{item.totalPriceEther} ETH
                  <br />
                Seller Address: {item.sellerAddress}
                <br />
                Buyer Address: {item.buyerAddress}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Purchases</h2>
          </main>
        )}
    </div>

  )
}

export default PurchasedItems
