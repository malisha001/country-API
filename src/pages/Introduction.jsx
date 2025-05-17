import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const WorldGlobe = ({ scrollProgress }) => {
  const globeRef = useRef();
  const [colorMap, normalMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    if (scrollProgress.get() < 0.33) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={10}
          emissive="#000000"
          emissiveIntensity={0.1}
        />
      </mesh>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
    </>
  );
};

const World3DView = ({ scrollYProgress }) => {
  // Slower horizontal movement
  const x = useTransform(scrollYProgress, [0, 0.33], ['-30%', '30%']);
  // More gradual vertical movement
  const y = useTransform(scrollYProgress, [0, 0.33], [0, -150]);
  // Slower scale changes
  const scale = useTransform(scrollYProgress, [0, 0.33], [1, 1.5]);
  // Smoother opacity transition
  const opacity = useTransform(scrollYProgress, [0.25, 0.33], [1, 0.2]);
  // Longer title visibility
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  // Add slight right offset for title
  const titleX = useTransform(scrollYProgress, [0, 0.33], ['5%', '5%']);

  return (
    <motion.div 
      className="h-screen w-full fixed top-0 left-0 pointer-events-none"
      style={{ x, y, scale, opacity }}
    >
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ 
          opacity: titleOpacity,
          x: titleX // Added this line for right offset
        }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg text-center">
          Explore Our World
        </h1>
        <p className="text-xl text-white mt-4 drop-shadow-md text-center">
          Interactive 3D globe with country data
        </p>
      </motion.div>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
        <WorldGlobe scrollProgress={scrollYProgress} />
      </Canvas>
    </motion.div>
  );
};

const CountryView = ({ scrollYProgress }) => {
  // Adjusted timing for smoother transitions
  const y = useTransform(scrollYProgress, [0.33, 0.66], [200, -100]);
  const opacity = useTransform(scrollYProgress, [0.33, 0.4, 0.6, 0.66], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.33, 0.4], [0.8, 1]);
  const x = useTransform(scrollYProgress, [0.33, 0.66], ['10%', '0%']);

  return (
    <motion.div 
      className="h-screen w-full fixed top-0 left-0 flex items-center justify-center px-4"
      style={{ y, opacity, scale, x }}
    >
      <div className="max-w-6xl w-full bg-gray-900/90 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-700">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Country Data API Integration
          </span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* API Features */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-indigo-500/20 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Country Data</h3>
                <p className="text-gray-300">
                  Integrated with REST Countries API to fetch detailed information including population, 
                  languages, currencies, and regional data for every country worldwide.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Filtering</h3>
                <p className="text-gray-300">
                  Filter countries by region (Americas, Europe, Asia, etc.), official language, 
                  and currency. Combine multiple filters for precise results.
                </p>
              </div>
            </div>
          </div>
          
          {/* Favorites & UI Features */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-pink-500/20 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Favorites System</h3>
                <p className="text-gray-300">
                  Bookmark your frequently accessed countries with our persistent favorites system. 
                  Access your saved countries anytime with one click.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-500/20 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Modern UI</h3>
                <p className="text-gray-300">
                  Clean, responsive interface with interactive maps, flag displays, and 
                  data visualizations for an engaging user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Technical Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React', color: 'text-blue-400' },
              { name: 'React Three Fiber', color: 'text-purple-400' },
              { name: 'Framer Motion', color: 'text-pink-400' },
              { name: 'REST API', color: 'text-green-400' }
            ].map((tech, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${tech.color} bg-current`}></div>
                <span className="text-gray-300">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExchangeRateView = ({ scrollYProgress }) => {
  const navigate = useNavigate();
  // Adjusted timing for final section
  const y = useTransform(scrollYProgress, [0.66, 1], [200, -100]);
  const opacity = useTransform(scrollYProgress, [0.66, 0.75, 0.9, 1], [0, 1, 1, 0.8]);
  const buttonOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.8, 0.9], [50, 0]);
  const x = useTransform(scrollYProgress, [0.66, 1], ['-10%', '0%']);
  // Added scale animation for more impact
  const scale = useTransform(scrollYProgress, [0.66, 0.75], [0.9, 1]);

  return (
    <motion.div 
      className="h-screen w-full fixed top-0 left-0 flex items-center justify-center px-4"
      style={{ y, opacity, x, scale }}
    >
      <div className="max-w-4xl w-full bg-gray-900/90 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
            Real-Time Exchange Rates
          </span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Exchange Rate Demo */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="w-2/5">
                <input 
                  type="number" 
                  defaultValue="1" 
                  className="w-full p-3 border-2 border-gray-700 rounded-lg text-center text-lg bg-gray-900 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200/10"
                />
                <p className="text-sm mt-2 text-center text-gray-400">USD</p>
              </div>
              
              <div className="mx-2">
                <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              
              <div className="w-2/5">
                <div className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-900 text-center text-lg text-white">
                  0.85
                </div>
                <p className="text-sm mt-2 text-center text-gray-400">EUR</p>
              </div>
            </div>
            
            <div className="text-center text-gray-300 text-sm">
              Rates update every 30 minutes from our financial data provider
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-teal-500/20 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Country-Specific Rates</h3>
                <p className="text-gray-300 text-sm">
                  View exchange rates relative to each country's official currency with historical trends.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-cyan-500/20 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Visual Trends</h3>
                <p className="text-gray-300 text-sm">
                  7-day and 30-day charts showing currency performance against major benchmarks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-emerald-500/20 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Multi-Currency</h3>
                <p className="text-gray-300 text-sm">
                  Compare any currency pair with our universal converter tool.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div
          className="mt-6"
          style={{ opacity: buttonOpacity, y: buttonY }}
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/countries')}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
          >
            Explore Currency Dashboard
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Introduction = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Increased container height to 500vh for longer scroll duration */}
      
      <World3DView scrollYProgress={scrollYProgress} />
      <CountryView scrollYProgress={scrollYProgress} />
      <ExchangeRateView scrollYProgress={scrollYProgress} />
      
      {/* Enhanced Scroll Indicator with multiple states */}
      <motion.div 
        className="fixed bottom-8 left-0 right-0 text-center z-50"
        style={{ 
          opacity: useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [1, 0, 0, 1]),
          y: useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 20, 20, 0])
        }}
      >
        <motion.p 
          className="text-white/80 mb-2 text-sm"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {scrollYProgress.get() > 0.9 ? "Scroll to top" : "Scroll to explore"}
        </motion.p>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 bg-white/80 rounded-full mt-1" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Introduction;