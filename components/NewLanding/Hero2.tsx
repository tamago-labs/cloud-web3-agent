import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Code, Zap, Cloud, Database, Key, Puzzle, Infinity, FileJson, Network, BrainCircuit, Layers, Globe, ArrowRight, ArrowRightLeft, MessageSquare, ServerCrash, SmartphoneNfc, BadgeCheck, Share2, Blocks } from 'lucide-react';
import Link from "next/link"

const Hero = ({ signIn }: any) => {
    return (
        <>
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-24 mb-[80px] md:mb-0 relative">

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    {/* Left content */}
                    <div className="w-full px-4 md:px-0 lg:w-1/2 z-20 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Model Context Service for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                                Web3 AI Agents
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-teal-100/80 mb-8 max-w-xl">
                            A specialized Model Context Protocol service that transforms your AI assistant into a fully functional Web3 agent across various blockchains
                            {/* Seamlessly integrate AI models with the Hedera blockchain through standardized interfaces and secure wallet management. */}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={signIn} className="px-7 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium text-white transition flex items-center justify-center">
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button> 
                                <Link href="https://docs.tamagolabs.com" target="_blank" className="px-7 py-3 bg-teal-800/40 hover:bg-teal-700/50 rounded-lg font-medium text-teal-200 flex items-center justify-center transition border border-teal-700/40">
                                    Documentation
                                </Link> 

                        </div>
                    </div>

                    {/* Right illustration */}
                    <div className="w-full mt-[-500px] opacity-40 md:opacity-100 z-10 md:mt-0 lg:w-1/2">
                        {/*<BlockchainNodeConnection/>*/}
                        <DataFlowParticles />
                        {/*<GridRippleEffect/>*/}
                    </div>
                </div>

                {/* Trusted by section */}
                {/* <div className="mt-16 text-center">
                    <p className="text-teal-300 text-sm font-medium mb-4">TRUSTED BY LEADING ORGANIZATIONS</p>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-8 w-32 bg-white/10 rounded-md"></div>
                        ))}
                    </div>
                </div> */}
            </div>

            {/* Add keyframes for floating animation */}
            <style jsx>{`
      @keyframes float {
        0% { transform: translate(-50%, -50%) translateY(0px) rotateX(10deg) rotateY(10deg); }
        100% { transform: translate(-50%, -50%) translateY(-10px) rotateX(10deg) rotateY(10deg); }
      }
    `}</style>
            <style jsx>{`
  @keyframes pulse-circle {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.2; }
    50% { opacity: 0.4; }
    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
  }
`}</style>
            <style jsx>{`
  @keyframes geo-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>
        </>
    )
}


const DataFlowParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas: any = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId: any;

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);

        // Colors
        const primaryColor = '#36F1CD';
        const secondaryColor = '#1A535C';

        // Flow line configuration
        const lines: any = [];
        const lineCount = 5;

        // Create curved flow lines
        for (let i = 0; i < lineCount; i++) {
            const startY = (canvas.height / (lineCount + 1)) * (i + 1);
            const amplitude = Math.random() * 40 + 20;
            const frequency = Math.random() * 0.01 + 0.005;
            const phase = Math.random() * Math.PI * 2;

            lines.push({
                startY,
                amplitude,
                frequency,
                phase,
                particles: []
            });

            // Create particles on each line
            const particleCount = Math.floor(Math.random() * 10) + 15;
            for (let j = 0; j < particleCount; j++) {
                lines[i].particles.push({
                    x: Math.random() * canvas.width,
                    speed: Math.random() * 1.5 + 0.5,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.7 + 0.3,
                    hueShift: Math.random() * 20 - 10
                });
            }
        }

        // Calculate y position on the sine wave for a given x
        const calcY = (line: any, x: any) => {
            return line.startY + Math.sin(x * line.frequency + line.phase) * line.amplitude;
        };

        // Draw a flow line
        const drawLine = (line: any) => {
            ctx.beginPath();

            // Create gradient for each line
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(26, 83, 92, 0.2)');
            gradient.addColorStop(0.5, 'rgba(54, 241, 205, 0.2)');
            gradient.addColorStop(1, 'rgba(26, 83, 92, 0.2)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;

            // Draw curved line
            for (let x = 0; x < canvas.width; x += 5) {
                const y = calcY(line, x);

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();

            // Draw particles
            line.particles.forEach((particle: any) => {
                // Calculate y position on the curve
                const y = calcY(line, particle.x);

                // Draw particle glow
                const glow = ctx.createRadialGradient(
                    particle.x, y, 0,
                    particle.x, y, particle.size * 3
                );
                glow.addColorStop(0, `rgba(54, 241, 205, ${particle.opacity})`);
                glow.addColorStop(1, 'rgba(54, 241, 205, 0)');

                ctx.beginPath();
                ctx.fillStyle = glow;
                ctx.arc(particle.x, y, particle.size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Draw particle
                ctx.beginPath();
                ctx.fillStyle = primaryColor;
                ctx.arc(particle.x, y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                // Move particle
                particle.x += particle.speed;

                // Reset particle when it goes off screen
                if (particle.x > canvas.width) {
                    particle.x = 0;
                    particle.size = Math.random() * 3 + 1;
                    particle.speed = Math.random() * 1.5 + 0.5;
                    particle.opacity = Math.random() * 0.7 + 0.3;
                }
            });
        };

        // Animation function
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update flow line phase (makes the sine wave move)
            lines.forEach((line: any) => {
                line.phase += 0.003;
                drawLine(line);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-96 md:h-[500px] relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full "
            />
        </div>
    );
};


// const GridRippleEffect = () => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         let animationFrameId;

//         // Set canvas dimensions
//         const setCanvasDimensions = () => {
//             canvas.width = canvas.clientWidth;
//             canvas.height = canvas.clientHeight;
//         };

//         setCanvasDimensions();
//         window.addEventListener('resize', setCanvasDimensions);

//         // Grid configuration
//         const gridSpacing = 30;
//         const cols = Math.floor(canvas.width / gridSpacing) + 1;
//         const rows = Math.floor(canvas.height / gridSpacing) + 1;

//         // Colors
//         const dotColor = '#36F1CD';
//         const dotSecondaryColor = '#13C4A3';

//         // Ripples
//         const ripples = [];
//         const maxRipples = 3;

//         // Grid points
//         const grid = [];
//         for (let i = 0; i < cols; i++) {
//             grid[i] = [];
//             for (let j = 0; j < rows; j++) {
//                 grid[i][j] = {
//                     x: i * gridSpacing,
//                     y: j * gridSpacing,
//                     baseSize: 1.5,
//                     size: 1.5, // dot size
//                     color: dotColor,
//                     affected: false
//                 };
//             }
//         }

//         // Create a ripple
//         const createRipple = () => {
//             if (ripples.length < maxRipples) {
//                 const colIndex = Math.floor(Math.random() * cols);
//                 const rowIndex = Math.floor(Math.random() * rows);

//                 ripples.push({
//                     x: grid[colIndex][rowIndex].x,
//                     y: grid[colIndex][rowIndex].y,
//                     radius: 0,
//                     maxRadius: Math.max(canvas.width, canvas.height) * 0.6,
//                     speed: Math.random() * 2 + 2,
//                     color: Math.random() > 0.5 ? dotColor : dotSecondaryColor,
//                     strength: Math.random() * 4 + 2
//                 });
//             }
//         };

//         // Automatically create ripples at intervals
//         const rippleInterval = setInterval(() => {
//             createRipple();
//         }, 2000);

//         // Handle ripple effects on grid points
//         const updateGrid = () => {
//             // Reset all points to base size
//             for (let i = 0; i < cols; i++) {
//                 for (let j = 0; j < rows; j++) {
//                     grid[i][j].size = grid[i][j].baseSize;
//                     grid[i][j].color = dotColor;
//                     grid[i][j].affected = false;
//                 }
//             }

//             // Apply ripple effects
//             ripples.forEach(ripple => {
//                 for (let i = 0; i < cols; i++) {
//                     for (let j = 0; j < rows; j++) {
//                         const point = grid[i][j];
//                         const distance = Math.sqrt(
//                             Math.pow(point.x - ripple.x, 2) +
//                             Math.pow(point.y - ripple.y, 2)
//                         );

//                         // Check if point is within ripple effect range
//                         if (Math.abs(distance - ripple.radius) < 40) {
//                             const effect = Math.max(0, 1 - Math.abs(distance - ripple.radius) / 40);

//                             // Only apply if this effect is stronger than any existing effect
//                             if (!point.affected || effect > point.affected) {
//                                 point.size = point.baseSize + ripple.strength * effect;
//                                 point.color = ripple.color;
//                                 point.affected = effect;
//                             }
//                         }
//                     }
//                 }
//             });
//         };

//         // Draw the grid and ripples
//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             // Draw grid
//             for (let i = 0; i < cols; i++) {
//                 for (let j = 0; j < rows; j++) {
//                     const point = grid[i][j];

//                     // Draw point
//                     ctx.beginPath();
//                     ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
//                     ctx.fillStyle = point.color;
//                     ctx.fill();
//                 }
//             }

//             // Draw ripple circles
//             ripples.forEach(ripple => {
//                 ctx.beginPath();
//                 ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
//                 ctx.strokeStyle = `rgba(54, 241, 205, ${Math.max(0, 0.5 - ripple.radius / ripple.maxRadius * 0.5)})`;
//                 ctx.lineWidth = 1;
//                 ctx.stroke();
//             });
//         };

//         // Animation function
//         const animate = () => {
//             // Update ripples
//             for (let i = ripples.length - 1; i >= 0; i--) {
//                 ripples[i].radius += ripples[i].speed;

//                 // Remove ripples that have expanded too far
//                 if (ripples[i].radius > ripples[i].maxRadius) {
//                     ripples.splice(i, 1);
//                 }
//             }

//             updateGrid();
//             draw();

//             animationFrameId = requestAnimationFrame(animate);
//         };

//         animate();

//         return () => {
//             window.removeEventListener('resize', setCanvasDimensions);
//             cancelAnimationFrame(animationFrameId);
//             clearInterval(rippleInterval);
//         };
//     }, []);

//     return (
//         <div className="w-full h-96 md:h-[500px] relative">
//             <canvas
//                 ref={canvasRef}
//                 className="w-full h-full  "
//             />
//         </div>
//     );
// };



export default Hero