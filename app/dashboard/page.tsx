"use client";

// import Dashboard from "@/components/Dashboard";
import ApiKeySection from '@/components/Dashboard/Overview/ApiKeySection';
import UsageStatsGrid from '@/components/Dashboard/Overview/UsageStatsGrid';
import QuickActionButtons from '@/components/Dashboard/Overview/QuickActionButtons';
// import ActivityFeed from '@/components/Dashboard/Overview/ActivityFeed';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            {/* <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Welcome to your MCP Dashboard
                </h1>
                <p className="text-lg text-teal-200 max-w-3xl">
                    Monitor your usage, test tools in the playground, and configure your MCP service
                </p>
            </div> */}

           

            {/* Usage Statistics */}
            {/* <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Usage Statistics</h2>
                <UsageStatsGrid />
            </div> */}
 
            {/* Quick Actions */}
            <QuickActionButtons />

             {/* API Key Section */}
            <ApiKeySection />

            {/* Recent Activity */}
            {/* <ActivityFeed /> */}
        </div>
    )
}