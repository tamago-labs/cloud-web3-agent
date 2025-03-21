const { Wallet } = require("@crypto.com/developer-platform-client")

// Test create wallets with SDK

const setupWallets = async () => {

    const wallet = await Wallet.create();

    console.log(wallet.data.address);
    console.log(wallet.data.privateKey);
    console.log(wallet.data.mnemonic);

}

setupWallets()