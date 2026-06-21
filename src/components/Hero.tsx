"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { motion, useMotionValue, useTransform } from "framer-motion";

function ParticleClouds() {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.7 + Math.random() * 0.3;
      const theta = 2 * Math.random() * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
}

function AnimatedEarth() {
  const earthRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      earthRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.2;
    }
  });

  return (
    <group ref={earthRef}>
      <Sphere args={[2.5, 64, 64]}>
        <MeshDistortMaterial 
          color="#06b6d4" 
          attach="material" 
          distort={0.1} 
          speed={1.5} 
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
          emissive="#06b6d4"
          emissiveIntensity={0.3}
        />
      </Sphere>
      {[ [2.5, 0, 0], [-2.5, 0, 0], [0, 2.5, 0], [0, 0, 2.5] ].map((pos, i) => (
        <Sphere key={i} args={[0.05, 16, 16]} position={pos as [number, number, number]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      ))}
      <ParticleClouds />
    </group>
  );
}

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const parallaxX = useTransform(mouseX, [-1, 1], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-1, 1], [-20, 20]);
  const canvasParallaxX = useTransform(mouseX, [-1, 1], [-10, 10]);
  const canvasParallaxY = useTransform(mouseY, [-1, 1], [-10, 10]);

  // Staggered Text Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#050816] flex items-center">
      {/* Background Aura with Mouse Tracking */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10">
        
        {/* Left Side: Text Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start justify-center pt-20 md:pt-0"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-tight"
          >
            Discover Your Next <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Adventure</span> with AI
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-lg md:text-xl mb-10 max-w-md"
          >
            Personalized trips, smart budgets, and instant itineraries tailored exactly to your travel style.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex gap-4"
          >
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all">
              Start Planning
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-bold text-white hover:bg-white/10 transition-colors">
              Explore Destinations
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Canvas Background */}
        <motion.div 
          style={{ x: canvasParallaxX, y: canvasParallaxY }}
          className="absolute inset-0 md:relative md:h-[600px] z-0 md:z-10 opacity-50 md:opacity-100 pointer-events-none md:pointer-events-auto"
        >
          <Canvas camera={{ position: [0, 0, 7] }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#8b5cf6" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <AnimatedEarth />
          </Canvas>
        </motion.div>
        
      </div>
    </section>
  );
}
