"use client";

import React, { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  color?: string;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Adjust coordinates if menu overflows window boundary
  const adjustedX = Math.min(x, typeof window !== "undefined" ? window.innerWidth - 220 : x);
  const adjustedY = Math.min(y, typeof window !== "undefined" ? window.innerHeight - 300 : y);

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-[9999] w-56 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl p-1.5 text-slate-200 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="space-y-0.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={idx}>
              <button
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/80 ${
                  item.color || "text-slate-200 hover:text-white"
                }`}
              >
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
              {item.divider && <div className="my-1 border-t border-slate-800" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
