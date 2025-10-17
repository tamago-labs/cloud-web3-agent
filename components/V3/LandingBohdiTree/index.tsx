"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Wrench } from "lucide-react"
import MCPSection from "./MCPSection"
import UseCasesSection from "./UseCasesSection"
import FAQSection from "./FAQSection"

const LandingBohdiTree = () => {

    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)

    return (
        <div className="min-h-screen bg-orange-50">
            {/* Header */}
            <header className="relative z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <Link href="/" className="flex items-center">
                                <img src="./assets/images/bodhi-tree-logo.png" className="w-[190px] md:w-[230px]" alt="Bodhi Tree" />
                            </Link>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                About
                            </a>
                            <a href="#use-cases" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Use Cases
                            </a>
                            <a href="https://github.com/tamago-labs/bodhi-tree-ai" target="_blank" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                GitHub
                            </a>
                        </nav>

                        <div className="flex items-center justify-end lg:w-0 lg:flex-1">
                            <button
                                onClick={() => setShowMaintenanceModal(true)}
                                className="whitespace-nowrap px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <GeometricGrid />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-8 md:pt-16 mb-20 md:mb-0 relative">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                        <div className="w-full lg:w-3/4 z-20 text-gray-900">
                            <div className="flex flex-col md:flex-row items-center mb-4 gap-2 md:gap-0">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    Autonomous AI for DeFi
                                </span>
                            </div>

                            <div className='w-full max-w-2xl'>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                    Set Your DeFi Strategy,<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                        Let AI Execute
                                    </span>
                                </h1>
                            </div>

                            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
                                Purpose-built autonomous AI agents for DeFi protocols. From leverage management to yield optimization, AI executes complex strategies while you stay in control.
                            </p>

                            {/* Supported Chains */}
                            <div className="mb-8">
                                <p className="text-sm text-gray-500 mb-3">Supported Chains:</p>
                                <div className="flex flex-wrap items-center gap-4">
                                    {[
                                        { name: 'Aptos', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' },
                                        { name: 'Sui', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png' },
                                        { name: 'Ethereum', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
                                        { name: 'Base', icon: 'https://images.blockscan.com/chain-logos/base.svg' },
                                        { name: 'Optimism', icon: 'https://optimistic.etherscan.io/assets/optimism/images/svg/logos/token-secondary-light.svg?v=25.7.5.2' }
                                    ].map((chain) => (
                                        <div key={chain.name} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                            <img
                                                src={chain.icon}
                                                alt={chain.name}
                                                className="w-5 h-5 rounded-full"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-700">{chain.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:flex flex-row gap-2 text-sm md:text-base md:gap-4 mb-8">
                                <button
                                    onClick={() => setShowMaintenanceModal(true)}
                                    className="px-4 md:px-7 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg font-medium text-white transition flex items-center justify-center group"
                                >
                                    Get Started
                                </button>
                                <a
                                    href="#use-cases"
                                    className="px-4 md:px-7 py-3 bg-white hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center justify-center transition border border-gray-300 hover:border-gray-400 group"
                                >
                                    Explore Strategies
                                </a>
                            </div>

                            <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 md:w-2 h-1 md:h-2 bg-green-500 rounded-full"></div>
                                    <span>6+ Automated Strategies</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 md:w-2 h-1 md:h-2 bg-yellow-500 rounded-full"></div>
                                    <span>AWS Bedrock AI</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 md:w-2 h-1 md:h-2 bg-blue-500 rounded-full"></div>
                                    <span>TEE Security</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 md:w-2 h-1 md:h-2 bg-purple-500 rounded-full"></div>
                                    <span>24/7 AI Monitoring</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-12 md:py-20 bg-gradient-to-br from-orange-50 to-amber-50 relative ">

                {/* Animated Blobs */}
                {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div> */}
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Bodhi Tree?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Open-source AI autonomous agent for DeFi - empowering users with intelligent, self-executing strategies
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                🌍 Community-Driven
                            </span>
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                🤖 AI-Powered Automation
                            </span>
                            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                🔒 Secure & Transparent
                            </span>
                            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                ⚡ Multi-Chain Support
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Challenge</h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                    <span>Manual position management is time-consuming</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                    <span>Miss optimal entry/exit points while you sleep</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                    <span>Complex leverage strategies require constant monitoring</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                    <span>Risk of liquidation when markets move quickly</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                    <span>Yield farming across protocols is tedious</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Solution</h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                    <span>AI agents execute strategies 24/7 autonomously</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                    <span>Automated leverage based on market conditions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                    <span>Real-time risk monitoring with auto-exit protection</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                    <span>TEE-secured transaction signing (AWS Nitro + Phala)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                    <span>Natural language strategy creation—no coding needed</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Import all other sections */}
            <MCPSection />
            {/* <TEESection /> */}
            <UseCasesSection />
            <FAQSection />

            {/* CTA Section */}
            <section className="py-20 bg-orange-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Coming Soon
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            We're currently upgrading to a new version with enhanced features and will be available soon.
                        </p>
                        <Link href="https://x.com/Tamago_Labs" target="_blank">
                            <button
                                // onClick={() => setShowMaintenanceModal(true)}
                                className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Get Notified
                            </button>
                        </Link>

                    </div>
                </div>
            </section>

            {/* Maintenance Modal */}
            {showMaintenanceModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setShowMaintenanceModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wrench className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Under Maintenance
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We're currently upgrading to a new version and will be available again in 2-3 weeks.
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                If you have urgent matters or need immediate assistance, please contact us at
                                <a href="mailto:support@tamagolabs.com" className="text-blue-600 hover:text-blue-700 font-medium"> contact@bodhitree.ai</a>
                            </p>
                            <button
                                onClick={() => setShowMaintenanceModal(false)}
                                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
                            >
                                Got It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// GeometricGrid Component
const GeometricGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const setCanvasDimensions = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);

        const gridSize = 40;
        const dots: any[] = [];
        const floatingElements: any[] = [];

        for (let x = 0; x <= canvas.width; x += gridSize) {
            for (let y = 0; y <= canvas.height; y += gridSize) {
                dots.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }

        for (let i = 0; i < 8; i++) {
            floatingElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatSpeed: Math.random() * 0.5 + 0.3,
                floatOffset: Math.random() * Math.PI * 2,
                type: Math.floor(Math.random() * 3),
                color: ['#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 3)]
            });
        }

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            dots.forEach((dot: any) => {
                dot.pulse += 0.03;
                const opacity = (Math.sin(dot.pulse) + 1) * 0.1 + 0.1;

                ctx.beginPath();
                ctx.fillStyle = `rgba(156, 163, 175, ${opacity})`;
                ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
                ctx.fill();
            });

            floatingElements.forEach((element: any) => {
                element.y += Math.sin(time * 0.001 + element.floatOffset) * element.floatSpeed;
                element.rotation += element.rotationSpeed;

                ctx.save();
                ctx.translate(element.x, element.y);
                ctx.rotate(element.rotation);

                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size);
                gradient.addColorStop(0, `${element.color}60`);
                gradient.addColorStop(1, `${element.color}20`);

                ctx.fillStyle = gradient;

                if (element.type === 0) {
                    ctx.fillRect(-element.size / 2, -element.size / 2, element.size, element.size);
                } else if (element.type === 1) {
                    ctx.beginPath();
                    ctx.arc(0, 0, element.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(0, -element.size / 2);
                    ctx.lineTo(-element.size / 2, element.size / 2);
                    ctx.lineTo(element.size / 2, element.size / 2);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-96 md:h-[500px] relative">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default LandingBohdiTree

// Add CSS styles for blob animations
const blobStyles = `
    @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
`

// Inject styles into the document
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = blobStyles
    document.head.appendChild(styleSheet)
}
