const assert = require('assert');
const { Account, SigningSchemeInput, Secp256k1PrivateKey } = require("@aptos-labs/ts-sdk")
const { Wallet } = require("@crypto.com/developer-platform-client")

describe('#Create Wallets by SDK', function () {
  it('returns correct length Aptos wallet address', async function () {

    // Generate a key for Aptos
    const { privateKey } = Account.generate({ scheme: SigningSchemeInput.Secp256k1Ecdsa });
    const key = new Secp256k1PrivateKey(privateKey.toAIP80String())
    const account = Account.fromPrivateKey({ privateKey: key });

    assert.equal(account.accountAddress.toString().length, 66)
  })

  it('returns correct length Cronos wallet address', async function () {

    // Generate a wallet for Cronos
    const wallet = await Wallet.create();
    assert.equal(wallet.data.address.length, 42)
  })

})