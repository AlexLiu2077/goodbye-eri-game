import React, { useEffect } from 'react';
import { useGame } from '../GameContext';

const Cutscene = () => {
  const { changeScene } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      changeScene('chat');
    }, 4000);
    return () => clearTimeout(timer);
  }, [changeScene]);

  return (
    <div style={{
      width: '100%', height: '100vh', backgroundColor: '#000', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      color: 'white', fontSize: '2rem', letterSpacing: '5px'
    }}>
      <div className="animate-fade-in">20年后...</div>
    </div>
  );
};

export default Cutscene;
