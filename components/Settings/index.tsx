"use client"

import React, { useState, useReducer, useCallback, useContext, useEffect } from 'react';
import { ChevronDown, Zap, ArrowRight, Check, Plus } from 'react-feather';
import type { Schema } from "../../amplify/data/resource"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import { Puff } from 'react-loading-icons'
import { CloudAgentContext } from '@/hooks/useCloudAgent';
import { useRouter } from "next/navigation";
import BaseModal from '@/modals/base';
import useDatabase from '@/hooks/useDatabase';
import CheckMarketplaceModal from '@/modals/checkMarketplace';
import { CopyToClipboard } from 'react-copy-to-clipboard'

const client = generateClient<Schema>()

const Settings = () => {

    const { profile } = useContext(CloudAgentContext)
    const [displayName, setDisplayName] = useState<any>("")
    const [modal, setModal] = useState<any>(undefined)

    useEffect(() => {
        profile && profile.displayName && setDisplayName(profile.displayName)
    }, [profile])

    const onSave = useCallback(async () => {

        if (!profile) {
            return
        }

        if (!displayName || displayName.length < 3) {
            return
        }

        await client.models.User.update({
            id: profile.id,
            displayName
        })

        setModal("Saved successfully")

    }, [profile, displayName])

    return (
        <>

            <BaseModal
                visible={modal !== undefined}
            >
                <div className="px-2 sm:px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl  font-semibold">Status Update</h3>
                        <button onClick={() => setModal(undefined)} className="text-gray-400 cursor-pointer hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-base sm:text-lg font-medium">
                        <p className="text-center">
                            {modal}
                        </p>
                        <div className="flex p-4">
                            <button onClick={() => setModal(undefined)} className="bg-white cursor-pointer mx-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                Close
                            </button>
                        </div>
                    </div>

                </div>
            </BaseModal>

            <div className="relative mx-auto px-6 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Account</h1>
                <p className="text-gray-400 mb-8">Configure your account settings</p>


                <div className="mb-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                    <div className="space-y-4">
                        <div className='grid grid-cols-6 gap-3'>
                            <div className='flex'>
                                <label htmlFor="agent-name" className="block my-auto text-white text font-semibold ">
                                    User ID:
                                </label>
                            </div>

                            <div className='col-span-5'>
                                <p>{profile?.username}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-6'>
                            <div className='flex'>
                                <label htmlFor="agent-name" className="block my-auto text-white text font-semibold ">
                                    Display Name:
                                </label>
                            </div>

                            <input
                                id="agent-name"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full col-span-5 px-4 py-2 border border-white/10 rounded bg-white/5 focus:border-white/10 focus:ring-0 "
                                placeholder="Agent Wizard"
                            />
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <div className="flex justify-between items-center">

                    <button
                        onClick={onSave}
                        className={`flex items-center px-6 py-3 rounded-lg bg-white text-slate-900 cursor-pointer`}
                    >
                        <span className='font-semibold'>Save</span>
                    </button>
                </div>

            </div>



        </>
    )
}

export default Settings