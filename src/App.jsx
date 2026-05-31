import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './GameContext';
import Window from './components/Window';
import Diary from './components/Diary';
import ChatInterface from './components/ChatInterface';
import VideoEditor from './components/VideoEditor';
import Cutscene from './components/Cutscene';
import EndingScreen from './components/EndingScreen';
import FullScreenCutscene from './components/FullScreenCutscene';
import MapApp from './components/MapApp';
import './App.css';

const Desktop = () => {
  const { windows, openWindow, closeWindow, focusWindow, toggleMinimize, chapter, ending, appData, notification } = useGame();
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (ending !== null) {
    return <EndingScreen />;
  }

  // Icons logic
  const isWechatUnlocked = appData.wechatUnlocked;
  const isEditorUnlocked = true; // Always unlocked now

  return (
    <div className="os-desktop">
      <div className="desktop-icons-area">
        <div 
          className="desktop-icon unlocked" 
          onClick={() => openWindow('diary')}
        >
          <img src="https://img.icons8.com/fluency/96/notepad.png" alt="日记本" />
          <span>日记本.txt</span>
        </div>

        <div 
          className={`desktop-icon ${isWechatUnlocked ? 'unlocked' : 'locked'}`} 
          onClick={() => {
            if (isWechatUnlocked) openWindow('wechat');
          }}
        >
          <img src="https://img.icons8.com/color/96/weixing.png" alt="微信" />
          <span>微信</span>
        </div>

        <div 
          className={`desktop-icon ${isEditorUnlocked ? 'unlocked' : 'locked'}`} 
          onClick={() => {
            if (isEditorUnlocked) openWindow('editor');
          }}
        >
          <img src="./adobe_icon.png" alt="Adobe" />
          <span>Adobe</span>
        </div>

        <div 
          className="desktop-icon unlocked" 
          onClick={() => openWindow('maps')}
        >
          <img src="./map_icon.png" alt="地图" />
          <span>地图</span>
        </div>
      </div>

      {/* Windows */}
      <Window id="diary" width={550} height={500}>
        <Diary />
      </Window>

      <Window id="wechat" width={800} height={550} preventClose={true}>
        <ChatInterface />
      </Window>

      <Window id="editor" width={900} height={600}>
        <VideoEditor />
      </Window>

      <Window id="maps" width={800} height={600}>
        <MapApp />
      </Window>

      {/* Taskbar */}
      <div className="os-taskbar">
        <div className="taskbar-left">
          <div className="start-btn">
            <svg viewBox="0 0 23 23">
              <path d="M0 0h11v11H0z" fill="#f25022"/>
              <path d="M12 0h11v11H12z" fill="#7fba00"/>
              <path d="M0 12h11v11H0z" fill="#00a4ef"/>
              <path d="M12 12h11v11H12z" fill="#ffb900"/>
            </svg>
          </div>
          <div className="taskbar-apps">
            {Object.values(windows).map(win => {
              if (!win.open) return null;
              return (
                <div 
                  key={win.id} 
                  className={`taskbar-app ${win.minimized ? '' : 'active'}`}
                  onClick={() => {
                    if (win.minimized) openWindow(win.id);
                    else openWindow(win.id); // Or focus Window
                  }}
                >
                  <span style={{marginRight: '6px'}}>{win.icon}</span>
                  {win.title}
                </div>
              );
            })}
          </div>
        </div>
        <div className="taskbar-right">
          <div>{time}</div>
          <div style={{fontSize: '10px', opacity: 0.8}}>2026/05/30</div>
        </div>
      </div>
      
      {/* Full Screen Narrative Overlays */}
      <FullScreenCutscene />

      {/* Modern OS Notification */}
      {notification && (
        <div className="os-notification">
          {notification}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <Desktop />
    </GameProvider>
  );
}

export default App;
