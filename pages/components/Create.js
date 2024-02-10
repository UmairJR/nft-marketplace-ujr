import React from 'react'
import { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import { uploadFileToW3, initializeW3UpClient } from '../utils/w3-storage';

const Create = ({ mpContract, nftContract, web3, accounts }) => {
    const marketplace_contract_address = "0xF00B9f871b0306Ca5de7Fb5f2c6abcA9bb8AD3a2";
    const nft_contract_address = "0x857B76c752671d549604682bFBc08691A2517279"
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [disabled, setDisabled] = useState(true);

    const uploadToW3Storage = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                await initializeW3UpClient();
                const cid = await uploadFileToW3(file);
                console.log(cid.toString());
                const url = `https://${cid}.ipfs.w3s.link`;
                console.log(url);
                setImage(url);
            } catch (error) {
                console.log('W3 storage image upload error: ', error);
            }
            finally {
                setDisabled(false);
            }
        }

    };

    const createNFT = async () => {
        if (!image || !price || !name || !description) return;
        try {
            await initializeW3UpClient();
            const obj = { image, price, name, description };
            // Create a Blob from the JSON object
            const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            // Create a File object from the Blob
            const file = new File([blob], 'nft-metadata.json');
            const cid = await uploadFileToW3(file);
            console.log(cid.toString());
            mintThenList(cid);
        } catch (error) {
            console.log('IPFS tokenURI ERROR ', error);
        }
    };

    const mintThenList = async (cid) => {
        const uri = `https://${cid}.ipfs.w3s.link`;
        console.log(uri)
        console.log("Minting....")
        try {
            // mint nft
            await (await nftContract.methods.mint(uri)).send({ from: accounts[0] });
            console.log("Minted!!!!");
            // get tokenId of new nft
            const id = await nftContract.methods.tokenCount().call();
            // approve marketplace to spend nft

            // console.log("CURR Account: ", accounts[0])
            await (await nftContract.methods.setApprovalForAll(marketplace_contract_address, true)).send({
                from: accounts[0]
            });
            console.log("Aprroved!!!!");
            // 0x55896D308A136f3C58FD590F69F066Deb2ad87B1
            // add nft to marketplace
            const listingPrice = web3.utils.toWei(price.toString(), 'ether');
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 200000;
            await mpContract.methods.makeItem(nft_contract_address, id, listingPrice).send(
                {
                    from: accounts[0]
                    //     // gasPrice: gasPrice,
                    //     // gas: gasLimit,
                }
            );



        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToW3Storage}
                            />
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" disabled={disabled} />
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" disabled={disabled} />
                            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" disabled={disabled} />
                            <div className="d-grid px-0">
                                <Button onClick={createNFT} disabled={disabled} variant="primary" size="lg">
                                    Create & List NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Create