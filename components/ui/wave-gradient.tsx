"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function WaveGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: "low-power",
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // Vertex Shader: Fullscreen quad
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Organic WaveGradient in ADGIPS collegiate palette
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = (st - 0.5) * vec2(aspect, 1.0);

        // Smooth subtle mouse interaction
        vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0) * 0.28;
        p -= m;

        // Slow atmospheric temporal progression
        float t = u_time * 0.14;

        // Multi-harmonic undulating wave fields
        float wave1 = sin(p.x * 1.8 + t * 0.75) * cos(p.y * 1.5 - t * 0.6);
        float wave2 = sin(p.y * 2.2 - t * 0.7 + wave1 * 1.3) * cos(p.x * 2.0 + t * 0.5);

        vec2 warped = p + vec2(
          sin(p.y * 2.4 + t * 0.85 + wave2 * 0.8),
          cos(p.x * 2.4 - t * 0.65 + wave1 * 0.8)
        ) * 0.45;

        float wave3 = sin(warped.x * 3.2 + warped.y * 2.6 + t * 1.05);
        float wave4 = cos(warped.y * 3.4 - warped.x * 2.1 + t * 0.85 + wave3 * 0.6);

        // Smooth blending transitions
        float blend1 = smoothstep(-1.0, 1.0, wave1 + wave2 * 0.5);
        float blend2 = smoothstep(-0.8, 1.2, wave2 + wave3 * 0.6);
        float blend3 = smoothstep(-0.6, 1.3, wave3 * 0.7 + wave4 * 0.7);
        float crest  = smoothstep(0.48, 1.0, sin(warped.x * 3.8 + warped.y * 3.0 + t * 1.15));

        // ADGIPS Warm Botanical Colors
        vec3 colDeepForest = vec3(0.027, 0.102, 0.071); // #071A12
        vec3 colEmerald    = vec3(0.090, 0.294, 0.208); // #174B35
        vec3 colSage       = vec3(0.322, 0.478, 0.314); // #527A50
        vec3 colWarmSand    = vec3(0.710, 0.655, 0.475); // #B5A779
        vec3 colAmber       = vec3(0.839, 0.643, 0.357); // #D6A45B

        // Organic warm fluid color mixing
        vec3 color = mix(colDeepForest, colEmerald, blend1);
        color = mix(color, colSage, blend2 * 0.88);
        color = mix(color, colWarmSand, blend3 * 0.48);
        color = mix(color, colAmber, crest * 0.30);

        // Atmospheric vignette
        float dist = length(st - 0.5);
        float vignette = 1.0 - smoothstep(0.45, 1.5, dist);
        color *= (0.88 + 0.12 * vignette);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Shader compilation helper
    function createShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.warn("Shader compilation error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setHasWebGL(false);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program linking error:", gl.getProgramInfoLog(program));
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Quad geometry (2 triangles covering clip space)
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    // Mouse coordinates with smooth damping
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX / window.innerWidth;
        targetMouseY = 1.0 - e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Resize handling with DPR clamping
    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl!.viewport(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Animation render loop
    let animationFrameId: number;
    let startTime = performance.now();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible) {
        startTime = performance.now();
        render();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) return;

      const now = performance.now();
      const elapsed = shouldReduceMotion ? 2.5 : (now - startTime) * 0.001;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      gl!.uniform1f(timeLocation, elapsed);
      gl!.uniform2f(resolutionLocation, canvas!.width, canvas!.height);
      gl!.uniform2f(mouseLocation, currentMouseX, currentMouseY);

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);

      if (!shouldReduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (gl) {
        gl.deleteBuffer(vertexBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [shouldReduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden select-none"
    >
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover"
        />
      ) : (
        /* Graceful CSS fallback if WebGL is unavailable */
        <div className="w-full h-full bg-gradient-to-br from-[#071A12] via-[#174B35] to-[#B5A779]" />
      )}
    </div>
  );
}
