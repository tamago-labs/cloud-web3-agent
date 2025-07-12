
import ServerContainer from "@/components/V2/Server"
import Footer from "@/components/Footer"

const ServerPage = async ({ params }: any) => {

    const serverId = decodeURIComponent(params.serverId)
    
    return (
        <>

            <ServerContainer
                serverId={serverId}
            />
            <Footer/>
        </>
    )
}

export default ServerPage