import { useEffect, useState, useCallback } from "react"
import BaseModal from "./base"
import useDatabase from "@/hooks/useDatabase"

const AgentSettingsModal = ({ visible, close, agent, increaseTick }: any) => {

    const { updateAgent } = useDatabase()

    const [name, setName] = useState<any>()
    const [isTestnet, setIsTestnet] = useState(false)

    useEffect(() => {
        if (agent) {
            setName(agent.name)
            setIsTestnet(agent.isTestnet ? true : false)
        }
    }, [agent])

    const onUpdate = useCallback(async () => {
        if (!name || name.length <= 3) {
            return
        }

        // await updateAgent(agent.id, name, isTestnet)

        increaseTick()
        close()

    }, [agent, name, isTestnet])

    return (
        <BaseModal
            visible={visible}
        >

            {agent && (
                <div className="px-2 sm:px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl  font-semibold">Agent Settings</h3>
                        <button onClick={close} className="text-gray-400 cursor-pointer hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4 p-4">
                        <div className='grid grid-cols-4 gap-3'>
                            <div className='flex'>
                                <label htmlFor="agent-name" className="block my-auto text-white text font-semibold ">
                                    Agent Name:
                                </label>
                            </div>

                            <input
                                id="agent-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full col-span-3 px-4 py-2 border border-white/10 rounded bg-white/5 focus:border-white/10 focus:ring-0 "
                                placeholder="My Aptos Agent"
                            />

                            <div className='flex'>
                                <label htmlFor="agent-name" className="block my-auto text-white text font-semibold ">
                                    Network:
                                </label>
                            </div>

                            <div className="col-span-3 space-x-2">
                                <button onClick={() => setIsTestnet(false)} className={`cursor-pointer ${isTestnet ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Mainnet</button>
                                <button onClick={() => setIsTestnet(true)} className={`cursor-pointer ${!isTestnet ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Testnet</button>
                            </div>

                        </div>

                        <div className="flex  pb-0 space-x-2">
                            <button onClick={onUpdate} className="bg-white cursor-pointer ml-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                Update
                            </button>
                            <button onClick={close} className="bg-white cursor-pointer px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                Close
                            </button>
                        </div>
                    </div>
 
                </div>
            )

            }

        </BaseModal>
    )
}

export default AgentSettingsModal