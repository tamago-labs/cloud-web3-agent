
import ServerContainer from "@/components/V2/Server"

const ServerPage = async ({ params }: any) => {

    const serverId = decodeURIComponent(params.serverId)
    
    return (
        <>

            <ServerContainer
                serverId={serverId}
            />

        </>
    )
}

export default ServerPage