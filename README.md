# Talent Layer SDK

The Talent Layer sdk enables you to interact with the TalentLayer protocol.

## Getting Started

To get started with the SDK and how to create a client read the doc here: [click here 🦝](https://github.com/TalentLayer/talentlayer-sdk/tree/develop/packages/client#introduction)

## Build the package on your own

> The SDK is not yet published on NPM since it is still under development.

1. clone the repo

`git@github.com:TalentLayer/talentlayer-sdk.git`

2. navigate into the client

`cd packages/client`

3. switch to node version 18

`nvm use 18`

4. install all dependencies

`npm install`

5. prepare the sdk for usage

`npm run prepare`

6. link the sdk so it can be used as a node_module

`npm link`

7. now the sdk-client is available as `@TalentLayer/client`

8. cd into your own node project

`cd my-project`

9. link the package

`npm link @TalentLayer/client`

10. now you should be able to use the SDK
