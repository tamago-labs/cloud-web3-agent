"use client"

import Header from "./Header"
import Hero from "./Hero"
import QuickFeatures from "./QuickFeatures"
import OnlineHostedServers from "./OnlineHostedServers"
import RecentlyAdded from "./RecentlyAdded"
import Tags from "./Tags"

const LandingContainer = () => {
    return (
        <div>

            <Header/>
            
            <Hero/>
            <QuickFeatures/>
            <OnlineHostedServers/>
            <RecentlyAdded/>
            <Tags/>
        </div>
    )
}

export default LandingContainer