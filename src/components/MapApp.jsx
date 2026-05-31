import React, { useState, useRef } from 'react';
import { useGame } from '../GameContext';
import './MapApp.css';

const MapApp = () => {
  const { appData, updateAppData, closeWindow, showNotification } = useGame();
  
  const pending = appData.pendingLocationAction;

  const isRuinsActive = pending === 'go_to_ruins' || pending === 'go_to_ruins_20yr';
  const isBeachActive = pending === 'go_to_shoot';

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleLocationClick = (locationName, actionType) => {
    if (actionType) {
      if (actionType === 'go_to_shoot' && !appData.friendChatCompleted) {
        showNotification('系统提示：你有未通过的好友申请或未完成的重要对话。');
        return;
      }
      
      // Execute the pending action
      updateAppData({ 
        executeLocationAction: actionType, 
        pendingLocationAction: null 
      });
      closeWindow('maps');
    } else {
      showNotification(`系统提示：暂无前往【${locationName}】的理由。`);
    }
  };

  return (
    <div 
      className="map-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="map-draggable-area"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`, 
          cursor: isDragging ? 'grabbing' : 'grab' 
        }}
        onMouseDown={handleMouseDown}
      >
        <img src="./map.png" alt="City Map" className="map-image" draggable={false} />
        
        {/* 废墟影院 (Right Side) */}
        <div 
          className={`map-marker right ${isRuinsActive ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleLocationClick('废墟影院', isRuinsActive ? pending : null);
          }}
        >
          <div className="marker-pin">📍</div>
          <div className="marker-label">废墟影院</div>
        </div>

        {/* 海边 (Left Side) */}
        <div 
          className={`map-marker left ${isBeachActive ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleLocationClick('海边', isBeachActive ? pending : null);
          }}
        >
          <div className="marker-pin">📍</div>
          <div className="marker-label">海边</div>
        </div>
      </div>
    </div>
  );
};

export default MapApp;
