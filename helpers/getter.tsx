

import SdkOptions from "../data/sdkOptions.json"

export const getStatusBadge = (isActive: boolean) => {
    switch (isActive) {
        case true:
            return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
        case (false):
            return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Paused</span>;
        default:
            return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Paused</span>;
    }
};

export const getSdkName = (blockchain: string, sdkTypeId: string) => {
    if (blockchain === "aptos") {
        return SdkOptions.aptos.find(item => item.id === sdkTypeId)?.name
    } else if (blockchain === "cronos") {
        return SdkOptions.cronos.find(item => item.id === sdkTypeId)?.name
    } else if (blockchain === "solana") {
        return SdkOptions.solana.find(item => item.id === sdkTypeId)?.name
    }
    return "Unknown"
}