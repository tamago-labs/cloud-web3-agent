 
import LandingContainer from "@/components/V2/Landing"
import Footer from "@/components/Footer"
import { allServers } from "../data/mockServers"


export default function App() {
  return (
    <> 
      <LandingContainer
        allServers={allServers}
      />
      <Footer/>
    </>
  );
}
