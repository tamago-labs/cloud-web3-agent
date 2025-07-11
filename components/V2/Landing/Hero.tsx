"use client"

import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Cpu, Code, Zap, Cloud, Database, Key, Puzzle, Infinity, FileJson, Network, BrainCircuit, Layers, Globe, ArrowRight, ArrowRightLeft, MessageSquare, ServerCrash, SmartphoneNfc, BadgeCheck, Share2, Blocks, Play, Sparkles } from 'lucide-react';
import Link from "next/link"

const Hero = () => {
    return (
        <>
            <div className="absolute inset-0 z-0">
                <GeometricGrid />
            </div>
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-24 pt-8 md:pt-24 mb-[80px] md:mb-0 relative">
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full px-4 md:px-0 lg:w-3/4 z-20 text-gray-900">
                        <div className="flex flex-col md:flex-row items-center mb-4 gap-2 md:gap-0">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                The MCP Hub for Web3
                            </span>
                            <span className="px-3 py-1  bg-green-100 text-green-800 text-sm font-medium rounded-full flex ml-2">
                                🎉 New users get $25 free credits
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Try MCP Servers for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Web3 Insight
                            </span>
                        </h1>

                        <p className="text-sm md:text-lg text-gray-600 mb-8 max-w-xl">
                            Discover plug-and-play tools that let you chat with AI to analyze portfolios, track whale movements, optimize gas fees, and provide blockchain intelligence for various blockchains
                        </p>

                        <div className="grid grid-cols-2 md:flex  flex-row gap-2 text-sm md:text-base md:gap-4">
                            <Link href="/browse" className="px-2 md:px-7 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg font-medium text-white transition flex items-center justify-center group">
                                <Play className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                Try MCP Servers
                            </Link>
                            <Link href="/client" className="px-2 md:px-7 py-3 bg-white hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center justify-center transition border border-gray-300 hover:border-gray-400">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Online Client
                            </Link>
                        </div>
                        
                        <div className="mt-8 flex items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500">
                            
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>70+ MCP Tools</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>10+ Chains Supported</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>No Setup Required</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-[-200px] opacity-60 md:opacity-100 z-10 md:mt-0 lg:w-1/2">
                        {/*<OrbitalParticles /> */}
                    </div>
                </div>

            </div>
        </>
    )
}


const GeometricGrid = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: any = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId: any;

        const setCanvasDimensions = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);

        const gridSize = 40;
        const dots: any = [];
        const floatingElements: any = [];

        // Create grid dots
        for (let x = 0; x <= canvas.width; x += gridSize) {
            for (let y = 0; y <= canvas.height; y += gridSize) {
                dots.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }

        // Create floating elements
        for (let i = 0; i < 8; i++) {
            floatingElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatSpeed: Math.random() * 0.5 + 0.3,
                floatOffset: Math.random() * Math.PI * 2,
                type: Math.floor(Math.random() * 3), // 0: square, 1: circle, 2: triangle
                color: ['#3B82F6', '#8B5CF6', '#06B6D4'][Math.floor(Math.random() * 3)]
            });
        }

        const animate = (time: any) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            dots.forEach((dot: any) => {
                dot.pulse += 0.03;
                const opacity = (Math.sin(dot.pulse) + 1) * 0.1 + 0.1;

                ctx.beginPath();
                ctx.fillStyle = `rgba(156, 163, 175, ${opacity})`;
                ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw floating elements
            floatingElements.forEach((element: any) => {
                element.y += Math.sin(time * 0.001 + element.floatOffset) * element.floatSpeed;
                element.rotation += element.rotationSpeed;

                ctx.save();
                ctx.translate(element.x, element.y);
                ctx.rotate(element.rotation);

                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size);
                gradient.addColorStop(0, `${element.color}60`);
                gradient.addColorStop(1, `${element.color}20`);

                ctx.fillStyle = gradient;

                if (element.type === 0) {
                    // Square
                    ctx.fillRect(-element.size / 2, -element.size / 2, element.size, element.size);
                } else if (element.type === 1) {
                    // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, element.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Triangle
                    ctx.beginPath();
                    ctx.moveTo(0, -element.size / 2);
                    ctx.lineTo(-element.size / 2, element.size / 2);
                    ctx.lineTo(element.size / 2, element.size / 2);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-96 md:h-[500px] relative">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};


export default Hero