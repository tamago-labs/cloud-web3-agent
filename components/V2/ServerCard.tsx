
import Link from "next/link"
import { Star, ArrowRight, LineChart, TerminalSquare, ImagePlus, Activity, Shield, Zap, Bitcoin, Network, TrendingUp } from 'lucide-react';

const ServerCard = ({
    server
}: any) => {

    // Helper functions
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Analytics':
                return <LineChart className="w-6 h-6" />;
            case 'Tools':
            case 'Optimization':
                return <Zap className="w-6 h-6" />;
            case 'NFT':
                return <ImagePlus className="w-6 h-6" />;
            case 'Monitoring':
                return <Shield className="w-6 h-6" />;
            case 'Bitcoin':
                return <Bitcoin className="w-6 h-6" />;
            default:
                return <TerminalSquare className="w-6 h-6" />;
        }
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'Analytics':
                return 'from-blue-500 to-indigo-600';
            case 'Tools':
            case 'Optimization':
                return 'from-green-500 to-emerald-600';
            case 'NFT':
                return 'from-purple-500 to-pink-600';
            case 'Monitoring':
                return 'from-orange-500 to-red-600';
            case 'Bitcoin':
                return 'from-yellow-500 to-orange-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getCategoryStyle = (category: string) => {
        switch (category) {
            case 'Analytics':
                return 'bg-blue-100 text-blue-700';
            case 'Tools':
            case 'Optimization':
                return 'bg-green-100 text-green-700';
            case 'NFT':
                return 'bg-purple-100 text-purple-700';
            case 'Monitoring':
                return 'bg-orange-100 text-orange-700';
            case 'Bitcoin':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getChainStyle = (chain: string) => {
        switch (chain) {
            case 'ethereum':
                return 'bg-indigo-50 text-indigo-700';
            case 'polygon':
                return 'bg-purple-50 text-purple-700';
            case 'arbitrum':
                return 'bg-blue-50 text-blue-700';
            case 'base':
                return 'bg-cyan-50 text-cyan-700';
            case 'optimism':
                return 'bg-red-50 text-red-700';
            case 'bitcoin':
                return 'bg-orange-50 text-orange-700';
            case 'dogecoin':
                return 'bg-yellow-50 text-yellow-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    const getChainDisplay = (chain: string) => {
        switch (chain) {
            case 'ethereum':
                return 'ETH';
            case 'polygon':
                return 'MATIC';
            case 'arbitrum':
                return 'ARB';
            case 'base':
                return 'BASE';
            case 'optimism':
                return 'OP';
            case 'bitcoin':
                return 'BTC';
            case 'dogecoin':
                return 'DOGE';
            default:
                return chain.toUpperCase();
        }
    };


    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group relative">
            {/* Featured Badge */}
            {server.isFeatured && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                </div>
            )}

            {/* Web3 Badge */}
            {server.isWeb3 && (
                <div className="absolute -top-2 -left-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs text-white font-medium">
                    Web3
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getCategoryGradient(server.category)} flex items-center justify-center text-white`}>
                    {getCategoryIcon(server.category)}
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{server.stars || '4.8'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryStyle(server.category)}`}>
                        {server.category}
                    </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {server.description}
                </p>
            </div>

            {/* Supported Chains */}
            {server.supportedChains && server.supportedChains.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-xs font-medium text-gray-500">Supported:</span>
                        <div className="flex flex-wrap gap-1">
                            {server.supportedChains.slice(0, 3).map((chain: string, idx: number) => (
                                <span key={idx} className={`px-2 py-1 text-xs rounded ${getChainStyle(chain)}`}>
                                    {getChainDisplay(chain)}
                                </span>
                            ))}
                            {server.supportedChains.length > 3 && (
                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                    +{server.supportedChains.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Features */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-1 mb-2">
                    {server.features.slice(0, 3).map((feature: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {feature}
                        </span>
                    ))}
                    {server.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                            +{server.features.length - 3} more
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>by {server.author}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group">
                    <span>Try Online</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href={`/servers/${server.name.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <span className="text-sm text-gray-600">Details</span>
                </Link>
            </div>
        </div>
    )
}

export default ServerCard