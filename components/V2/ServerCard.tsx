
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"



const ServerCard = ({
    server
}: any) => {
    return (
        <div  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group relative">
            {/* Featured Badge */}
            {server.isFeatured && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${server.color} flex items-center justify-center text-white`}>
                    {server.icon}
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{server.stars}</span>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {server.category}
                    </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {server.description}
                </p>
            </div>

            {/* Features */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-1 mb-2">
                    {server.features.slice(0, 3).map((feature: any, idx: number) => (
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