import Header from "./Header"
import Hero from "./Hero"
import HowItWorks from "./HowItWorks" 
import Artifacts from "./Artifacts"  
import SampleConversations from "./SampleConversations"
import Problem from "./Problem"
import OnlineHostedServers from "./OnlineHostedServers"
import CTASection from "./CTASection"

const LandingContainer = () => {

    return (
        <div>
            <Header />
            <Hero />
            <Problem />  
            <Artifacts />
            <HowItWorks /> 
            <OnlineHostedServers/>
            <CTASection/> 
        </div>
    )
}

export default LandingContainer