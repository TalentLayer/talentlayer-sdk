# Introduction

The "@talentLayer/client" is a framework agnostic sdk to interact with the talent layer protocol

## Getting Started

### Browser:

To get started with the TalentLayer SDK in a browser environment, you'll first need to initialize the TalentLayerClient. This client requires several configuration parameters to connect with the TalentLayer protocol and associated services.

#### Prerequisites

1. Ensure you have the necessary environment variables set up. These include:

`
INFURA_PROJECT_ID
INFURA_SECRET
INFURA_IPFS_BASE_URL
TALENT_LAYER_PLATFORM_ID
PUBLIC_SIGNATURE_API_URL
`

2. Install the package

```bash
npm install @talentlayer/client --save
```

#### Initialisation

```ts
import { TalentLayerClient } from '@talentLayer/client'; // Adjust the import based on the SDK's actual export structure

const client = new TalentLayerClient({
    chainId: YOUR_CHAIN_ID, // Replace with your chain ID
    ipfsConfig: {
        clientId: process.env.INFURA_PROJECT_ID,
        clientSecret: process.env.INFURA_SECRET,
        baseUrl: process.env.INFURA_IPFS_BASE_URL
    },
    platformId: parseInt(process.env.TALENT_LAYER_PLATFORM_ID),
    signatureApiUrl: process.env.PUBLIC_SIGNATURE_API_URL
});

```

> You can get a new `TALENT_LAYER_PLATFORM_ID` by following this tutorial: https://docs.talentlayer.org/get-a-platform-id

> `PUBLIC_SIGNATURE_API_URL` is an optional property. It can be omitted. For understanding how it works, refer to its usage in the starter-kit: https://github.com/TalentLayer-Labs/starter-kit

> You can get your infura client id, secret and base url from infura's official website by setting up a new project


### NodeJs (backend)

For backend applications, the TalentLayer SDK can be initialized similarly to the browser setup, but with an additional optional walletConfig parameter. This parameter allows for backend-specific configurations, especially when dealing with private keys or mnemonics for wallet interactions.

#### Prerequisites

As with the browser setup, ensure you have the necessary environment variables:

`
INFURA_PROJECT_ID
INFURA_SECRET
INFURA_IPFS_BASE_URL
TALENT_LAYER_PLATFORM_ID
PUBLIC_SIGNATURE_API_URL
`


#### Initialisation

Here's how to initialize the SDK on the backend:

```ts

import { TalentLayerClient } from '@talentLayer/client'; // Adjust the import based on the SDK's actual export structure

const client = new TalentLayerClient({
    chainId: YOUR_CHAIN_ID, // Replace with your chain ID
    ipfsConfig: {
        clientId: process.env.INFURA_PROJECT_ID,
        clientSecret: process.env.INFURA_SECRET,
        baseUrl: process.env.INFURA_IPFS_BASE_URL
    },
    platformId: parseInt(process.env.TALENT_LAYER_PLATFORM_ID),
    signatureApiUrl: process.env.PUBLIC_SIGNATURE_API_URL,
    walletConfig: {
        rpcUrl: YOUR_RPC_URL, // Your RPC URL
        privateKey: '0xYOUR_PRIVATE_KEY', // Your private key prefixed with '0x'
        mnemonic: 'YOUR_MNEMONIC', //  Your mnemonic phrase
        chainId: YOUR_CHAIN_ID
    }
});

```

> Note: The parameters in walletConfig are all optional. However, the backend environment will not have a window.ethereum object. Hence, you are required to provide atleast the `rpcUrl`, and one of `privateKey` or `menmonic`








