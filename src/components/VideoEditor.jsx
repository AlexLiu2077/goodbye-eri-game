import React, { useState } from 'react';
import { useGame } from '../GameContext';
import './VideoEditor.css';

// Pre-import known materials to satisfy static bundling
import video1 from '../assets/video/1.mp4';
import video2 from '../assets/video/2.mp4';
import video31 from '../assets/video/3.1.mp4';
import video32 from '../assets/video/3.2.mp4';
import video41 from '../assets/video/4.1.mp4';
import video42 from '../assets/video/4.2.mp4';
import video5 from '../assets/video/1.mp4'; // Placeholder for material_5 if needed

const videoSources = {
  'material_1': video1,
  'material_2': video2,
  'material_3.1': video31,
  'material_3.2': video32,
  'material_4.1': video41,
  'material_4.2': video42,
  'material_5': video5 // Placeholder
};

const VideoEditor = () => {
  const { 
    appData, inventory, closeWindow, advanceChapter, 
    setDecisions, decisions, triggerEnding,
    timeline, setTimeline, showNotification, updateAppData
  } = useGame();
  
  const [errorMsg, setErrorMsg] = useState('');

  const type = appData?.editorType || 'tutorial';

  const handleAddClip = (material) => {
    if (timeline.find(m => m.id === material.id)) return;
    setTimeline([...timeline, material]);
    setErrorMsg('');
  };

  const handleRemoveClip = (id) => {
    setTimeline(timeline.filter(m => m.id !== id));
    setErrorMsg('');
  };

  const handleExport = () => {
    if (type === 'tutorial') {
      const hasM1 = timeline.find(m => m.id === 'material_1');
      const hasM2 = timeline.find(m => m.id === 'material_2');
      
      if (!hasM1 || !hasM2 || timeline.length < 2) {
        setErrorMsg('视频不完整：需要同时包含素材1(初见)和素材2(通宵观影)。');
        return;
      }
      
      if (timeline[0].id !== 'material_1' || timeline[1].id !== 'material_2') {
        setErrorMsg('顺序错乱：叙事节奏不对，请按照时间顺序排列。');
        return;
      }
      
      // Success: Both materials included in correct order
      advanceChapter();
      closeWindow('editor');
      showNotification('导出成功！微信收到了新消息。');
    } else if (type === 'midgame') {
      const hasM1 = timeline.find(m => m.id === 'material_1');
      const hasM2 = timeline.find(m => m.id === 'material_2');
      const hasM31 = timeline.find(m => m.id === 'material_3.1');
      const hasM32 = timeline.find(m => m.id === 'material_3.2');
      const hasM41 = timeline.find(m => m.id === 'material_4.1');
      const hasM42 = timeline.find(m => m.id === 'material_4.2');

      if (!hasM1 || !hasM2) {
        setErrorMsg('视频不完整：前期素材不能丢弃，必须包含素材1和素材2(通宵观影)。');
        return;
      }

      const hasM3 = hasM31 || hasM32;
      const hasM4 = hasM41 || hasM42;
      
      if (!hasM3 || !hasM4) {
        setErrorMsg('视频不完整：请加入餐厅和海边的核心素材。');
        return;
      }

      if ((hasM31 || hasM41) && (hasM32 || hasM42)) {
        setErrorMsg('内容矛盾：真实与虚构不能混剪！必须选择一种纯粹的立场。');
        return;
      }
      
      // Order validation
      const getGroup = (id) => {
        if (id === 'material_1') return 1;
        if (id === 'material_2') return 2;
        if (id.startsWith('material_3')) return 3;
        if (id.startsWith('material_4')) return 4;
        return 0;
      };
      
      const actualGroups = timeline.map(m => getGroup(m.id));
      const expectedGroups = [1, 2, 3, 4];
      const isCorrectOrder = actualGroups.length === 4 && actualGroups.every((val, index) => val === expectedGroups[index]);
      
      if (!isCorrectOrder) {
        setErrorMsg('顺序错乱：电影的叙事节奏不对，请按照时间顺序进行排列。');
        return;
      }

      if (hasM31 && hasM41) {
        // Truth route -> trigger truthRouteEri
        setDecisions('truth');
        updateAppData({ executeChat: 'truthRouteEri' });
        closeWindow('editor');
        showNotification('导出成功！视频已发送给绘梨。');
      } else if (hasM32 && hasM42) {
        // Perfect route -> trigger perfectRouteEri
        setDecisions('perfect');
        updateAppData({ executeChat: 'perfectRouteEri' });
        closeWindow('editor');
        showNotification('导出成功！视频已发送给绘梨。');
      } else {
        setErrorMsg('必须包含所有阶段的素材(餐厅+海边)。');
      }
    } else if (type === 'endgame') {
      const ids = timeline.map(m => m.id);
      
      const getGroup = (id) => {
        if (id === 'material_1') return 1;
        if (id === 'material_2') return 2;
        if (id.startsWith('material_3')) return 3;
        if (id.startsWith('material_4')) return 4;
        if (id === 'material_5') return 5;
        return 0;
      };
      
      const actualGroups = ids.map(id => getGroup(id));
      const expectedGroups = ids.length === 5 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
      const isCorrectOrder = actualGroups.length >= 4 && actualGroups.every((val, index) => val === expectedGroups[index]);
      
      if (ids.length < 4 || actualGroups[0] !== 1 || actualGroups[1] !== 2) {
        setErrorMsg('电影结构不完整：缺少前置的核心叙事架构。');
        return;
      }
      
      if (!isCorrectOrder) {
        setErrorMsg('顺序错乱：电影的叙事节奏不对，请按照时间顺序进行排列。');
        return;
      }
      
      const hasM31 = ids.includes('material_3.1');
      const hasM32 = ids.includes('material_3.2');
      const hasM41 = ids.includes('material_4.1');
      const hasM42 = ids.includes('material_4.2');
      const hasM5 = ids.includes('material_5');

      if ((hasM31 || hasM41) && (hasM32 || hasM42)) {
        setErrorMsg('内容矛盾：真实与虚构不能混剪！必须选择一种纯粹的立场。');
        return;
      }

      if (hasM31 && hasM41) {
        if (!hasM5) triggerEnding(2); // 结局 2：梦醒时刻
        else triggerEnding(4); // 结局 4：你的另一面
      } else if (hasM32 && hasM42) {
        if (!hasM5) triggerEnding(3); // 结局 3：最美的你
        else triggerEnding(5); // 结局 5：真实的你？
      } else {
        setErrorMsg('请加入完整的餐厅和海边素材。');
      }
    }
  };

  // Filter inventory based on stage
  const availableInventory = inventory.filter(m => {
    if (type === 'tutorial') return ['material_1', 'material_2'].includes(m.id);
    if (type === 'midgame') return true; // During midgame, all unlocked materials (1,2,3,4) are shown
    if (type === 'endgame') return true; // Show all materials in endgame
    return false;
  });

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>视频剪辑台 {type === 'endgame' && '- 最终剪辑'}</h2>
        <button className="export-btn" onClick={handleExport}>
          导出成片
        </button>
      </div>

      <div className="editor-workspace">
        <div className="inventory-panel">
          <div className="inventory-title">素材库</div>
          {availableInventory.map((m) => {
            const isSelected = timeline.find(t => t.id === m.id);
            return (
              <div 
                key={m.id} 
                className={`material-card ${isSelected ? 'selected' : ''}`}
                onClick={() => !isSelected && handleAddClip(m)}
              >
                🎥 {m.filename}
              </div>
            );
          })}
        </div>
        
        <div className="preview-panel">
          <div className="preview-screen" style={{position: 'relative', overflow: 'hidden'}}>
            {timeline.length > 0 ? (
              videoSources[timeline[timeline.length - 1].id] ? (
                <video 
                  src={videoSources[timeline[timeline.length - 1].id]} 
                  autoPlay loop 
                  style={{width: '100%', height: '100%', objectFit: 'contain'}} 
                />
              ) : (
                <h2>{timeline[timeline.length - 1].filename}</h2>
              )
            ) : (
              <h2>等待预览</h2>
            )}
            {errorMsg && <div className="error-message">{errorMsg}</div>}
          </div>

          <div className="timeline-panel">
            <div className="inventory-title">时间线</div>
            <div className="timeline-tracks">
              {timeline.map((clip, idx) => (
                <div key={idx} className="timeline-slot filled">
                  <div className="timeline-clip">
                    <span>{clip.filename.split('-')[1].replace('.mp4','')}</span>
                    <button className="remove-clip" onClick={() => handleRemoveClip(clip.id)}>×</button>
                  </div>
                </div>
              ))}
              <div className="timeline-slot">拖拽或点击添加</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
