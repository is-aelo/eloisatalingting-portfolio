"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuZoomIn, LuZoomOut, LuX } from "react-icons/lu";

type ZoomViewerProps = {
  src: string;
  alt: string;
  onClose: () => void;
  isVideo?: boolean;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.5;

export function ZoomViewer({ src, alt, onClose, isVideo }: ZoomViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [noTransition, setNoTransition] = useState(false);

  const scaleRef = useRef(1);
  const posRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posAtDragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef(0);
  const scaleAtPinchStart = useRef(1);
  const isPinching = useRef(false);

  function updateScale(next: number) {
    const clamped = Math.max(MIN_SCALE, Math.min(next, MAX_SCALE));
    scaleRef.current = clamped;
    setScale(clamped);
    if (clamped <= MIN_SCALE) {
      posRef.current = { x: 0, y: 0 };
      setPosition({ x: 0, y: 0 });
    }
  }

  function updatePos(pos: { x: number; y: number }) {
    posRef.current = pos;
    setPosition(pos);
  }

  const zoomIn = () => {
    updateScale(scaleRef.current + ZOOM_STEP);
  };

  const zoomOut = () => {
    updateScale(scaleRef.current - ZOOM_STEP);
  };

  const zoomTo = (newScale: number, cx?: number, cy?: number) => {
    const clamped = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
    if (clamped <= MIN_SCALE) {
      updateScale(MIN_SCALE);
      return;
    }

    if (cx !== undefined && cy !== undefined && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const originX = cx - rect.left;
      const originY = cy - rect.top;
      const s = scaleRef.current;
      const p = posRef.current;
      const scaleFactor = clamped / s;
      updatePos({
        x: originX - scaleFactor * (originX - p.x),
        y: originY - scaleFactor * (originY - p.y),
      });
    }

    scaleRef.current = clamped;
    setScale(clamped);
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP / 2 : ZOOM_STEP / 2;
    zoomTo(scaleRef.current + delta, e.clientX, e.clientY);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scaleRef.current <= MIN_SCALE) return;
    e.preventDefault();
    dragging.current = true;
    setNoTransition(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posAtDragStart.current = { ...posRef.current };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    updatePos({
      x: posAtDragStart.current.x + e.clientX - dragStart.current.x,
      y: posAtDragStart.current.y + e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
    setNoTransition(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      setNoTransition(true);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
      scaleAtPinchStart.current = scaleRef.current;
    } else if (e.touches.length === 1 && scaleRef.current > MIN_SCALE) {
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      posAtDragStart.current = { ...posRef.current };
      dragging.current = true;
      setNoTransition(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist.current > 0) {
        const newScale = Math.max(MIN_SCALE, Math.min(scaleAtPinchStart.current * (dist / lastPinchDist.current), MAX_SCALE));
        updateScale(newScale);
      }
    } else if (e.touches.length === 1 && dragging.current) {
      updatePos({
        x: posAtDragStart.current.x + e.touches[0].clientX - dragStart.current.x,
        y: posAtDragStart.current.y + e.touches[0].clientY - dragStart.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    isPinching.current = false;
    setNoTransition(false);
    lastPinchDist.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 touch-none select-none"
      onClick={onClose}
    >
      <div
        className="fixed top-4 right-4 z-[110] flex items-center gap-2 rounded-xl bg-black/60 px-3 py-2 sm:top-6 sm:right-6 sm:gap-3 sm:px-4 sm:py-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:h-9 sm:w-9"
          aria-label="Zoom out"
        >
          <LuZoomOut size={18} />
        </button>
        <span className="min-w-[44px] text-center font-body text-xs text-white/80 tabular-nums sm:text-sm">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:h-9 sm:w-9"
          aria-label="Zoom in"
        >
          <LuZoomIn size={18} />
        </button>
        <span className="h-5 w-px bg-white/20" />
        <button
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
          aria-label="Close viewer"
        >
          <LuX size={18} />
        </button>
      </div>

      <div
        ref={contentRef}
        className="flex max-h-full max-w-full items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: noTransition ? "none" : "transform 0.2s ease-out",
          cursor: scale > MIN_SCALE ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={src}
            controls
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
            draggable={false}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}
