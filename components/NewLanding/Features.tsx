import React from 'react';
import { Bot, Coins, Wallet, Zap, Code, Database, Puzzle, Key, Workflow, Shield, Infinity, Gauge } from 'lucide-react'
 

const Features = () => {

    const features = [
        {
            icon: <Bot className="w-10 h-10 text-teal-400" />,
            title: "MCP for Web3",
            description: "Seamlessly bridge AI models like GPT or Claude to Web3 ecosystems"
        },
        {
            icon: <Zap className="w-10 h-10 text-teal-400" />,
            title: "Non-Custodial",
            description: "Execute any on-chain action directly from your devices without custody risk"
        },
        {
            icon: <Workflow className="w-10 h-10 text-teal-400" />,
            title: "Selectable Tools",
            description: "Select only the tools you want from Agent Kits to live market feeds"
        },
        {
            icon: <Gauge className="w-10 h-10 text-teal-400" />,
            title: "Auto-Scaling",
            description: "Built on AWS serverless architecture that scales with your needs and usage"
        }
    ]

  return (
    <section className="py-16 bg-gradient-to-b from-teal-950 to-teal-900 relative overflow-hidden">
       
        <div className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Features</h2>
            <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature: any, index: number) => (
              <div 
                key={index}
                className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 
                transition-transform hover:transform hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 rounded-lg bg-teal-800/50 flex items-center justify-center mb-5 group-hover:bg-teal-700/50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-teal-200">{feature.description}</p>
                 
              </div>
            ))}
          </div>
           
        </div>
        
        <style jsx>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </section>
  );
};

 

export default Features;