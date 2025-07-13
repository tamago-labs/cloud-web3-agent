"use client"

import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, BarChart3 } from 'lucide-react';
import Link from "next/link"

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 7,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (!isOpen) return;

        // Set target date to July 25, 2025
        const targetDate = new Date('2025-07-25T00:00:00');

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                // Launch date has passed
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 transform transition-all">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Community Analytics Coming Soon!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Stay tuned for Community Analytics — turn conversations into charts and share them with the community
                            <br />
                            {/* <br />
                            <strong>Launch Date: July 25, 2025</strong> */}
                        </p>

                        {/* Countdown */}
                        {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Time Left:</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
                                        <div className="text-xs text-gray-500">Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{timeLeft.hours}</div>
                                        <div className="text-xs text-gray-500">Hours</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</div>
                                        <div className="text-xs text-gray-500">Minutes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</div>
                                        <div className="text-xs text-gray-500">Seconds</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-2">🎉 Community Analytics is Live!</div>
                                    <p className="text-green-700">The wait is over! Community analytics is now available.</p>
                                </div>
                            </div>
                        )}

                        {/* Features preview */}
                        <div className="text-left mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                What's Coming:
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                    AI converts conversations into charts
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    Community-generated insights
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    Real-time Web3 analytics and charts
                                </li>


                            </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Got it
                            </button>
                            <Link
                                href="/client"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                            >
                                Try Chat First
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;