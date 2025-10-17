const TEESection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            </div>
            {/* Animated Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 rounded-full mb-4">
                        <span className="text-orange-700 font-semibold text-sm">🔐 Enterprise-Grade Security</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trusted Execution Environment
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your transactions are signed within isolated, hardware-enforced secure enclaves
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* AWS Nitro Enclave */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-2xl mr-4">
                                ☁️
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">AWS Nitro Enclave</h3>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                            Transactions are signed within AWS Nitro Enclaves—isolated compute environments with no persistent storage, 
                            interactive access, or external networking. Your private keys exist only in encrypted memory, 
                            inaccessible even to AWS root users or Bodhi Tree operators.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">✓</span>
                                <span>Hardware-level isolation (no admin access)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">✓</span>
                                <span>Cryptographic attestation of enclave integrity</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">✓</span>
                                <span>Keys encrypted at rest, decrypted only in enclave</span>
                            </li>
                        </ul>
                    </div>

                    {/* Phala TEE */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-2xl mr-4">
                                🔗
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Phala Network TEE</h3>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                            Leverages Phala's decentralized TEE infrastructure built on Intel SGX and Gramine. 
                            Private keys and transaction signing logic execute off-chain in secure enclaves, 
                            with verifiable on-chain attestation. Decentralized and censorship-resistant.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Decentralized TEE network (no single point of failure)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>On-chain attestation verification</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Intel SGX + Gramine security stack</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Technical Explainer */}
                <div className="bg-orange-100 border border-orange-300 rounded-xl p-6">
                    <h4 className="text-lg font-bold mb-3 text-orange-800">How It Works</h4>
                    <ol className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-start">
                            <span className="text-orange-600 font-bold mr-3 flex-shrink-0">1.</span>
                            <span>Your private key is generated or imported directly within the TEE, never touching external memory or disks.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-600 font-bold mr-3 flex-shrink-0">2.</span>
                            <span>AI agent prepares transaction parameters outside the TEE (amount, recipient, gas settings).</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-600 font-bold mr-3 flex-shrink-0">3.</span>
                            <span>Transaction payload is sent into the TEE for signing using your private key.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-600 font-bold mr-3 flex-shrink-0">4.</span>
                            <span>Signed transaction is broadcast to the blockchain. Private key remains isolated in the enclave.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-600 font-bold mr-3 flex-shrink-0">5.</span>
                            <span>Enclave attestation can be verified on-chain or via AWS Nitro APIs, proving execution integrity.</span>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    )
}

export default TEESection
