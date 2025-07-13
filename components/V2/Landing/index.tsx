 

 
import Header from "./Header"
import Hero from "./Hero"
import QuickFeatures from "./QuickFeatures"
import OnlineHostedServers from "./OnlineHostedServers"
import GeneratedArtifacts from "./GeneratedArtifacts"
import RecentlyAdded from "./RecentlyAdded"
import Tags from "./Tags"

const LandingContainer = () => {

    return (
        <div>

            <Header />

            <Hero />
            <QuickFeatures />

             <GeneratedArtifacts />
            <OnlineHostedServers  />
           
            {/* <RecentlyAdded   /> */}

            <Tags />
        </div>
    )
}

export default LandingContainer