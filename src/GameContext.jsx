import React, { createContext, useContext, useState } from 'react';

// Cheat Mode Flag
export const CHEAT_MODE = true; // Set to true to show skip buttons and unlock editor faster

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // Game State
  const [chapter, setChapter] = useState(1); // 1 = Chapter 1, starts immediately
  const [inventory, setInventory] = useState([]);
  const [timeline, setTimeline] = useState([]); // Editor timeline preserved across scenes
  const [decisions, setDecisions] = useState(null); // 'truth' or 'perfect'
  const [ending, setEnding] = useState(null);
  
  // OS Window State
  const [windows, setWindows] = useState({
    diary: { id: 'diary', title: '日记本.txt', icon: '📝', open: false, zIndex: 10, minimized: false },
    wechat: { id: 'wechat', title: '微信', icon: '💬', open: false, zIndex: 1, minimized: false },
    editor: { id: 'editor', title: 'Adobe', icon: '🎬', open: false, zIndex: 2, minimized: false },
    maps: { id: 'maps', title: '地图', icon: '🗺️', open: false, zIndex: 3, minimized: false }
  });
  
  const [maxZIndex, setMaxZIndex] = useState(10);
  
  // Specific data to pass to specific apps
  const [appData, setAppData] = useState({
    wechatUnlocked: false,
    editorType: 'tutorial', // 'tutorial', 'midgame', 'endgame'
    activeCutscene: null,
    pendingLocationAction: null // Tracks active location event
  });

  const [notification, setNotification] = useState(null);
  
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const openWindow = (id) => {
    setMaxZIndex(prev => prev + 1);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], open: true, minimized: false, zIndex: maxZIndex + 1 }
    }));
  };

  const closeWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], open: false }
    }));

    // Unlock WeChat when Diary is closed for the first time
    if (id === 'diary' && !appData.wechatUnlocked) {
      setAppData(prev => ({ ...prev, wechatUnlocked: true }));
      setTimeout(() => showNotification('系统提示：微信收到了新消息！'), 500);
    }
  };

  const focusWindow = (id) => {
    setMaxZIndex(prev => prev + 1);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: maxZIndex + 1, minimized: false }
    }));
  };

  const toggleMinimize = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], minimized: !prev[id].minimized }
    }));
  };

  const addMaterial = (materialId, filename, type = 'video') => {
    setInventory(prev => {
      if (prev.find(m => m.id === materialId)) return prev;
      return [...prev, { id: materialId, filename, type }];
    });
  };

  const advanceChapter = () => {
    setChapter(prev => prev + 1);
  };

  const triggerEnding = (endingNumber) => {
    setEnding(endingNumber);
  };

  const updateAppData = (updates) => {
    setAppData(prev => ({ ...prev, ...updates }));
  };

  const value = {
    chapter,
    inventory,
    timeline,
    decisions,
    ending,
    windows,
    appData,
    notification,
    showNotification,
    setTimeline,
    setDecisions,
    addMaterial,
    advanceChapter,
    triggerEnding,
    setChapter,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMinimize,
    updateAppData
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
