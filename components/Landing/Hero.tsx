

import Link from 'next/link';
import Header from '../Header';



const Hero = () => {
    return (
        <section className="bg-black bg-[url(/assets/images/bg-1.png)] bg-left sm:bg-bottom bg-cover sm:bg-no-repeat">
            <Header />
            <div className="py-24 dark:bg-gradient-to-r dark:from-[#B476E5]/10 dark:to-[#47BDFF]/10 lg:pt-32 lg:pb-30">
                <div className='mx-auto relative max-w-6xl   min-h-[400px] md:min-h-[500px] flex flex-col'>

                    <div className='grid grid-cols-3 w-full'>
                        <div className='col-span-3 flex flex-col'>

                            <h2 className="text-3xl mx-auto   text-white font-bold md:text-[60px] xl:text-[70px] leading-[40px]  md:leading-[65px] xl:leading-[80px]"  >
                                Cloud for 
                                <span className="relative text-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 md:after:h-1.5 after:w-full after:bg-gradient-to-r after:from-primary/10 after:via-white after:to-primary/10">
                                    {' '}
                                    Web3
                                </span> 
                                {` `}Agents
                            </h2>
                            <div className=" px-1 text-center py-4 mt-[10px] max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-semibold">
                                Having your AI agents seamlessly operate across on-chain and off-chain environments for any Web3 workflows
                            </div>
                        </div>
                    </div>
                    <div className="flex p-4">
                        <Link href="/dashboard"  className="bg-white cursor-pointer mx-auto px-8 py-3 text-base sm:text-lg rounded-lg font-semibold  text-slate-900 transition">
                            Deploy Your First Agent
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero