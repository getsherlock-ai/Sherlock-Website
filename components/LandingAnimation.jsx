"use client";

import { useEffect, useRef } from "react";
import { mountMagnifyingEye } from "./animation/magnifying-eye";

export default function LandingAnimation({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = mountMagnifyingEye(containerRef.current);
    return () => animation.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
    />
  );
}
