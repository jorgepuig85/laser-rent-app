"use client";

import React, { useEffect, useRef } from "react";
import { useSeason } from "@/context/SeasonContext";

export function SeasonalHeroEffects() {
  const { season } = useSeason();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      type: string;
      canvasWidth: number;
      canvasHeight: number;

      constructor(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1 + 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        
        // Season-specific particle Logic
        if (season === "autumn") {
          const colors = ["#D4AF37", "#92400E", "#B45309", "#78350F"];
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.type = "leaf";
        } else if (season === "winter") {
          this.color = "#FFFFFF";
          this.type = "snow";
          this.speedY = Math.random() * 2 + 1;
        } else if (season === "spring") {
          this.color = "#F472B6";
          this.type = "petal";
        } else {
          this.color = "rgba(255, 255, 255, 0.1)";
          this.type = "wave";
        }
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 50) * 0.5;
        this.rotation += this.rotationSpeed;

        if (this.y > this.canvasHeight) {
          this.y = -20;
          this.x = Math.random() * this.canvasWidth;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;

        if (this.type === "leaf") {
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === "snow") {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === "petal") {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size, -this.size, -this.size, this.size, 0, this.size);
          ctx.bezierCurveTo(this.size, this.size, this.size, -this.size, 0, 0);
          ctx.fill();
        } else {
          // Waves for summer (simplified)
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      const count = season === "autumn" ? 30 : 50;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
