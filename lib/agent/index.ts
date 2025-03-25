import { CronosEvm, CronosZkEvm, Client, Token, Wallet, Contract, Transaction, Exchange } from "@crypto.com/developer-platform-client"
import { ethers } from "ethers"

export class CronosAgent {

    wallet: any
    chain: CronosEvm | CronosZkEvm

    constructor(
        privateKey: string,
        chain: CronosEvm | CronosZkEvm,
        blockexplorerApiKey: string,
        openAiApiKey: string
    ) {

        const provider = ethers.getDefaultProvider(this.getProvider(chain))
        this.wallet = new ethers.Wallet(privateKey, provider)
        this.chain = chain

        Client.init({
            chain,
            apiKey: blockexplorerApiKey
        })

    }

    getAgentAddress = async () => {
        return this.wallet.address
    }

    getNativeTokenBalance = async (walletAddress: string) => {
        return await Token.getNativeTokenBalance(walletAddress)
    }

    getERC20TokenBalance = async (walletAddress: string, contractAddress: string) => {
        return await Token.getERC20TokenBalance(walletAddress, contractAddress)
    }

    getWalletBalance = async (walletAddress: string) => {
        return await Wallet.balance(walletAddress)
    }

    getContractAbi = async (contractAddress: string) => {
        return await Contract.getContractABI(contractAddress)
    }

    getTransactionByHash = async (transactionHash: string) => {
        return await Transaction.getTransactionByHash(transactionHash)
    }

    getTransactionStatus = async (transactionHash: string) => {
        return await Transaction.getTransactionStatus(transactionHash)
    }

    transferERC20Tokens = async (tokenAddress: string, toAddress: string, amount: number): Promise<string> => {
        // Create contract interface for ERC-20
        const erc20Interface = new ethers.Interface([
            "function transfer(address to, uint256 amount) returns (bool)"
        ]);

        // Create contract instance
        const tokenContract = new ethers.Contract(tokenAddress, erc20Interface, this.wallet);

        // Transfer tokens
        const tx = await tokenContract.transfer(
            toAddress,
            ethers.parseUnits(amount.toString(), 18), // Assuming 18 decimals, adjust if needed

        );

        return tx.hash;
    }

    transferNativeTokens = async (toAddress: string, amount: number,): Promise<string> => {

        // Transfer native token
        const tx = await this.wallet.sendTransaction({
            to: toAddress,
            value: ethers.parseEther(amount.toString())
        });

        return tx.hash;
    }

    getExchangeAvailableTickers = async () => {
        return await Exchange.getAllTickers()
    }

    getExchangeTicker = async (name: string) => {
        return await Exchange.getTickerByInstrument(name)
    }

    getProvider = (chain: CronosZkEvm | CronosEvm): string => {
        if (chain === CronosZkEvm.Testnet) {
            return "wss://ws.testnet.zkevm.cronos.org"
        } else if (chain === CronosZkEvm.Mainnet) {
            return "wss://ws.zkevm.cronos.org"
        } else if (chain === CronosEvm.Testnet) {
            return "https://evm-t3.cronos.org/"
        } else {
            return "https://evm.cronos.org"
        }
    }

}