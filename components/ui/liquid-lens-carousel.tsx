"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Archive,
  Layers,
  Compass,
} from "lucide-react";
import { EventItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LiquidLensCarouselProps {
  events: EventItem[];
  className?: string;
  autoPlayInterval?: number;
}

export function LiquidLensCarousel({
  events,
  className = "",
  autoPlayInterval = 4500,
}: LiquidLensCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction & Physics state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Mutable refs for high-frequency animation loop (60+ FPS)
  const animState = useRef({
    progress: 0,
    targetProgress: 0,
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartProgress: 0,
    lastDragX: 0,
    lastDragTime: 0,
    time: 0,
  });

  // Preloaded image map
  const imageElements = useRef<Map<string, HTMLImageElement>>(new Map());

  // WebGL resources
  const glContextRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    texture: WebGLTexture;
    offscreenCanvas: HTMLCanvasElement;
    offscreenCtx: CanvasRenderingContext2D;
    positionBuffer: WebGLBuffer;
    uniforms: {
      u_resolution: WebGLUniformLocation | null;
      u_time: WebGLUniformLocation | null;
      u_lensCenter: WebGLUniformLocation | null;
      u_lensRadius: WebGLUniformLocation | null;
      u_zoom: WebGLUniformLocation | null;
      u_dispersion: WebGLUniformLocation | null;
      u_distortion: WebGLUniformLocation | null;
      u_rimWidth: WebGLUniformLocation | null;
      u_dragSpeed: WebGLUniformLocation | null;
    };
  } | null>(null);

  // Preload all event images
  useEffect(() => {
    let loadedCount = 0;
    const total = events.length;
    if (total === 0) return;

    events.forEach((evt) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = evt.image;
      img.onload = () => {
        loadedCount++;
        imageElements.current.set(evt.image, img);
        if (loadedCount >= total) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= total) {
          setImagesLoaded(true);
        }
      };
    });
  }, [events]);

  // Active event item
  const activeEvent = useMemo(() => {
    if (!events.length) return null;
    const normIdx = ((currentIndex % events.length) + events.length) % events.length;
    return events[normIdx];
  }, [currentIndex, events]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    animState.current.targetProgress = Math.round(animState.current.targetProgress) + 1;
  }, []);

  const goToPrev = useCallback(() => {
    animState.current.targetProgress = Math.round(animState.current.targetProgress) - 1;
  }, []);

  const goToIndex = useCallback((idx: number) => {
    const total = events.length;
    if (total === 0) return;
    const curP = animState.current.progress;
    const curRound = Math.round(curP);
    const curNorm = ((curRound % total) + total) % total;
    let diff = idx - curNorm;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    animState.current.targetProgress = curRound + diff;
  }, [events.length]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isHovered || animState.current.isDragging) return;
    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, autoPlayInterval, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Mouse wheel navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelDebounceTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      // If user is predominantly scrolling horizontally or with alt/shift, use for carousel
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        const delta = (e.deltaX || e.deltaY) * 0.003;
        animState.current.targetProgress += delta;
        clearTimeout(wheelDebounceTimeout);
        wheelDebounceTimeout = setTimeout(() => {
          animState.current.targetProgress = Math.round(animState.current.targetProgress);
        }, 120);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      clearTimeout(wheelDebounceTimeout);
    };
  }, []);

  // WebGL & Canvas Initialization and Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // WebGL Context
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported for LiquidLensCarousel; falling back.");
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        v_uv.y = 1.0 - v_uv.y; // Match 2D canvas coordinates
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Liquid Glass Lens with Barrel Refraction, Chromatic Dispersion & Rim Ripple
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_lensCenter;
      uniform float u_lensRadius;
      uniform float u_zoom;
      uniform float u_dispersion;
      uniform float u_distortion;
      uniform float u_rimWidth;
      uniform float u_dragSpeed;

      void main() {
        vec2 uv = v_uv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 delta = (uv - u_lensCenter) * aspect;
        float dist = length(delta);
        float radius = u_lensRadius;

        // Dynamic multi-harmonic ripple along the rim
        float angle = atan(delta.y, delta.x);
        float ripple1 = sin(angle * 7.0 + u_time * 2.8);
        float ripple2 = cos(angle * 13.0 - u_time * 1.6);
        float rippleAmp = 0.012 + clamp(abs(u_dragSpeed) * 0.015, 0.0, 0.025);
        float dynamicRadius = radius + (ripple1 * 0.65 + ripple2 * 0.35) * rippleAmp * smoothstep(radius * 0.65, radius, dist);

        if (dist < dynamicRadius) {
          float normDist = dist / dynamicRadius; // 0.0 (center) to 1.0 (rim)
          
          // Convex liquid lens profile: center is magnified, edge has barrel refraction
          float refraction = pow(normDist, 2.3) * u_distortion;
          float zoomFactor = mix(u_zoom, 1.0, pow(normDist, 1.6));
          
          // Compute displaced UV coordinate
          vec2 dir = normalize(delta) / aspect;
          vec2 centerUV = u_lensCenter + (delta / aspect) / zoomFactor - dir * refraction * 0.14;
          
          // Chromatic dispersion (RGB wavelength split)
          float disp = u_dispersion * pow(normDist, 1.4) * (1.0 + clamp(abs(u_dragSpeed) * 0.8, 0.0, 1.5));
          vec2 uvR = clamp(centerUV + dir * disp, vec2(0.001), vec2(0.999));
          vec2 uvG = clamp(centerUV, vec2(0.001), vec2(0.999));
          vec2 uvB = clamp(centerUV - dir * disp, vec2(0.001), vec2(0.999));
          
          vec4 colR = texture2D(u_texture, uvR);
          vec4 colG = texture2D(u_texture, uvG);
          vec4 colB = texture2D(u_texture, uvB);
          
          vec3 color = vec3(colR.r, colG.g, colB.b);
          
          // Glass rim illumination / Fresnel edge
          float rimFactor = smoothstep(dynamicRadius - u_rimWidth, dynamicRadius, dist);
          
          // Directional specular highlight (ambient light reflection from top-left)
          vec2 lightDir = normalize(vec2(-0.707, -0.707));
          float highlight = max(0.0, dot(normalize(delta), lightDir));
          highlight = pow(highlight, 5.0) * smoothstep(dynamicRadius * 0.75, dynamicRadius * 0.97, dist);
          
          // ADGIPS collegiate emerald-cyan subtle glass glow
          vec3 rimGlowColor = vec3(0.25, 0.85, 0.65);
          color += rimGlowColor * rimFactor * 0.32;
          color += vec3(0.92, 0.98, 1.0) * highlight * 0.45;
          
          // Subtle inner lens sheen and vignette
          float innerSheen = (1.0 - normDist) * 0.05;
          color += innerSheen;
          
          // Subtle outer rim bevel beveling
          float bevel = smoothstep(dynamicRadius - 0.007, dynamicRadius, dist);
          color = mix(color, vec3(0.04, 0.12, 0.09), bevel * 0.4);

          gl_FragColor = vec4(color, 1.0);
        } else {
          // Outside lens: soft ambient shadow/glow beneath the glass, then direct image
          float outerGlow = smoothstep(dynamicRadius + 0.035, dynamicRadius, dist);
          vec4 baseColor = texture2D(u_texture, uv);
          vec3 color = baseColor.rgb + vec3(0.12, 0.45, 0.35) * outerGlow * 0.25;
          gl_FragColor = vec4(color, baseColor.a);
        }
      }
    `;

    // Compile helper
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // Geometry Quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Offscreen Canvas for rendering the carousel track
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: false });
    if (!offscreenCtx) return;

    // WebGL Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Uniform locations
    const uniforms = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_lensCenter: gl.getUniformLocation(program, "u_lensCenter"),
      u_lensRadius: gl.getUniformLocation(program, "u_lensRadius"),
      u_zoom: gl.getUniformLocation(program, "u_zoom"),
      u_dispersion: gl.getUniformLocation(program, "u_dispersion"),
      u_distortion: gl.getUniformLocation(program, "u_distortion"),
      u_rimWidth: gl.getUniformLocation(program, "u_rimWidth"),
      u_dragSpeed: gl.getUniformLocation(program, "u_dragSpeed"),
    };

    glContextRef.current = {
      gl,
      program,
      texture: texture!,
      offscreenCanvas,
      offscreenCtx,
      positionBuffer: positionBuffer!,
      uniforms,
    };

    // Responsive Canvas Resize Observer
    let width = 0;
    let height = 0;
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(rect.width * dpr);
      // Responsive height
      const cssHeight = rect.width < 640 ? 390 : rect.width < 1024 ? 460 : 510;
      height = Math.floor(cssHeight * dpr);

      canvas.width = width;
      canvas.height = height;
      canvas.style.height = `${cssHeight}px`;

      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);
    resizeCanvas();

    // Cross-browser rounded rect helper
    const drawRoundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }
    };

    // Animation Render Loop
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;
      animState.current.time += dt;

      // Physics interpolation: smooth spring lerp towards target
      const state = animState.current;
      if (!state.isDragging) {
        const diff = state.targetProgress - state.progress;
        // Damped spring
        state.progress += diff * Math.min(dt * 7.5, 0.25);
        state.velocity = diff * 5.0;
      }

      // Update React active index when nearest card changes
      const total = events.length;
      if (total > 0) {
        const rounded = Math.round(state.progress);
        const norm = ((rounded % total) + total) % total;
        setCurrentIndex((prev) => (prev !== norm ? norm : prev));
      }

      // 1. Draw Carousel Track on Offscreen Canvas
      if (width > 0 && height > 0) {
        offscreenCtx.clearRect(0, 0, width, height);

        // Responsive card dimensions in device pixels
        const isMobile = width < 768 * 2;
        const cardW = isMobile ? width * 0.62 : Math.min(width * 0.34, 420 * (width / 1200));
        const cardH = cardW * 1.32;
        const cardGap = cardW * 0.18;
        const cardStep = cardW + cardGap;
        const cornerR = Math.max(16, cardW * 0.06);

        const centerX = width / 2;
        const centerY = height / 2;

        // Draw each event card with continuous wrapping
        events.forEach((evt, idx) => {
          // Angular shortest distance
          let diff = (idx - state.progress) % total;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const cardCenterX = centerX + diff * cardStep;
          const cardLeft = cardCenterX - cardW / 2;
          const cardTop = centerY - cardH / 2;

          // Frustum culling: skip if entirely outside viewport
          if (cardLeft + cardW < -80 || cardLeft > width + 80) return;

          // Distance from center for scale/opacity
          const distNorm = Math.abs(diff);
          const scale = Math.max(0.85, 1.0 - distNorm * 0.08);
          const opacity = Math.max(0.45, 1.0 - distNorm * 0.25);

          offscreenCtx.save();
          offscreenCtx.translate(cardCenterX, centerY);
          offscreenCtx.scale(scale, scale);
          offscreenCtx.translate(-cardW / 2, -cardH / 2);
          offscreenCtx.globalAlpha = opacity;

          // Card Drop Shadow
          offscreenCtx.shadowColor = "rgba(0, 0, 0, 0.45)";
          offscreenCtx.shadowBlur = 28;
          offscreenCtx.shadowOffsetY = 14;

          // Card Background & Image Clipping
          drawRoundedRect(offscreenCtx, 0, 0, cardW, cardH, cornerR);
          offscreenCtx.fillStyle = "#0a141b";
          offscreenCtx.fill();
          offscreenCtx.shadowColor = "transparent";

          offscreenCtx.save();
          offscreenCtx.clip();

          // Render Authentic Photograph
          const img = imageElements.current.get(evt.image);
          if (img && img.complete && img.naturalWidth > 0) {
            // Object-fit: cover
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const cardAspect = cardW / cardH;
            let sx = 0,
              sy = 0,
              sw = img.naturalWidth,
              sh = img.naturalHeight;
            if (imgAspect > cardAspect) {
              sw = img.naturalHeight * cardAspect;
              sx = (img.naturalWidth - sw) / 2;
            } else {
              sh = img.naturalWidth / cardAspect;
              sy = (img.naturalHeight - sh) / 2;
            }
            offscreenCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cardW, cardH);
          } else {
            // Placeholder gradient while loading
            const grad = offscreenCtx.createLinearGradient(0, 0, cardW, cardH);
            grad.addColorStop(0, "#08211b");
            grad.addColorStop(1, "#030c0a");
            offscreenCtx.fillStyle = grad;
            offscreenCtx.fill();
          }

          // Bottom Dark Scrim for 100% Typography Legibility
          const scrim = offscreenCtx.createLinearGradient(0, cardH * 0.4, 0, cardH);
          scrim.addColorStop(0, "rgba(2, 6, 12, 0.0)");
          scrim.addColorStop(0.5, "rgba(2, 6, 12, 0.65)");
          scrim.addColorStop(1, "rgba(2, 6, 12, 0.94)");
          offscreenCtx.fillStyle = scrim;
          offscreenCtx.fillRect(0, cardH * 0.35, cardW, cardH * 0.65);

          // Top Subtle Dark Gradient for Badge Clarity
          const topScrim = offscreenCtx.createLinearGradient(0, 0, 0, cardH * 0.28);
          topScrim.addColorStop(0, "rgba(2, 6, 12, 0.72)");
          topScrim.addColorStop(1, "rgba(2, 6, 12, 0.0)");
          offscreenCtx.fillStyle = topScrim;
          offscreenCtx.fillRect(0, 0, cardW, cardH * 0.28);

          // Top Badges: Category & Date
          const badgeH = Math.max(22, cardW * 0.075);
          const badgePadX = Math.max(10, cardW * 0.035);
          const badgeFontSize = Math.max(10, cardW * 0.034);

          // Category Pill
          offscreenCtx.font = `700 ${badgeFontSize}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          const catText = evt.category.toUpperCase();
          const catMetrics = offscreenCtx.measureText(catText);
          const catPillW = catMetrics.width + badgePadX * 2;

          drawRoundedRect(
            offscreenCtx,
            cardW * 0.05,
            cardH * 0.05,
            catPillW,
            badgeH,
            badgeH / 2
          );
          offscreenCtx.fillStyle = "rgba(10, 25, 47, 0.82)";
          offscreenCtx.fill();
          offscreenCtx.strokeStyle = "rgba(96, 165, 250, 0.4)";
          offscreenCtx.lineWidth = 1.2;
          offscreenCtx.stroke();

          offscreenCtx.fillStyle = "#93c5fd";
          offscreenCtx.fillText(
            catText,
            cardW * 0.05 + badgePadX,
            cardH * 0.05 + badgeH * 0.7
          );

          // Card Typography: Bottom Info
          const textMarginX = cardW * 0.06;
          const titleFontSize = Math.max(14, cardW * 0.056);
          const metaFontSize = Math.max(10, cardW * 0.036);

          // Date Line (Collegiate Amber / Cyan)
          offscreenCtx.font = `600 ${metaFontSize}px ui-sans-serif, system-ui, sans-serif`;
          offscreenCtx.fillStyle = "#38bdf8";
          offscreenCtx.fillText(evt.date, textMarginX, cardH - cardH * 0.24);

          // Event Title (Bold White with wrap handling)
          offscreenCtx.font = `800 ${titleFontSize}px ui-sans-serif, system-ui, sans-serif`;
          offscreenCtx.fillStyle = "#ffffff";
          const maxTextW = cardW - textMarginX * 2;
          
          // Truncate or single line
          let displayTitle = evt.title;
          if (offscreenCtx.measureText(displayTitle).width > maxTextW) {
            while (
              displayTitle.length > 4 &&
              offscreenCtx.measureText(displayTitle + "…").width > maxTextW
            ) {
              displayTitle = displayTitle.slice(0, -1);
            }
            displayTitle += "…";
          }
          offscreenCtx.fillText(displayTitle, textMarginX, cardH - cardH * 0.15);

          // Venue Tag
          offscreenCtx.font = `500 ${metaFontSize}px ui-sans-serif, system-ui, sans-serif`;
          offscreenCtx.fillStyle = "#cbd5e1";
          let displayVenue = evt.venue;
          if (offscreenCtx.measureText(displayVenue).width > maxTextW) {
            while (
              displayVenue.length > 4 &&
              offscreenCtx.measureText(displayVenue + "…").width > maxTextW
            ) {
              displayVenue = displayVenue.slice(0, -1);
            }
            displayVenue += "…";
          }
          offscreenCtx.fillText(displayVenue, textMarginX, cardH - cardH * 0.08);

          offscreenCtx.restore(); // Restore clip

          // Luminous Glass Card Border
          drawRoundedRect(offscreenCtx, 0, 0, cardW, cardH, cornerR);
          offscreenCtx.strokeStyle =
            distNorm < 0.5
              ? "rgba(56, 189, 248, 0.45)"
              : "rgba(255, 255, 255, 0.12)";
          offscreenCtx.lineWidth = 1.5;
          offscreenCtx.stroke();

          offscreenCtx.restore(); // Restore transform
        });

        // 2. Upload Offscreen Canvas into WebGL Texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          offscreenCanvas
        );

        // 3. Render WebGL Liquid Lens Quad
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const a_position = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

        // Responsive Lens Radius: comfortably encompasses centered card
        const isMobileScreen = width < 768 * 2;
        const normLensRadius = isMobileScreen ? 0.36 : 0.38;

        gl.uniform2f(uniforms.u_resolution, width, height);
        gl.uniform1f(uniforms.u_time, state.time);
        gl.uniform2f(uniforms.u_lensCenter, 0.5, 0.5);
        gl.uniform1f(uniforms.u_lensRadius, normLensRadius);
        gl.uniform1f(uniforms.u_zoom, 1.18); // Magnification
        gl.uniform1f(uniforms.u_dispersion, 0.022); // Chromatic aberration
        gl.uniform1f(uniforms.u_distortion, 0.38); // Barrel refraction
        gl.uniform1f(uniforms.u_rimWidth, 0.038); // Glass rim thickness
        gl.uniform1f(uniforms.u_dragSpeed, state.velocity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (glContextRef.current) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
        gl.deleteTexture(texture);
      }
    };
  }, [events]);

  // Pointer Drag Handlers with momentum inertia
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = animState.current;
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartProgress = state.progress;
    state.lastDragX = e.clientX;
    state.lastDragTime = performance.now();
    state.velocity = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = animState.current;
    if (!state.isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const isMobile = rect.width < 640;
    const cardStep = isMobile ? rect.width * 0.72 : Math.min(rect.width * 0.38, 460);

    const deltaX = e.clientX - state.dragStartX;
    const now = performance.now();
    const dt = Math.max((now - state.lastDragTime) / 1000, 0.008);
    const instantVelocity = (e.clientX - state.lastDragX) / (cardStep * dt);

    state.velocity = instantVelocity;
    state.lastDragX = e.clientX;
    state.lastDragTime = now;

    state.progress = state.dragStartProgress - deltaX / cardStep;
    state.targetProgress = state.progress;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = animState.current;
    if (!state.isDragging) return;
    state.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Click on slide detection
    const totalDelta = Math.abs(e.clientX - state.dragStartX);
    if (totalDelta < 6) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickXFromCenter = e.clientX - (rect.left + rect.width / 2);
        const isMobile = rect.width < 640;
        const cardStep = isMobile ? rect.width * 0.72 : Math.min(rect.width * 0.38, 460);
        const cardOffset = Math.round(clickXFromCenter / cardStep);
        if (cardOffset !== 0) {
          state.targetProgress = Math.round(state.progress) + cardOffset;
          return;
        }
      }
    }

    // Apply inertia based on release velocity
    const momentum = Math.max(-2, Math.min(2, state.velocity * 0.16));
    const rawTarget = state.progress - momentum;
    state.targetProgress = Math.round(rawTarget);
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-label="Liquid Lens Event Carousel"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Pill Bar */}
      <div className="relative px-6 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            className="bg-emerald-950/80 text-emerald-300 border-emerald-500/30 font-semibold px-3 py-1 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Liquid Lens Interactive Gallery
          </Badge>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
            Active Magnification & Refraction
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Swipe, drag, or use arrow keys</span>
          <span className="font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
            {String(currentIndex + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Interactive Liquid Lens WebGL Viewport */}
      <div className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          className="w-full block touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* Floating Hint Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg transition-opacity duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Center slide magnified through liquid glass lens</span>
        </div>
      </div>

      {/* Active Event Spotlight Card */}
      {activeEvent && (
        <div className="relative p-6 sm:p-8 lg:p-10 border-t border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/95 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 8 Cols: Detailed Information */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="default"
                  className="bg-slate-800/90 text-slate-200 border-slate-700 font-semibold px-3 py-1"
                >
                  <Archive className="w-3.5 h-3.5 mr-1 text-blue-400" />
                  Institutional Archive & Flagship Record
                </Badge>
                <Badge
                  variant="navy"
                  className="bg-blue-600/30 text-blue-300 border-blue-400/30 font-medium"
                >
                  {activeEvent.category}
                </Badge>
                {activeEvent.department && (
                  <span className="text-xs text-slate-400 font-medium">
                    {activeEvent.department}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                  {activeEvent.title}
                </h2>
                {activeEvent.subtitle && (
                  <p className="text-sm sm:text-base text-blue-300 font-medium tracking-wide">
                    {activeEvent.subtitle}
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {activeEvent.description}
              </p>

              {/* Meta Details Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-normal text-[11px]">Date</span>
                    <span className="font-bold text-white">{activeEvent.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-normal text-[11px]">Time</span>
                    <span className="font-bold text-white">{activeEvent.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-normal text-[11px]">Venue</span>
                    <span className="font-bold text-white truncate max-w-[180px] block">
                      {activeEvent.venue}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: CTA & Controls */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4 lg:pl-4">
              <Button
                variant="white"
                size="lg"
                href={`/events/${activeEvent.slug}`}
                className="w-full shadow-xl font-bold flex items-center justify-center gap-2 group"
              >
                <span>Explore Event Detail & Archive</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-300">Eligibility</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {activeEvent.status === "upcoming" ? "Open For Registration" : "Archived Record"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
                  {activeEvent.eligibility || "Open to all GGSIPU Affiliated College Students"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Carousel Controls Bar */}
      <div className="px-6 py-4 bg-slate-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Arrows & Play/Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5 px-3 text-xs"
            aria-label={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Slide Dots / Pills */}
        <div className="flex items-center gap-1.5">
          {events.map((evt, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={evt.id || idx}
                onClick={() => goToIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 focus:outline-none ${
                  isActive
                    ? "w-8 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-md shadow-emerald-500/20"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Jump to slide ${idx + 1}: ${evt.title}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
