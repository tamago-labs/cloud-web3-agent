
import Agent from "@/components/Agent"

const AgentPage = async ({ params }: any) => {

    const agentId = decodeURIComponent(params.agentId)
    
    return (
        <>

            <Agent
                agentId={agentId}
            />

        </>
    )
}

export default AgentPage