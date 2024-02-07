import { create } from '@web3-storage/w3up-client';

let w3upClient;

export const initializeW3UpClient = async () => {
  w3upClient = await create();
};

export const authorizeAgent = async (email) => {
    if (!w3upClient) {
      throw new Error('w3up client not initialized. Call initializeW3UpClient first.');
    }
  
    try {
      await w3upClient.authorize(email);
      console.log(`Agent authorized successfully for email: ${email}`);
    } catch (error) {
      console.error('Authorization failed:', error);
      throw error;
    }
  };

export const uploadFileToW3 = async (file, spaceDid = 'did:key:z6MkmUPHGfBATCh86dGVnL17orXiAiDbF4w1zaYetzHwMPD6') => {
  if (!w3upClient) {
    throw new Error('w3up client not initialized. Call initializeW3UpClient first.');
  }

  try {
    await authorizeAgent('umairjr1265@gmail.com');
    await w3upClient.setCurrentSpace(spaceDid);
    const cid = await w3upClient.uploadFile(file);
    console.log('File uploaded successfully. CID:', cid);
    return cid;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};