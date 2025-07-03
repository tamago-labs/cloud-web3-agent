
import BrowseAllContainer from "@/components/V2/Browse"
import Footer from "@/components/Footer"
import { allServers } from "../../data/mockServers"

export default function BrowsePage() {
  return (
    <>
      <BrowseAllContainer
        allServers={allServers}
      />
      <Footer />
    </>
  );
}
