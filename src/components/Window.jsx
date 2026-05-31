import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../GameContext';
import './Window.css';

const Window = ({ id, width = 600, height = 500, preventClose = false, children, style = {} }) => {
  const { windows, closeWindow, focusWindow, toggleMinimize } = useGame();
  const winState = windows[id];
  
  const [position, setPosition] = useState({ 
    x: window.innerWidth / 2 - width / 2 + Math.random() * 40 - 20, 
    y: window.innerHeight / 2 - height / 2 + Math.random() * 40 - 20 
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!winState.open) return null;

  const handlePointerDown = (e) => {
    focusWindow(id);
    if (e.target.closest('.window-header-controls')) return;
    
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: Math.max(0, e.clientY - dragStart.current.y) // prevent dragging above screen
      });
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div 
      className="os-window"
      style={{
        display: winState.minimized ? 'none' : 'flex',
        width,
        height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: winState.zIndex,
        ...style
      }}
      onPointerDown={() => focusWindow(id)}
    >
      <div 
        className="window-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="window-title">
          <span style={{marginRight: '8px'}}>{winState.icon}</span>
          {winState.title}
        </div>
        <div className="window-header-controls">
          <button className="control-btn" onClick={() => toggleMinimize(id)}>—</button>
          <button className="control-btn">□</button>
          <button className="control-btn close" onClick={() => {
            if (preventClose) toggleMinimize(id);
            else closeWindow(id);
          }}>✕</button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
