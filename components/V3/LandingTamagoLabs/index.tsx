"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Code, Cpu, Triangle, Zap, Bot, Plug } from "lucide-react"

const LandingTamagoLabs = () => {
    const [activeProject, setActiveProject] = useState(0)
    const [hoveredTech, setHoveredTech] = useState<string | null>(null)
    const [language, setLanguage] = useState<'en' | 'ja'>('ja')

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as 'en' | 'ja' | null
        if (savedLanguage) {
            setLanguage(savedLanguage)
        } else {
            localStorage.setItem('language', 'ja')
        }
    }, [])

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'ja' : 'en'
        setLanguage(newLanguage)
        localStorage.setItem('language', newLanguage)
    }

    const t = {
        en: {
            about: "About",
            projects: "Projects",
            services: "Services",
            buildingFuture: "Building the Future of",
            decentralizedFinance: "Decentralized Finance",
            description: "Expert Web3 development studio specializing in DeFi protocols, AI-powered automation, and cutting-edge blockchain solutions.",
            exploreProjects: "Explore Our Projects",
            ourServices: "Our Services",
            liveProjects: "Live Projects",
            blockchains: "Blockchains",
            securityFocus: "Security Focus",
            established: "Established"
        },
        ja: {
            about: "会社概要",
            projects: "プロジェクト",
            services: "サービス",
            buildingFuture: "の未来を構築",
            decentralizedFinance: "分散型金融",
            description: "DeFiプロトコル、AI自動化、最先端のブロックチェーンソリューションを専門とするWeb3開発スタジオ。",
            exploreProjects: "プロジェクトを見る",
            ourServices: "サービス",
            liveProjects: "稼働中プロジェクト",
            blockchains: "ブロックチェーン",
            securityFocus: "セキュリティ重視",
            established: "設立"
        }
    }

    const projects = [
        {
            id: "bodhi-tree",
            name: "Bodhi Tree",
            tagline: "Open-Source Autonomous AI Agent Framework for DeFi",
            description: "An intelligent AI framework designed for DeFi operations. Bodhi Tree enables users to set up sophisticated strategies and lets AI execute complex DeFi tasks autonomously.",
            features: [
                "Leverage Assets: Supply assets to lending pools, borrow stablecoins and swap back for increased exposure",
                "Automated Leverage/De-leverage: AI manages position sizing based on market conditions",
                "Portfolio Rebalancing: Automatically optimize positions across protocols",
                "Yield Optimization: Move funds between protocols for best APY",
                "Risk Management: Detect protocol risks and auto-exit before exploits",
                "Cross-chain Arbitrage: Execute opportunities across multiple chains"
            ],
            logo: "./assets/images/bodhi-tree-logo.png",
            gradient: "from-emerald-400 to-teal-500",
            link: "https://www.bodhitree.pro/"
        },
        {
            id: "kilolend",
            name: "KiloLend",
            tagline: "AI-Powered Lending Protocol on Kaia Chain",
            description: "A decentralized lending and borrowing protocol with AI guidance, built on Kaia Chain and integrated with LINE Mini DApp. Winner of Kaia 'Stablecoin Summer' hackathon.",
            features: [
                "AI-Driven Assistance: Smart guidance for lending and borrowing decisions",
                "Stablecoin Focus: Optimized for USDT and stablecoin operations",
                "Real-time Oracles: Dynamic pricing and risk management",
                "LINE Integration: Seamless access through LINE Mini DApp",
                "AWS Bedrock Powered: Advanced AI model integration",
                "Live on Mainnet: Currently operational on Kaia Chain"
            ],
            logo: "https://kilolend.xyz/images/kilolend-logo.png",
            gradient: "from-orange-400 to-pink-500",
            link: "https://kilolend.xyz/"
        },
        {
            id: "mcp-tool",
            name: "MCP SDK",
            tagline: "Open-Source Tools for AI-Blockchain Integration",
            description: "A comprehensive Model Context Protocol (MCP) tool that enables MCP-compatible AI like Claude and ChatGPT to seamlessly connect with blockchain data across all supported chains. An open-source solution for developers building AI-blockchain applications.",
            features: [
                "Multi-Chain Support: Connect to Ethereum, EVM chains, Aptos, Sui, and Kaia",
                "AI-Compatible: Works with Claude, ChatGPT, and other MCP-compatible AI models",
                "Real-Time Data: Access live blockchain data and transaction states",
                "Open Source: Fully open-source with MIT license for community development",
                "Easy Integration: Simple APIs for quick AI-blockchain integration",
                "Comprehensive Documentation: Detailed guides and examples for developers"
            ],
            icon: "🔗",
            gradient: "from-blue-500 to-purple-600",
            link: "https://github.com/tamago-labs"
        }
    ]

    const services = [
        {
            title: "Smart Contract Development",
            description: "End-to-end development of secure and efficient smart contracts in Solidity and Move, tailored for DeFi, NFT, and DAO use cases.",
            icon: <Zap className="w-8 h-8 text-white" />,
            gradient: "from-blue-500 to-indigo-600",
            features: ["DeFi Protocols", "NFT Contracts", "DAO Governance", "Gas Optimization"]
        },
        {
            title: "AI Agent Development",
            description: "Build intelligent automation for DeFi operations, from strategy execution frameworks to autonomous agents that monitor, analyze, and execute complex blockchain transactions.",
            icon: <Bot className="w-8 h-8 text-white" />,
            gradient: "from-purple-500 to-pink-600",
            features: ["Portfolio Management", "Risk Monitoring", "Yield Optimization", "Strategy Automation"]
        },
        {
            title: "Integration Services",
            description: "Seamlessly integrate Web3 functionality into existing applications with custom APIs and SDKs. Full-stack blockchain integration for enterprises and startups.",
            icon: <Plug className="w-8 h-8 text-white" />,
            gradient: "from-orange-500 to-red-600",
            features: ["API Development", "SDK Creation", "Wallet Integration", "Oracle Solutions", "Cross-chain Bridges"]
        }
    ]

    const techStack = [
        { name: "Solidity", description: "EVM smart contracts", icon: <Code className="w-8 h-8" />, color: "text-gray-700", bgColor: "bg-gray-100" },
        { name: "Rust", description: "Solana & NEAR", icon: <Cpu className="w-8 h-8" />, color: "text-orange-700", bgColor: "bg-orange-100" },
        { name: "Move", description: "Aptos & Sui development", icon: <Triangle className="w-8 h-8" />, color: "text-blue-700", bgColor: "bg-blue-100" }
    ]

    const blockchains = [
        [
            { name: "Ethereum", description: "Leading smart contract platform", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", gradient: "from-indigo-500 to-purple-600" },
            { name: "EVM Compatible", description: "Polygon, BSC, Avalanche & more", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png", gradient: "from-purple-500 to-pink-600" },
            { name: "Aptos", description: "High-performance Move VM", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png", gradient: "from-green-500 to-teal-600" }
        ],
        [
            { name: "Sui", description: "Scalable Move-based chain", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png", gradient: "from-blue-500 to-cyan-600" },
            { name: "Kaia", description: "EVM for millions of users across Asia.", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/32880.png", gradient: "from-orange-500 to-red-600" }
        ]
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveProject((prev) => (prev + 1) % projects.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
            <header className="relative z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <Link href="/" className="flex items-center">
                                <img src="./assets/images/tamago-labs-logo.png" className="w-[190px] md:w-[230px]" alt="Tamago Labs" />
                            </Link>
                        </div>

                        <nav className="flex-1 flex justify-center">
                            <div className="hidden md:flex space-x-8">
                                <a href="#projects" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                                    {t[language].projects}
                                </a>
                                <a href="#services" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                                    {t[language].services}
                                </a>
                                <a href="#about-us" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                                    {t[language].about}
                                </a>
                            </div>
                        </nav>

                        <div className="flex justify-end lg:w-0 lg:flex-1">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-all shadow-sm"
                                title={language === 'en' ? 'Switch to Japanese' : 'Switch to English'}
                            >
                                {/* English */}
                                <span className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'en'
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                    <span className="block lg:hidden">🇺🇸</span> {/* emoji only on mobile */}
                                    <span className="hidden lg:block">🇺🇸 English</span> {/* full text on large screens */}
                                </span>

                                {/* Japanese */}
                                <span className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'ja'
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                    <span className="block lg:hidden">🇯🇵</span>
                                    <span className="hidden lg:block">日本語 🇯🇵</span>
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                            Building the Future of
                            <span className="block bg-gradient-to-r from-gray-700 via-slate-600 to-gray-600 bg-clip-text text-transparent">
                                Decentralized Finance
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Expert Web3 development studio specializing in DeFi protocols, AI-powered automation,
                            and cutting-edge blockchain solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-gray-700 to-slate-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                                What We're Working On
                            </a>
                            <a href="#services" className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2 border-gray-200">
                                Our Services
                            </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
                            <div className="text-center"><div className="text-4xl font-bold text-gray-900">5+</div><div className="text-gray-600 mt-1">Delivered Projects</div></div>
                            <div className="text-center"><div className="text-4xl font-bold text-gray-900">10+</div><div className="text-gray-600 mt-1">Blockchains</div></div>
                            <div className="text-center"><div className="text-4xl font-bold text-gray-900">100%</div><div className="text-gray-600 mt-1">Security Focus</div></div>
                            <div className="text-center"><div className="text-4xl font-bold text-gray-900">2022</div><div className="text-gray-600 mt-1">Established</div></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Expert proficiency across multiple blockchain languages</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {techStack.map((tech, idx) => (
                            <div
                                key={idx}
                                className={`min-w-[250px] group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2  ${hoveredTech === tech.name ? 'ring-2 ring-gray-600' : ''}`}
                                onMouseEnter={() => setHoveredTech(tech.name)}
                                onMouseLeave={() => setHoveredTech(null)}
                            >
                                <div className={`w-16 h-16 rounded-xl ${tech.bgColor} flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <span className={tech.color}>{tech.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{tech.name}</h3>
                                <p className="text-gray-600 text-center leading-relaxed">{tech.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <section className="py-20 bg-white/70 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Supported Blockchains</h2>
                        <p className="text-lg text-gray-600">Multi-chain expertise across leading blockchain ecosystems</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-5xl mx-auto">
                        {blockchains[0].map((chain, idx) => (
                            <div key={idx} className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                                <div className={`w-14 h-14 rounded-lg  flex items-center justify-center mb-4 mx-auto  overflow-hidden`}>
                                    <img src={chain.logo} alt={chain.name} className="w-full h-full object-contain" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-center text-gray-900">{chain.name}</h3>
                                <p className="text-gray-600 text-center text-xs leading-relaxed">{chain.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {blockchains[1].map((chain, idx) => (
                            <div key={idx} className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                                <div className={`w-14 h-14 rounded-lg  flex items-center justify-center mb-4 mx-auto overflow-hidden`}>
                                    <img src={chain.logo} alt={chain.name} className="w-full h-full object-contain" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-center text-gray-900">{chain.name}</h3>
                                <p className="text-gray-600 text-center text-xs leading-relaxed">{chain.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="services" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive Web3 development services for your blockchain journey</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {services.map((service, idx) => (
                            <div key={idx} className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>{service.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                                <div className="space-y-2">
                                    {service.features.map((feature, featureIdx) => (
                                        <div key={featureIdx} className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="projects" className="py-24 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Projects</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We build and operate innovative DeFi protocols and AI-powered blockchain solutions, maintaining them end-to-end with hands-on control and continuous innovation
                        </p>
                    </div>
                    <div className="space-y-16">
                        {projects.map((project, idx) => (
                            <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 max-w-6xl mx-auto`}>
                                <div className="w-full md:w-1/2">
                                    <div className={`bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${idx % 2 === 1 ? 'md:mr-8' : 'md:ml-8'}`}>

                                        {project.logo && <img src={project.logo} className="w-[190px] md:w-[230px] mb-[20px]" alt={project.name} />}
                                        {!project.logo && <h3 className="text-3xl font-bold text-gray-900 mb-3">{project.name}</h3>}
                                        <p className="text-xl text-gray-700 font-semibold mb-4">{project.tagline}</p>
                                        <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>
                                        <div className="space-y-3 mb-6">
                                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Key Features</h4>
                                            <div className="space-y-2">
                                                {project.features.slice(0, 3).map((feature, featureIdx) => (
                                                    <div key={featureIdx} className="flex items-start">
                                                        <svg className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm text-gray-600">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-slate-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                                            Explore Project
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <div className={`bg-gradient-to-br ${project.gradient} rounded-2xl p-8 text-white shadow-xl ${idx % 2 === 1 ? 'md:ml-8' : 'md:mr-8'}`}>
                                        <h4 className="text-2xl font-bold mb-4">All Features</h4>
                                        <div className="space-y-3">
                                            {project.features.map((feature, featureIdx) => (
                                                <div key={featureIdx} className="flex items-start">
                                                    <svg className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm text-white/90">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="about-us" className="py-20 bg-white/70 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Us</h2>
                        <p className="text-lg text-gray-600">Building innovative blockchain solutions from Fukuoka, Japan</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information</h3>
                                <div className="space-y-3 text-gray-600">
                                    <p className="font-semibold text-gray-900">Tamago Blockchain Labs Co., Ltd.</p>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-gray-600 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Co-Working Q, 1-1, JR Hakata City B1F<br />Hakata, Fukuoka, Japan 812-0012</span>
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Established: September 2022</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>(81) 80-4894-2495</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>support@tamagolabs.com</span>
                                    </div> 
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Get In Touch</h3>
                                <p className="text-gray-600 mb-6">Ready to start your Web3 project? Contact us to discuss how we can help bring your vision to life with cutting-edge blockchain technology.</p>
                                <a href="mailto:support@tamagolabs.com" className="inline-block px-6 py-3 bg-gradient-to-r from-gray-700 to-slate-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    )
}

export default LandingTamagoLabs
