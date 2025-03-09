
interface IBaseModal {
    visible: boolean 
    children: any
}

const BaseModal = ({ visible, children }: IBaseModal) => {
    return (
        <>
            {visible && (
                <div className="fixed inset-0 z-50 overflow-y-auto" >
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl border border-white/10 shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full" data-aos="zoom-in" data-aos-duration="400">
                            {children}
                        </div> 
                    </div>
                </div>
            )}
        </>
    )
}

export default BaseModal