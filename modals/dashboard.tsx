import BaseModal from "./base"

const DashboardModal = ({ visible, close }: any) => {

    return (
        <BaseModal
            visible={visible}
        >
            <div className="px-2 sm:px-6 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl  font-semibold">Early Development Notice</h3>
                    <button onClick={close} className="text-gray-400 cursor-pointer hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="text-base sm:text-lg font-medium space-y-4">
                    <p className="text-left">
                        We're in the early stages of development. No agents require actual payment at this time.
                    </p>
 

                    <div className="flex p-2">
                        <button onClick={close} className="bg-white cursor-pointer mx-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                            Close
                        </button>
                    </div>
                </div>

            </div>

        </BaseModal>
    )
}

export default DashboardModal