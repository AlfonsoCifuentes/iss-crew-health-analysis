'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Seeded random function to ensure consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startTimeRef.current = performance.now();

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initShootingStars();
    };

    // Initialize fixed stars with seeded randomness for consistency
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < 300; i++) {
        starsRef.current.push({
          x: seededRandom(i * 42) * canvas.width,
          y: seededRandom(i * 73) * canvas.height,
          size: seededRandom(i * 31) * 2 + 0.5,
          brightness: seededRandom(i * 67) * 0.8 + 0.2,
          twinkleSpeed: seededRandom(i * 97) * 0.005 + 0.001,
          twinkleOffset: seededRandom(i * 123) * Math.PI * 2,
        });
      }
    };

    // Initialize shooting stars
    const initShootingStars = () => {
      shootingStarsRef.current = [];
      for (let i = 0; i < 3; i++) {
        shootingStarsRef.current.push({
          x: -100,
          y: seededRandom(i * 234) * canvas.height,
          length: seededRandom(i * 456) * 80 + 20,
          speed: seededRandom(i * 789) * 3 + 2,
          angle: seededRandom(i * 345) * 60 + 15,
          opacity: 0,
          active: false,
        });
      }
    };

    // Create new shooting star occasionally
    const createShootingStar = (time: number) => {
      const inactiveStar = shootingStarsRef.current.find(star => !star.active);
      if (inactiveStar && Math.sin(time * 0.0001) > 0.995) { // Deterministic timing
        inactiveStar.x = -100;
        inactiveStar.y = seededRandom(time * 0.001) * canvas.height;
        inactiveStar.length = seededRandom(time * 0.002) * 80 + 20;
        inactiveStar.speed = seededRandom(time * 0.003) * 4 + 3;
        inactiveStar.angle = seededRandom(time * 0.004) * 60 + 15;
        inactiveStar.opacity = 1;
        inactiveStar.active = true;
      }
    };

    // Animation loop
    const animate = () => {
      // Create darker space background
      ctx.fillStyle = '#000008';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentTime = performance.now() - startTimeRef.current;

      // Draw fixed stars with twinkling effect
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(currentTime * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;

        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Create glow effect for brighter stars
        if (star.size > 1.5) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Draw the star core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
      });

      // Handle shooting stars
      createShootingStar(currentTime);
      
      shootingStarsRef.current.forEach(shootingStar => {
        if (!shootingStar.active) return;

        // Update position
        const radianAngle = (shootingStar.angle * Math.PI) / 180;
        shootingStar.x += Math.cos(radianAngle) * shootingStar.speed;
        shootingStar.y += Math.sin(radianAngle) * shootingStar.speed;

        // Fade out as it moves
        shootingStar.opacity -= 0.01;

        // Deactivate if off screen or fully faded
        if (shootingStar.x > canvas.width + 100 || shootingStar.opacity <= 0) {
          shootingStar.active = false;
          return;
        }

        // Draw shooting star trail
        ctx.save();
        ctx.globalAlpha = shootingStar.opacity;
        
        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - Math.cos(radianAngle) * shootingStar.length,
          shootingStar.y - Math.sin(radianAngle) * shootingStar.length
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(radianAngle) * shootingStar.length,
          shootingStar.y - Math.sin(radianAngle) * shootingStar.length
        );
        ctx.stroke();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    initStars();
    initShootingStars();
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      initStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
