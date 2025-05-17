import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const GlobeModel = () => {
  const navigate = useNavigate();
  
  // Using reliable CDN-hosted textures
  const [earthTexture, bumpMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  return (
    <mesh onClick={() => navigate('/countries')}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        map={earthTexture}
        bumpMap={bumpMap}
        bumpScale={0.05}
        specularMap={specularMap}
        specular={new THREE.Color('grey')}
        shininess={5}
      />
    </mesh>
  );
};

const Globe = () => {
  return (
    <div className="relative h-screen w-full bg-gray-900">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 3, 5]} intensity={0.4} />
        <Suspense fallback={null}>
          <GlobeModel />
        </Suspense>
        <OrbitControls 
          enableZoom={true}
          zoomSpeed={0.6}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={8}
        />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      
      <div className="absolute bottom-10 left-0 right-0 text-center text-white text-xl">
        <p className="bg-black bg-opacity-50 inline-block px-4 py-2 rounded-lg">
          Click on the globe to explore countries
        </p>
      </div>
    </div>
  );
};

export default Globe;