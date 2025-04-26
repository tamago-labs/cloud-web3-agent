import { Play, ArrowRight } from 'lucide-react';

const VideoDemo = () => {
  return (
    <section className="py-24  bg-gradient-to-b from-teal-950 to-teal-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-800/40 border border-teal-700/30 text-teal-300 text-sm font-medium mb-4">
            Video Demos
          </div>  
          <p className="text-teal-100/80 mt-4 max-w-2xl mx-auto text-sm md:text-base">
          The following demos are v.1, allowing you to build and manage AI agents on the platform. New video for the latest version coming soon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* First Video */}
          <div className="relative rounded-xl overflow-hidden group">
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/6n23-tS1WCk"
                title="AI Agent Demo with Aptos and Move Agent Kit SDK"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/0 pt-10 pb-4 px-6">
              <h3 className="text-xl font-semibold text-white">Aptos & Move Agent Kit Demo</h3>
              <p className="text-teal-100/80 text-sm mt-1">
                Watch AI agents interact with DeFi protocols on the Aptos blockchain
              </p>
            </div>
            <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-500/30 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Second Video */}
          <div className="relative rounded-xl overflow-hidden group">
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/_hwQldVOurU"
                title="Deploy AI-Agent on Cronos Within Seconds"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/0 pt-10 pb-4 px-6">
              <h3 className="text-xl font-semibold text-white">Cronos Rapid Deployment</h3>
              <p className="text-teal-100/80 text-sm mt-1">
                See how quickly you can deploy an AI agent on the Cronos blockchain
              </p>
            </div>
            <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-500/30 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>
 
      </div>
    </section>
  );
};

export default VideoDemo;