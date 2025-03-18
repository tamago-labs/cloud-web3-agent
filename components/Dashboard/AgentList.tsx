import Link from "next/link"
import { useRouter } from "next/navigation";
import { Plus, DownloadCloud } from "react-feather";
import { secondsToDDHHMMSS } from "../../helpers"

const AgentList = ({ agents }: any) => {

    console.log("agents: ", agents)

    const router = useRouter()

    const getId = (name: string) => {
        let id = "#"
        if (name && name[0]) {
            id = (name[0]).toLocaleUpperCase()
        }
        return id
    }

    const navigate = (href: string) => {
        router.push(href)
    }

    const getStatusBadge = (isActive: boolean) => {
        switch (isActive) {
            case true:
                return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
            case (false || undefined || null):
                return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Paused</span>;
            default:
                return null;
        }
    };

    const mockData = [
        { id: 1, trader: "0x7fa9...82c3", value: 3600, allocation: 30, profit: 32.4, assets: ["APT", "USDC"], status: "active" },
        { id: 2, trader: "0x3e8d...76b1", value: 3000, allocation: 25, profit: 18.7, assets: ["APT", "BTC"], status: "active" },
        { id: 3, trader: "0xf42c...19a5", value: 2400, allocation: 20, profit: -4.2, assets: ["ETH", "USDC"], status: "paused" },
        { id: 4, trader: "0x8a1b...54e2", value: 1200, allocation: 15, profit: 7.8, assets: ["SOL", "USDT"], status: "active" },
        { id: 5, trader: "0x2d6f...91c7", value: 1800, allocation: 10, profit: 12.3, assets: ["APT", "BNB"], status: "active" },
    ];

    return (
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10 flex flex-row">
                <h2 className="text-xl my-auto font-semibold">Agent List</h2>
                <button onClick={() => navigate("/dashboard/new")} className="bg-gradient-to-r cursor-pointer my-auto ml-auto from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                    <Plus className="mr-1" />
                    Add New Agent
                </button>
                <button onClick={() => navigate("/dashboard/marketplace")} className="bg-gradient-to-r cursor-pointer my-auto ml-2 from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                    <DownloadCloud className="mr-2" />
                    Deploy From Marketplace
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-black/20  ">
                            <th className="text-left p-4 font-medium text-gray-400">Name</th>
                            {/* <th className="text-left p-4 font-medium text-gray-400">Network</th> */}
                            <th className="text-left p-4 font-medium text-gray-400">Profit/Loss</th>
                            <th className="text-left p-4 font-medium text-gray-400">Assets</th>
                            <th className="text-left p-4 font-medium text-gray-400">Value</th>
                            <th className="text-left p-4 font-medium text-gray-400">Status</th>
                            <th className="text-left p-4 font-medium text-gray-400">Next Run</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((agent: any, index: number) => {

                            let countdown = "In 0d"

                            if (agent.isActive && agent.lastRanAt) { 
                                const diffTime = ((agent.lastRanAt + agent.schedule) * 1000) - (new Date()).valueOf()
                                const totals = Math.floor(diffTime / 1000)
                                const { days, hours, minutes } = secondsToDDHHMMSS(totals)
                                if (0 > Number(days)) {
                                    countdown = `In ${days}d ${hours}h`
                                } else {
                                    countdown = `In ${hours}h ${minutes}m`
                                }

                            }

                            let mock

                            if (mockData[index]) {
                                mock = mockData[index]
                            }

                            return (
                                <tr key={agent.id} onClick={() => navigate(`/dashboard/agent/${agent.id}`)} className="border-t cursor-pointer border-white/5 hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full mr-3 flex items-center justify-center text-sm font-bold">
                                                {getId(agent.name)}
                                            </div>
                                            <span >
                                                {agent.name}
                                            </span>
                                        </div>
                                    </td>
                                    {/*<td className="p-4">
                                    <span className="capitalize "> 
                                        {agent.blockchain}
                                       {agent.isTestnet && <span className="px-3 ml-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Testnet</span>}
                                    </span> 
                                </td> */}
                                    <td className="p-4">
                                        {mock && (
                                            <span className={mock.profit >= 0 ? "text-green-400" : "text-red-400"}>
                                                {mock.profit >= 0 ? "+" : ""}{mock.profit}%
                                            </span>
                                        )}
                                    </td>
                                   
                                    <td className="p-4">
                                        <div className="flex space-x-1">
                                            {mock && mock.assets.map((asset) => (
                                                <span key={asset} className="bg-blue-900/30 px-2 py-1 rounded text-xs">
                                                    {asset}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                     <td className="p-4">
                                        {mock && (
                                            <span  >
                                               ${mock.value.toLocaleString()}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(agent.isActive)}
                                    </td>
                                    <td className="p-4">
                                        {(!agent.isActive || !agent.lastRanAt) && (
                                            <span className="  ">
                                                Not scheduled
                                            </span>
                                        )}
                                        {(agent.isActive && agent.lastRanAt) && (
                                            <span className="  ">
                                                {countdown}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AgentList