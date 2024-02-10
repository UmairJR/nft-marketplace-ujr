import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap'

const Home = ({ mpContract, nftContract, web3, accounts }) => {
    // const sender_address = accounts[0];
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    const loadMarketplaceItems = async () => {
        console.log('Loading....');
        try{
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
                console.log("RESPONSE: ",response)
                // console.log("RESPONSE JSON: ",response.json())
                const metadata = response.data;
                console.log("METADATA: ", metadata);
                const totalPrice = await mpContract.methods.getTotalPrice(item.itemId).call();
                console.log("TOTALPRICE: ", totalPrice);
                items.push({
                    totalPrice,
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
        catch(err){
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
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    )
    return (
        <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyNft(item)} variant="primary" size="lg">
                        Buy for {web3.utils.fromWei(item.totalPrice.toString(), 'ether')} ETH
                      </Button>
                    </div>
                    <br />
                Seller Address: {item.seller}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
    )
}

export default Home
