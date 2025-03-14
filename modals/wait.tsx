import BaseModal from "./base"

const WaitModal = ({ visible, close }: any) => {

    return (
        <BaseModal
            visible={visible}
        >
            <div className="px-2 sm:px-6 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl  font-semibold">🚧 System Under Maintenance 🚧</h3>
                    <button onClick={close} className="text-gray-400 cursor-pointer hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="text-base sm:text-lg font-medium">
                    <p className="text-center">
                        We’re currently upgrading our system to bring you a better experience.
                    </p>
                    <div className="mx-auto max-w-xl my-2">
                        <p>
                            ⏳ Expected Availability: 15 March 2025
                        </p>
                        <p>
                            🔧 What’s Happening? Providing a new system to manage on-chain and off-chain AI agents backed by AWS infrastructure
                        </p>
                    </div>
                    <p className="text-center">
                        Thank you for your patience! Stay tuned for updates.
                    </p>

                    <div className="flex p-4">
                        <button onClick={close} className="bg-white cursor-pointer mx-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                            Close
                        </button>
                    </div>
                </div>

            </div>

        </BaseModal>
    )
}

export default WaitModal