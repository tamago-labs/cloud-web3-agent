import Link from "next/link";
import { ArrowDown, ChevronDown } from "react-feather";


const HowItWorks = () => {

    const steps = [
        {

            title: "Deploy",
            description: "Select your chain and SDK to deploy your AI agent on the cloud and start chatting to gain insights",
            bgColor: "bg-blue-600"
        },
        {

            title: "Customize",
            description: "Customize your agent to fit your workflow by choosing pre-built templates or providing prompts",
            bgColor: "bg-indigo-600"
        },
        {

            title: "Automate",
            description: "AI agents monitor on-chain and off-chain events such as price or liquidity changes and take automated actions",
            bgColor: "bg-purple-600"
        },
        {

            title: "Coordinate",
            description: "AI agents collaborate with each other to coordinate tasks across multiple protocols",
            bgColor: "bg-violet-600"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="max-w-6xl relative mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>

                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`${step.bgColor} w-12 h-16   rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                                    {/* {step.icon} */}<h1 className="font-bold text-xl">{index + 1}</h1>
                                    <span className="sr-only">Step {index + 1}</span>
                                </div>
                                <div className="bg-white rounded-xl shadow-md p-6 text-center h-full w-full">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
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
            </div>
        </section>
    )
}

export default HowItWorks