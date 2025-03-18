const { Account, SigningSchemeInput, Secp256k1PrivateKey } = require("@aptos-labs/ts-sdk")

// Test create wallets with SDK

const setupWallets = async () => {

    // Generate a key for Aptos
    const { privateKey } = Account.generate({ scheme: SigningSchemeInput.Secp256k1Ecdsa }); 
    const key = new Secp256k1PrivateKey(privateKey.toAIP80String())
    const account = Account.fromPrivateKey({ privateKey : key });
    console.log(account.accountAddress.toString())

}

setupWallets()