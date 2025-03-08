import Link from 'next/link'; 
  
const Footer = ({ showAddress = true }: any) => {
    return (
        <footer className="mt-auto bg-white dark:bg-transparent dark:bg-gradient-to-b dark:from-white/[0.03] dark:to-transparent">
             
            <div className="bg-gradient-to-r from-[#FCF1F4] to-[#EDFBF9] py-5 dark:border-t-2 dark:border-white/5 dark:bg-none">
                <div className="container">
                    <div className="  text-sm  dark:text-white flex flex-row">
                        <div className='flex-1'>
                            © {new Date().getFullYear() + ' '}
                            <Link href="https://tamagolabs.com" className="text-white transition ">
                                Tamago Labs
                            </Link>
                        </div>
                        <div className='flex flex-1 flex-row mt-1 justify-end   md:mt-0'>
                            <div className="text-xs md:text-sm px-0 md:px-2">
                                <Link href="https://docs.tamagolabs.com/privacy-policy" target="_blank" className="text-white transition hover:text-secondary">
                                    Privacy Policy
                                </Link>
                            </div>
                            <div className="text-xs md:text-sm px-1 md:px-2">
                                <Link href="https://docs.tamagolabs.com/terms-of-service" target="_blank" className="text-white transition hover:text-secondary">
                                    Term of Service
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
