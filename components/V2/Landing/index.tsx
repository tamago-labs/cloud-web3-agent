


import Header from "./Header"
import Hero from "./Hero"
import QuickFeatures from "./QuickFeatures"
import OnlineHostedServers from "./OnlineHostedServers"
import Artifacts from "./Artifacts"  
import Problem from "./Problem"

const LandingContainer = () => {

    return (
        <div>
            <Header />
            <Hero />
            <Problem />
            <Artifacts />
            <QuickFeatures /> 
            <OnlineHostedServers />  
        </div>
    )
}

export default LandingContainer