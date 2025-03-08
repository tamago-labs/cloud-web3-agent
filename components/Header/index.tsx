import Link from "next/link"

const Header = () => {
    return (
        <header className={`relative text-white  top-0 z-50  duration-300`}>
            <div className="mx-auto w-full max-w-6xl py-2 flex flex-row justify-between">

                <Link href="/" className="inline-flex">
                    <div className="relative px-4 py-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-md flex items-center shadow-lg shadow-purple-900/20">
                        <div className="absolute inset-0 bg-black opacity-20 rounded-md"></div>

                        <h1 className="font-bold text-white text-lg relative z-10">Tamago Labs</h1>
                    </div>
                </Link>

            

                <div>
                    ccc
                </div>
            </div>
        </header>
    )
}

export default Header