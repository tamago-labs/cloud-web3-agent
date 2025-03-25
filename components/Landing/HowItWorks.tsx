import Link from "next/link";
import { ArrowDown, ChevronDown } from "react-feather";


const HowItWorks = () => {

    const steps = [
        {

            title: "Deploy Your AI Agent",
            description: "Select your blockchain and SDK to launch your AI agent in seconds",
            bgColor: "bg-blue-600"
        },
        {

            title: "Interact & Test",
            description: "Chat with the agent to explore its capabilities or perform initial transactions",
            bgColor: "bg-indigo-600"
        },
        {

            title: "Automate Tasks",
            description: "Setup automation rules to execute actions based on conditions",
            bgColor: "bg-purple-600"
        },
        {

            title: "Optimize Performance",
            description: "Adjust settings and prompts to maximize profitability, yield or efficiency",
            bgColor: "bg-violet-600"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10" id="how-it-works">
            <div className="max-w-6xl relative mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>

                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center cursor-default  transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">

                                <div className="bg-white rounded-xl shadow-md p-6 px-4 text-center h-full w-full">
                                    <div className="flex flex-col">
                                        <div className={`${step.bgColor} w-12 h-12 mx-auto   rounded-full flex items-center justify-center shadow-lg`}>
                                            <h1 className="font-bold text-xl">{index + 1}</h1>
                                            <span className="sr-only">Step {index + 1}</span>
                                        </div>
                                        <h3 className="text-xl  mb-1 mt-2 mx-auto  font-semibold text-gray-900  ">{step.title}</h3>
                                    </div>

                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                                <div className="md:hidden pt-4 text-purple-600 text-2xl font-bold my-2">
                                    <ArrowDown size={24} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/dashboard">
                            <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                Try It Now
                            </button>
                        </Link>

                    </div>
                </div>

                <div className="relative w-full max-w-4xl mx-auto my-[60px]">
                    <iframe
                        className="w-full h-64 sm:h-80 md:h-128"
                        src="https://www.youtube.com/embed/6n23-tS1WCk"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-white bg-black bg-opacity-50 p-2">
                        <p className="text-lg font-semibold">With Aptos and Move Agent Kit SDK</p>
                    </div>
                </div>

                <div className="relative w-full max-w-4xl mx-auto my-[60px]">
                    <iframe
                        className="w-full h-64 sm:h-80 md:h-128"
                        src="https://www.youtube.com/embed/_hwQldVOurU"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-white bg-black bg-opacity-50 p-2">
                        <p className="text-lg font-semibold">Deploy AI-Agent on Cronos Within Seconds </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HowItWorks