


import Header from "./Header"
import Hero from "./Hero"
import QuickFeatures from "./QuickFeatures"
import OnlineHostedServers from "./OnlineHostedServers"
import Artifacts from "./Artifacts"
// import TechnologiesSection from "./TechnologiesSection"
// import RecentlyAdded from "./RecentlyAdded"
import Tags from "./Tags"
import Problem from "./Problem"

const LandingContainer = () => {

    return (
        <div>
            <Header />
            <Hero />
            <Problem />
            <Artifacts />
            <QuickFeatures />
            {/* <TechnologiesSection /> */}
            <OnlineHostedServers />
            {/* <RecentlyAdded   /> */}
            <Tags />
        </div>
    )
}

export default LandingContainer