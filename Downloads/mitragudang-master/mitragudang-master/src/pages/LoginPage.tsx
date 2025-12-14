import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Package, Warehouse, Truck, Box } from 'lucide-react';

// Floating box configuration for the background
const floatingBoxes = [
  { size: 80, left: '10%', top: '15%', delay: '0s', animation: 'animate-float-box', opacity: 0.15 },
  { size: 120, left: '75%', top: '10%', delay: '1s', animation: 'animate-float-box-slow', opacity: 0.1 },
  { size: 60, left: '85%', top: '60%', delay: '2s', animation: 'animate-float-box-reverse', opacity: 0.12 },
  { size: 100, left: '5%', top: '70%', delay: '0.5s', animation: 'animate-float-box', opacity: 0.08 },
  { size: 50, left: '45%', top: '5%', delay: '1.5s', animation: 'animate-float-box-slow', opacity: 0.15 },
  { size: 70, left: '60%', top: '80%', delay: '2.5s', animation: 'animate-float-box', opacity: 0.1 },
  { size: 90, left: '25%', top: '85%', delay: '0.8s', animation: 'animate-float-box-reverse', opacity: 0.12 },
  { size: 40, left: '90%', top: '35%', delay: '1.2s', animation: 'animate-float-box-slow', opacity: 0.18 },
  { size: 55, left: '15%', top: '45%', delay: '1.8s', animation: 'animate-float-box', opacity: 0.1 },
  { size: 75, left: '70%', top: '45%', delay: '2.2s', animation: 'animate-float-box-reverse', opacity: 0.08 },
];

// Floating icons for warehouse theme
const floatingIcons = [
  { Icon: Package, size: 32, left: '20%', top: '25%', delay: '0.3s' },
  { Icon: Warehouse, size: 40, left: '80%', top: '20%', delay: '1.2s' },
  { Icon: Truck, size: 36, left: '15%', top: '75%', delay: '0.8s' },
  { Icon: Box, size: 28, left: '85%', top: '70%', delay: '1.8s' },
  { Icon: Package, size: 24, left: '50%', top: '85%', delay: '2.1s' },
];

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="login-background">
        {/* Floating Boxes */}
        {floatingBoxes.map((box, index) => (
          <div
            key={index}
            className={`login-floating-box ${box.animation}`}
            style={{
              width: box.size,
              height: box.size,
              left: box.left,
              top: box.top,
              animationDelay: box.delay,
              opacity: box.opacity,
            }}
          />
        ))}

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <div
            key={`icon-${index}`}
            className="absolute animate-particle text-white/20"
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
            }}
          >
            <item.Icon size={item.size} />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Radial Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-card-entrance">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-6 animate-float-box-slow">
              <Warehouse className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Mitra<span className="text-cyan-400">Gudang</span>
            </h1>
            <p className="text-white/60">
              Inventory Management System
            </p>
          </div>

          {/* Login Form Card */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;