import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap'

function renderSoldItems(items) {
  console.log("Sold items: ",items);
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {item.totalPriceEther} ETH - Recieved {item.price} ETH
                <br />
                Buyer Address: {item.buyerAddress}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

const ListedItems = ({ mpContract, nftContract, web3, accounts }) => {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const loadListedItems = async () => {
    try {
      const totalItems = await mpContract.methods.itemCount().call();
      console.log("Total item: ", totalItems);
      let listedItems = [];
      let soldItems = [];
      for (let i = 1; i <= totalItems; i++) {
        const item = await mpContract.methods.items(i).call();
        console.log("Item: ", item);
        console.log(accounts[0]);
        console.log(item.seller.toLowerCase());
        if (item.seller.toLowerCase() === accounts[0]) {
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
            buyerAddress: item.buyer
          }
          listedItems.push(itemList);
          if (item.sold) {
            soldItems.push(itemList);
          }
        }
        console.log("Listed items: ", listedItems);
        console.log("Sold items: ", soldItems);
        setListedItems(listedItems);
        setSoldItems(soldItems);
        setLoading(false);
        
      }
    }
    catch (err) {
      console.log("Error",err);
    }
  }

  useEffect(() => {
    loadListedItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{item.totalPriceEther} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
            {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  )
}

export default ListedItems
