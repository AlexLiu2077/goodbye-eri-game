import React, { useState, useEffect, useRef } from 'react';
import { useGame, CHEAT_MODE } from '../GameContext';
import { storyData } from '../data/storySequence';
import './ChatInterface.css';

const meAvatar = '/avatar_me.png';
const eriAvatar = '/avatar_eri.png';
const friendAvatar = '/avatar_eri_friend.png';
const groupAvatar = '/group_avatar.png';

const ChatInterface = () => {
  const { chapter, addMaterial, updateAppData, showNotification, appData } = useGame();
  const data = storyData[chapter];

  const [currentTab, setCurrentTab] = useState('chat'); // 'chat' or 'contacts'
  const [pendingRequests, setPendingRequests] = useState([]);

  const [chatData, setChatData] = useState({
    group: { id: 'group', name: '观影群聊(85)', avatar: groupAvatar, messages: [], visible: chapter === 1 },
    eri: { id: 'eri', name: '绘梨', avatar: eriAvatar, messages: [], visible: chapter >= 2 },
    friend: { id: 'friend', name: '绘梨的好友', avatar: friendAvatar, messages: [], visible: chapter >= 3 }
  });

  const [activeChatId, setActiveChatId] = useState(chapter === 1 ? 'group' : 'eri');
  const [currentSequence, setCurrentSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAction, setActiveAction] = useState(null);
  const [targetChatId, setTargetChatId] = useState(null);
  const [pendingMeMessage, setPendingMeMessage] = useState(null);

  const chatEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Initialize chapter sequence
  useEffect(() => {
    if (!data) return;
    setActiveAction(null);
    if (chapter === 1) {
      setCurrentSequence(data.initialChat);
      setTargetChatId('group');
      setCurrentIndex(0);
    } else if (chapter === 2) {
      setCurrentSequence(data.eriChat);
      setTargetChatId('eri');
      setCurrentIndex(0);
    } else if (chapter === 3) {
      setCurrentSequence(data.eriReturn);
      setTargetChatId('eri');
      setCurrentIndex(0);
    }
  }, [chapter, data]);

  // Handle message playback
  useEffect(() => {
    if (!currentSequence || currentIndex >= currentSequence.length) return;

    const msg = currentSequence[currentIndex];
    
    // If it's a friend request, don't show it in chat
    if (msg.action && msg.action.startsWith('accept_friend')) {
      const timer = setTimeout(() => {
        setActiveAction(msg.action);
        setPendingRequests(prev => [...prev, {
          id: msg.action,
          name: msg.action === 'accept_friend_eri' ? '绘梨' : '绘梨的好友',
          avatar: msg.action === 'accept_friend_eri' ? eriAvatar : friendAvatar,
          msg: '请求添加你为好友'
        }]);
      }, msg.delay || 1000);
      return () => clearTimeout(timer);
    }

    if (msg.sender === 'me') {
      const timer = setTimeout(() => {
        setPendingMeMessage(msg);
      }, msg.delay || 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setChatData(prev => ({
        ...prev,
        [targetChatId]: {
          ...prev[targetChatId],
          messages: [...prev[targetChatId].messages, msg]
        }
      }));

      if (activeChatId !== targetChatId) {
        setActiveChatId(targetChatId);
      }

      if (msg.action) {
        if (msg.action === 'finish_friend_chat') {
          updateAppData({ friendChatCompleted: true });
          setCurrentIndex(prev => prev + 1);
        } else if (msg.action.startsWith('trigger_')) {
          // Auto-execute trigger actions without showing a button
          executeActionDirectly(msg.action);
          // Advance index just in case there's more, but usually triggers end the sequence or change it
          setCurrentIndex(prev => prev + 1);
        } else {
          setActiveAction(msg.action);
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, msg.delay || 1000);

    return () => clearTimeout(timer);
  }, [currentSequence, currentIndex, targetChatId, activeChatId, updateAppData]);

  useEffect(() => {
    if (currentTab === 'chat' && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatData, activeChatId, currentTab]);

  // Handle actions triggered from the App Data (like after cutscenes)
  useEffect(() => {
    if (appData.executeChat) {
      const chatSeqId = appData.executeChat;
      updateAppData({ executeChat: null });
      
      let nextSeq = null;
      let nextTarget = 'eri';
      let notifyMsg = '微信收到了新消息';

      if (chatSeqId === 'eriChat2') {
        nextSeq = data.eriChat2;
      } else if (chatSeqId === 'eriChat3') {
        nextSeq = data.eriChat3;
      } else if (chatSeqId === 'truthRouteEri') {
        nextSeq = data.truthRouteEri;
      } else if (chatSeqId === 'perfectRouteEri') {
        nextSeq = data.perfectRouteEri;
      } else if (chatSeqId === 'truthRouteFriend') {
        nextSeq = data.truthRouteFriend;
        nextTarget = 'friend';
      } else if (chatSeqId === 'perfectRouteFriend') {
        nextSeq = data.perfectRouteFriend;
        nextTarget = 'friend';
      } else if (chatSeqId === 'eriReturn') {
        nextSeq = data.eriReturn;
        nextTarget = 'eri';
      } else if (chatSeqId === 'eriChat4') {
        nextSeq = data.eriChat4;
        nextTarget = 'eri';
      }

      if (nextSeq) {
        setCurrentSequence(nextSeq);
        setTargetChatId(nextTarget);
        setActiveChatId(nextTarget);
        setCurrentIndex(0);
        setActiveAction(null);
        setCurrentTab('chat');
        showNotification(notifyMsg);
      }
    }
  }, [appData.executeChat, data, updateAppData, showNotification]);

  // Handle actions triggered from the Map App
  useEffect(() => {
    if (appData.executeLocationAction) {
      const action = appData.executeLocationAction;
      updateAppData({ executeLocationAction: null });
      
      if (action === 'go_to_ruins') {
        updateAppData({ activeCutscene: 'ruins_movie' });
      } else if (action === 'go_to_shoot') {
        updateAppData({ activeCutscene: 'weekend_shoot' });
        setTargetChatId('eri');
        setCurrentSequence(data.friendChat);
        setCurrentIndex(0);
      } else if (action === 'go_to_ruins_20yr') {
        updateAppData({ activeCutscene: 'ruins_20yr' });
      }
    }
  }, [appData.executeLocationAction, data, updateAppData, showNotification]);

  const executeActionDirectly = (actionId) => {
    switch(actionId) {
      case 'go_to_ruins':
      case 'go_to_shoot':
        updateAppData({ pendingLocationAction: actionId });
        setActiveAction(null);
        showNotification('系统提示：地图上已出现新的可探索地点，请前往桌面【地图】软件查看。');
        
        if (actionId === 'go_to_shoot') {
          setTimeout(() => {
            setPendingRequests(prev => {
              if (!prev.find(r => r.id === 'accept_friend_friend')) {
                return [...prev, {
                  id: 'accept_friend_friend',
                  name: '绘梨的好友',
                  avatar: friendAvatar,
                  msg: '请求添加你为好友'
                }];
              }
              return prev;
            });
          }, 1500);
        }
        break;
      case 'go_to_ruins_20yr':
        updateAppData({ pendingLocationAction: actionId });
        setActiveAction(null);
        showNotification('系统提示：地图上已出现新的可探索地点，请前往桌面【地图】软件查看。');
        break;
      case 'trigger_cutscene_typing3':
        updateAppData({ activeCutscene: 'weekend_post_chat' });
        setActiveAction(null);
        break;
      case 'go_to_editor_tutorial':
        updateAppData({ editorType: 'tutorial' });
        setActiveAction(null);
        showNotification('系统提示：准备完毕，请打开桌面的 Adobe 进行剪辑。');
        break;
      case 'go_to_editor_mid':
        updateAppData({ editorType: 'midgame' });
        setActiveAction(null);
        showNotification('系统提示：准备完毕，请打开桌面的 Adobe 进行剪辑。');
        break;
      case 'trigger_truth_friend':
        setActiveAction(null);
        setTimeout(() => {
          updateAppData({ executeChat: 'truthRouteFriend' });
        }, 3000);
        break;
      case 'trigger_perfect_friend':
        setActiveAction(null);
        setTimeout(() => {
          updateAppData({ executeChat: 'perfectRouteFriend' });
        }, 3000);
        break;
      case 'trigger_ending_1':
        updateAppData({ activeCutscene: 'ending_1_transition' });
        setActiveAction(null);
        break;
      case 'trigger_tunnel_of_light':
        updateAppData({ activeCutscene: 'funeral_transition' });
        setActiveAction(null);
        break;
      case 'go_to_endgame_editor':
        addMaterial('material_5', '素材5-再见绘梨.mp4', 'video');
        updateAppData({ editorType: 'endgame' });
        setActiveAction(null);
        showNotification('系统提示：最终素材已就绪，请打开桌面的 Adobe 进行最后剪辑。');
        break;
      default:
        break;
    }
  };

  const handleAction = () => {
    if (activeAction?.startsWith('accept_friend')) return;
    executeActionDirectly(activeAction);
  };

  const handleAcceptFriend = (reqId) => {
    setPendingRequests(prev => prev.filter(req => req.id !== reqId));
    setActiveAction(null);
    setCurrentTab('chat');

    if (reqId === 'accept_friend_eri') {
      setChatData(prev => ({ ...prev, eri: { ...prev.eri, visible: true } }));
      setTargetChatId('eri');
      setActiveChatId('eri');
      setCurrentSequence(data.eriChat1);
      setCurrentIndex(0);
    } else if (reqId === 'accept_friend_friend') {
      setChatData(prev => ({ ...prev, friend: { ...prev.friend, visible: true } }));
      setTargetChatId('friend');
      setActiveChatId('friend');
      setCurrentSequence(data.friendDialog);
      setCurrentIndex(0);
    }
  };

  const handleSendMe = () => {
    if (!pendingMeMessage) return;
    
    setChatData(prev => ({
      ...prev,
      [targetChatId]: {
        ...prev[targetChatId],
        messages: [...prev[targetChatId].messages, pendingMeMessage]
      }
    }));
    
    const actionToExec = pendingMeMessage.action;
    setPendingMeMessage(null);
    
    if (actionToExec) {
      if (actionToExec.startsWith('trigger_')) {
        executeActionDirectly(actionToExec);
        setCurrentIndex(prev => prev + 1);
      } else {
        setActiveAction(actionToExec);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSkipChat = () => {
    if (!currentSequence || currentIndex >= currentSequence.length) return;
    
    const remaining = currentSequence.slice(currentIndex);
    let finalAction = null;
    const newMessages = [];
    let newPendingMe = null;
    
    remaining.forEach((msg, index) => {
      if (msg.action && msg.action.startsWith('accept_friend')) {
        setPendingRequests(prev => {
          if (!prev.find(r => r.id === msg.action)) {
            return [...prev, {
              id: msg.action,
              name: msg.action === 'accept_friend_eri' ? '绘梨' : '绘梨的好友',
              avatar: msg.action === 'accept_friend_eri' ? eriAvatar : friendAvatar,
              msg: '请求添加你为好友'
            }];
          }
          return prev;
        });
      } else {
        if (msg.sender === 'me' && index === remaining.length - 1) {
          newPendingMe = msg;
        } else {
          if (!msg.action || msg.action !== 'finish_friend_chat') {
            newMessages.push(msg);
          }
        }
      }
      
      if (msg.action && !msg.action.startsWith('accept_friend')) {
        if (msg.action === 'finish_friend_chat') {
          updateAppData({ friendChatCompleted: true });
        } else {
          if (newPendingMe !== msg) {
            finalAction = msg.action;
          }
        }
      }
    });

    setChatData(prev => {
      if (!targetChatId) return prev;
      return {
        ...prev,
        [targetChatId]: {
          ...prev[targetChatId],
          messages: [...prev[targetChatId].messages, ...newMessages]
        }
      }
    });

    if (newPendingMe) {
      setCurrentIndex(currentSequence.length - 1);
      setPendingMeMessage(newPendingMe);
      setActiveAction(null);
    } else {
      setCurrentIndex(currentSequence.length);
      if (finalAction) {
        if (finalAction.startsWith('trigger_')) {
          executeActionDirectly(finalAction);
        } else {
          setActiveAction(finalAction);
        }
      }
      setPendingMeMessage(null);
    }
  };

  const getActionLabel = () => {
    if (activeAction === 'go_to_ruins') return '前往废墟赴约';
    if (activeAction === 'go_to_shoot') return '周末外出拍摄';
    if (activeAction === 'go_to_editor_tutorial') return '打开剪辑台';
    if (activeAction === 'go_to_editor_mid') return '前往剪辑台';
    if (activeAction === 'go_to_ruins_20yr') return '推开废墟大门';
    if (activeAction === 'trigger_cutscene_typing3') return '沉思...';
    return '发送(S)';
  };

  const isChatAction = activeAction && !activeAction.startsWith('accept_friend') && targetChatId === activeChatId;

  const activeChat = chatData[activeChatId];
  const activeMessages = activeChat.messages;

  const getAvatar = (sender, fallbackAvatar) => {
    if (sender === 'me') return meAvatar;
    if (sender === 'other1') return '/avatar_npc1.png';
    if (sender === 'other2') return '/avatar_npc2.png';
    if (sender === 'other3') return '/avatar_npc3.png';
    return fallbackAvatar;
  };

  return (
    <div className="wechat-container">
      {/* Sidebar */}
      <div className="wechat-sidebar">
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
          <img src={meAvatar} alt="Me" className="sidebar-avatar" />
          <div className="sidebar-icons">
            <div 
              className={`sidebar-icon-wrapper ${currentTab === 'chat' ? 'active' : ''}`}
              onClick={() => setCurrentTab('chat')}
            >
              💬
            </div>
            <div 
              className={`sidebar-icon-wrapper ${currentTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setCurrentTab('contacts')}
            >
              👥
              {pendingRequests.length > 0 && <div className="red-dot"></div>}
            </div>
            <div className="sidebar-icon-wrapper">⭐</div>
            <div className="sidebar-icon-wrapper">📁</div>
          </div>
        </div>
        <div className="sidebar-icons">
          <div className="sidebar-icon-wrapper">⚙️</div>
        </div>
      </div>

      {currentTab === 'chat' ? (
        <>
          {/* Chat List Panel */}
          <div className="wechat-list-panel">
            <div className="wechat-search">
              <div className="search-box">
                <span>🔍</span>
                <input type="text" placeholder="搜索" readOnly />
              </div>
              <button style={{background:'#dcdcdc', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer'}}>+</button>
            </div>
            
            <div style={{flex: 1, overflowY: 'auto'}}>
              {Object.values(chatData).filter(c => c.visible).map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <img src={chat.avatar} className="chat-item-avatar" alt="avatar" />
                  <div className="chat-item-info">
                    <div className="chat-item-header">
                      <div className="chat-item-name">{chat.name}</div>
                      <div className="chat-item-time">{chat.messages.length > 0 ? '刚刚' : ''}</div>
                    </div>
                    <div className="chat-item-preview">
                      {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Window */}
          <div className="wechat-main" style={{position: 'relative'}}>
            {CHEAT_MODE && (
              <button className="skip-chat-btn" onClick={handleSkipChat}>
                <span style={{fontSize: '20px'}}>⏩</span> 一键跳过对话
              </button>
            )}

            <div className="chat-header">
              <span>{activeChat.name}</span>
              <span style={{cursor:'pointer'}}>···</span>
            </div>

            <div className="chat-messages" ref={chatMessagesRef}>
              {activeMessages.map((msg, i) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={i} className="message-row system">
                      <div className="message-system">{msg.text}</div>
                    </div>
                  );
                }
                const isMe = msg.sender === 'me';
                return (
                  <div key={i} className={`message-row ${isMe ? 'me' : 'other'}`}>
                    {!isMe && <img src={getAvatar(msg.sender, activeChat.avatar)} className="message-avatar" alt="avatar" />}
                    {isMe && msg.status === 'failed' && (
                      <div className="message-failed-icon">!</div>
                    )}
                    <div className="message-bubble" style={msg.image ? {padding: '4px'} : {}}>
                      {msg.image ? (
                        <img src={msg.image} alt="chat attachment" style={{maxWidth: '100%', borderRadius: '4px', display: 'block'}} />
                      ) : (
                        msg.text
                      )}
                    </div>
                    {isMe && <img src={meAvatar} className="message-avatar" alt="avatar" />}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="wechat-input-area">
              <div className="input-toolbar">
                <span style={{cursor:'pointer'}}>😊</span>
                <span style={{cursor:'pointer'}}>📁</span>
                <span style={{cursor:'pointer'}}>✂️</span>
                <span style={{cursor:'pointer'}}>💬</span>
              </div>
              <textarea 
                className="input-text" 
                readOnly 
                value={pendingMeMessage ? pendingMeMessage.text : ""}
                placeholder={isChatAction ? "请点击发送执行对应操作..." : ""}
              />
              <div className="input-action">
                {pendingMeMessage ? (
                  <button className="input-action-btn" onClick={handleSendMe} style={{animation: 'pulse-glow 2s infinite'}}>
                    发送(S)
                  </button>
                ) : isChatAction ? (
                  <button className="input-action-btn" onClick={handleAction} style={{animation: 'pulse-glow 2s infinite'}}>
                    {getActionLabel()}
                  </button>
                ) : (
                  <button className="input-action-btn" style={{opacity: 0.5, cursor: 'not-allowed'}}>
                    发送(S)
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Contacts Panel */
        <div style={{display: 'flex', width: '100%'}}>
          <div className="wechat-list-panel">
            <div className="wechat-search">
              <div className="search-box">
                <span>🔍</span>
                <input type="text" placeholder="搜索" readOnly />
              </div>
            </div>
            <div className="chat-item active" style={{backgroundColor: '#cdd7db'}}>
              <div className="chat-item-avatar" style={{backgroundColor: '#ff9500'}}>
                👥
              </div>
              <div className="chat-item-info" style={{display:'flex', alignItems:'center'}}>
                <div className="chat-item-name">新的朋友</div>
              </div>
            </div>
          </div>

          <div className="wechat-main">
            <div className="chat-header">
              <span>新的朋友</span>
            </div>
            <div className="contacts-list">
              {pendingRequests.length === 0 ? (
                <div style={{textAlign: 'center', color: '#999', marginTop: '40px'}}>
                  暂无新的好友请求
                </div>
              ) : (
                pendingRequests.map(req => (
                  <div className="friend-request-card" key={req.id}>
                    <div className="friend-request-info">
                      <img src={req.avatar} style={{width: '50px', height: '50px', borderRadius: '4px'}} alt="avatar"/>
                      <div>
                        <div className="friend-request-name">{req.name}</div>
                        <div className="friend-request-msg">{req.msg}</div>
                      </div>
                    </div>
                    <button className="accept-btn" onClick={() => handleAcceptFriend(req.id)}>
                      接受
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
