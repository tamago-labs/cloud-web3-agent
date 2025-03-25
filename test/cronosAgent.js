
// const assert = require('assert');
// const { ChatOpenAI } = require("@langchain/openai")
// const { Wallet, CronosEvm } = require("@crypto.com/developer-platform-client")
// const { createReactAgent } = require("@langchain/langgraph/prebuilt")
// const { CronosAgent } = require("../lib/index.ts") 

// describe('#Cronos Agent', function () {

//     beforeEach(async function () {
//         agent = await initializeAgent()
//     });

//     it('returns the agent address', async function () {

//         console.log("agent: ", agent)

//         assert.equal(true, true)
//     })

// })

// async function initializeAgent() {
//     // try {
//     //   const llm = new ChatOpenAI({
//     //     modelName: "gpt-4o-mini",
//     //     temperature: 0.3,
//     //   });

//     //   let walletDataStr: string | null = null;

//     //   if (fs.existsSync(WALLET_DATA_FILE)) {
//     //     try {
//     //       walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
//     //     } catch (error) {
//     //       console.error("Error reading wallet data:", error);
//     //     }
//     //   }

//     //   const solanaAgent = new SolanaAgentKit(
//     //     process.env.SOLANA_PRIVATE_KEY!,
//     //     process.env.RPC_URL!,
//     //     {
//     //       OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
//     //       HELIUS_API_KEY: process.env.HELIUS_API_KEY!,
//     //       PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY!,
//     //     },
//     //   );

//     //   const tools = createSolanaTools(solanaAgent);

//     //   const memory = new MemorySaver();
//     //   const config = { configurable: { thread_id: "Solana Agent Kit!" } };

//     //   const agent = createReactAgent({
//     //     llm,
//     //     tools,
//     //     checkpointSaver: memory,
//     //     messageModifier: `
//     //       You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
//     //       empowered to interact onchain using your tools. If you ever need funds, you can request them from the
//     //       faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
//     //       (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
//     //       can't do with your currently available tools, you must say so, and encourage them to implement it
//     //       themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be
//     //       concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
//     //     `,
//     //   });

//     //   if (walletDataStr) {
//     //     fs.writeFileSync(WALLET_DATA_FILE, walletDataStr);
//     //   }

//     //   return { agent, config };
//     // } catch (error) {
//     //   console.error("Failed to initialize agent:", error);
//     //   throw error;
//     // }

//     try {

//         const llm = new ChatOpenAI({
//             modelName: "gpt-4o-mini",
//             temperature: 0.3,
//             // apiKey: process.env.OPENAI_API_KEY
//         })

//         const wallet = await Wallet.create()
//         const walletPrivateKey = wallet.data.privateKey

//         const cronosAgent = new CronosAgent(
//             walletPrivateKey,
//             CronosEvm.Testnet,
//             process.env.CRONOS_ZKEVM_API_KEY,
//             process.env.OPENAI_API_KEY
//         )


//         return "1234"
//     } catch (error) {
//         console.error("Failed to initialize agent:", error);
//         return null
//     }

// }