import ArtifactContainer from "@/components/V2/Artifact"
import Footer from "@/components/Footer"

const ArtifactPage = async ({ params }: any) => {

    const artifactId = decodeURIComponent(params.artifactId)
    
    return (
        <>
            <ArtifactContainer
                artifactId={artifactId}
            />
            <Footer/>
        </>
    )
}

export default ArtifactPage