import { useState } from "react";
import { ChevronDown } from "react-feather";

const faqs = [
    {
        question: "What is this platform?",
        answer:
            "Our platform enables seamless deployment and management of Web3 AI agents with no coding required.",
    },
    {
        question: "How do AI agents interact with Web3?",
        answer:
            "Rather than building everything from scratch for Web3 interactions, we rely on well-known Web3 agent SDKs, allowing us to stay lean and focus on what matters and making AI agents fully managed and secure.",
    },
    {
        question: "How does your platform compare to ElizaOS?",
        answer:
            "Unlike ElizaOS, which may require users to handle their own deployment, our platform provides a fully managed solution with a serverless infrastructure. ",
    },
    {
        question: "Do I need coding skills to use this?",
        answer:
            "No! Our no-code interface allows you to create and manage AI agents in seconds, while automation requires only simple prompts.",
    },
    {
        question: "What blockchains do you support?",
        answer:
            "We currently support Aptos, Cronos and more, allowing AI agents to interact with multiple protocols such as lending, DEX trading, staking, and more.",
    },
    {
        question: "Is this platform secure?",
        answer:
            "Yes! All AI agents run on secure infrastructure on the AWS cloud that covers secure authentication, secret management, auto-scaled databases and graph services.",
    },
    {
        question: "How does the pricing work?",
        answer:
            "Currently, we offer our platform free of charge, allowing anyone to evaluate it with limited actions. We may introduce pricing in the future.",
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className=" relative  py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 ">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border rounded-lg shadow-md p-4 bg-white cursor-pointer"
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="flex justify-between items-center text-gray-900 ">
                                <h3 className="text-lg  font-medium">{faq.question}</h3>
                                <ChevronDown className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                            </div>
                            {openIndex === index && (
                                <p className="mt-2 text-gray-600">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
