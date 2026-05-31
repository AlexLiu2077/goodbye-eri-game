import React, { useEffect, useState } from 'react';
import { useGame, CHEAT_MODE } from '../GameContext';
import TunnelOfLight from './TunnelOfLight';

// Direct imports for external media
import video1 from '../assets/video/1.mp4';
import video2 from '../assets/video/2.mp4';
import video31 from '../assets/video/3.1.mp4';
import video32 from '../assets/video/3.2.mp4';
import video41 from '../assets/video/4.1.mp4';
import video42 from '../assets/video/4.2.mp4';
import video5 from '../assets/video/5.mp4';

import img01 from '../assets/frame_by_frame/firstmeet/01.png';
import img02 from '../assets/frame_by_frame/firstmeet/02.png';
import img03 from '../assets/frame_by_frame/firstmeet/03.png';
import img04 from '../assets/frame_by_frame/firstmeet/04.png';

import s01 from '../assets/frame_by_frame/seaside/01.png';
import s02 from '../assets/frame_by_frame/seaside/02.png';
import s03 from '../assets/frame_by_frame/seaside/03.png';
import s04 from '../assets/frame_by_frame/seaside/04.png';
import s05 from '../assets/frame_by_frame/seaside/05.png';
import s06 from '../assets/frame_by_frame/seaside/06.png';
import s07 from '../assets/frame_by_frame/seaside/07.png';

import goodbye1 from '../assets/frame_by_frame/goodbye/01.png';
import goodbye2 from '../assets/frame_by_frame/goodbye/02.png';
import goodbye3 from '../assets/frame_by_frame/goodbye/03.png';
import goodbye4 from '../assets/frame_by_frame/goodbye/04.png';
import goodbye5 from '../assets/frame_by_frame/goodbye/05.png';
import goodbye6 from '../assets/frame_by_frame/goodbye/06.png';
import goodbye7 from '../assets/frame_by_frame/goodbye/07.png';
import goodbye8 from '../assets/frame_by_frame/goodbye/08.png';

const firstMeetImages = [img01, img02, img03, img04];
const seasidePhotos = [s01, s02, s03, s04, s05, s06, s07];
const goodbyePhotos = [goodbye1, goodbye2, goodbye3, goodbye4, goodbye5, goodbye6, goodbye7, goodbye8];

const FullScreenCutscene = () => {
  const { appData, updateAppData, addMaterial, showNotification, advanceChapter, triggerEnding } = useGame();
  const [phase, setPhase] = useState(0);
  const [videoError, setVideoError] = useState(false);
  
  // States for ruins_movie state machine
  const [ruinsPhase, setRuinsPhase] = useState('video1'); // 'video1', 'images', 'video2', 'next_day'
  const [weekendPhase, setWeekendPhase] = useState('typing'); // 'typing', 'video32', 'video31', 'video42', 'video41', 'photos', 'typing2', 'typing3'
  const [ruins20yrPhase, setRuins20yrPhase] = useState('video5'); // 'video5', 'images'
  const [imageIdx, setImageIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const transitionTo = (nextPhase, type) => {
    setIsFading(true);
    setTimeout(() => {
      if (type === 'ruins') setRuinsPhase(nextPhase);
      else if (type === 'ruins20yr') setRuins20yrPhase(nextPhase);
      else setWeekendPhase(nextPhase);
      
      if (nextPhase === 'photos' || nextPhase === 'images') setImageIdx(0);
      
      setIsFading(false);
    }, 1000);
  };

  const cutsceneType = appData?.activeCutscene;

  useEffect(() => {
    setVideoError(false);
    if (!cutsceneType) {
      setPhase(0);
      setRuinsPhase('video1');
      setWeekendPhase('typing');
      setRuins20yrPhase('video5');
      setImageIdx(0);
      return;
    }

    if (cutsceneType === 'weekend_post_chat') {
      setPhase(1);
      setWeekendPhase('typing3');
      return;
    }

    if (cutsceneType) {
      setPhase(1);
    }
  }, [cutsceneType]);

  const [typedText, setTypedText] = useState('');

  // Handle the image slideshow in ruins_movie
  useEffect(() => {
    if (cutsceneType === 'ruins_movie' && ruinsPhase === 'images' && !isFading) {
      if (imageIdx >= firstMeetImages.length) {
        transitionTo('video2', 'ruins');
        return;
      }
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setImageIdx(prev => prev + 1);
          setIsFading(false);
        }, 1000);
      }, 4000); // 4 seconds visible + 1s fade
      return () => clearTimeout(timer);
    }
  }, [cutsceneType, ruinsPhase, imageIdx, isFading]);

  // Handle the seaside photos slideshow in weekend_shoot
  useEffect(() => {
    if (cutsceneType === 'weekend_shoot' && weekendPhase === 'photos' && !isFading) {
      if (imageIdx >= seasidePhotos.length) {
        transitionTo('typing2', 'weekend');
        return;
      }
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setImageIdx(prev => prev + 1);
          setIsFading(false);
        }, 1000);
      }, 6000); // 6 seconds visible + 1s fade
      return () => clearTimeout(timer);
    }
  }, [cutsceneType, weekendPhase, imageIdx, isFading]);

  // Handle the goodbye photos slideshow in ruins_20yr
  useEffect(() => {
    if (cutsceneType === 'ruins_20yr' && ruins20yrPhase === 'images' && !isFading) {
      if (imageIdx >= goodbyePhotos.length) {
        handleRuins20yrEnd();
        return;
      }
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setImageIdx(prev => prev + 1);
          setIsFading(false);
        }, 1000);
      }, 3000); // 3 seconds visible + 1s fade
      return () => clearTimeout(timer);
    }
  }, [cutsceneType, ruins20yrPhase, imageIdx, isFading]);

  // Handle the typewriter effect for weekend_shoot
  useEffect(() => {
    if (cutsceneType === 'weekend_shoot' && weekendPhase === 'typing') {
      const fullText = '绘梨很喜欢吃快餐，我们先去麦当劳吃了饭，然后去海边，镜头外的她很不讲究甚至有些蛮横，镜头里的她则把自己包装成一个斯文清纯的吸血鬼，我把这些全部拍了下来，她很不高兴，叫我最好删掉那些本应是镜头外的素材。';
      let currentLength = 0;
      setTypedText('');
      
      const interval = setInterval(() => {
        currentLength++;
        setTypedText(fullText.slice(0, currentLength));
        if (currentLength >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            transitionTo('video32', 'weekend');
          }, 4000);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
    
    if (cutsceneType === 'weekend_shoot' && weekendPhase === 'typing2') {
      const fullText = '那时我才知道，原来绘梨早就得了一种绝症。';
      let currentLength = 0;
      setTypedText('');
      
      const interval = setInterval(() => {
        currentLength++;
        setTypedText(fullText.slice(0, currentLength));
        if (currentLength >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            // End the cutscene and trigger eriChat3
            updateAppData({ activeCutscene: null, executeChat: 'eriChat3' });
          }, 4000);
        }
      }, 150);
      
      return () => clearInterval(interval);
    }

    if (cutsceneType === 'weekend_post_chat' && weekendPhase === 'typing3') {
      const fullText = '我该记录真实的她，还是最美丽的她？';
      let currentLength = 0;
      setTypedText('');
      
      const interval = setInterval(() => {
        currentLength++;
        setTypedText(fullText.slice(0, currentLength));
        if (currentLength >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            handleWeekendEnd();
          }, 4000);
        }
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [cutsceneType, weekendPhase, updateAppData]);

  // Handle ending transitions
  useEffect(() => {
    if (cutsceneType === 'ending_1_transition') {
      const timer = setTimeout(() => {
        updateAppData({ activeCutscene: null });
        triggerEnding(1);
      }, 3500);
      return () => clearTimeout(timer);
    }
    
    if (cutsceneType === 'funeral_transition') {
      const fullText = '一个月后，绘梨在睡梦中离开了人世。在她的葬礼上播放了我为她剪辑的影片，大家观看后无一不为之动容，我怀着悲痛复杂的心情送完了她最后一程。';
      let currentLength = 0;
      setTypedText('');
      
      const interval = setInterval(() => {
        currentLength++;
        setTypedText(fullText.slice(0, currentLength));
        if (currentLength >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            updateAppData({ activeCutscene: 'tunnel_of_light' });
          }, 4000);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [cutsceneType, triggerEnding, updateAppData]);

  const handleWeekendShootSkip = () => {
    updateAppData({ activeCutscene: null, executeChat: 'eriChat3' });
  };

  const handleWeekendEnd = () => {
    addMaterial('material_3.1', '素材3.1-麦当劳.mp4', 'video');
    addMaterial('material_3.2', '素材3.2-生牛排.mp4', 'video');
    addMaterial('material_4.1', '素材4.1-海滨风浪.mp4', 'video');
    addMaterial('material_4.2', '素材4.2-海滨晴空.mp4', 'video');
    updateAppData({ activeCutscene: null, editorType: 'midgame' });
    showNotification('系统提示：周末拍摄顺利结束。新素材已同步，请打开桌面的 Adobe 进行剪辑。');
  };

  const handleRuinsVideoEnd = () => {
    transitionTo('next_day', 'ruins');
    setTimeout(() => {
      handleRuinsEnd();
    }, 4000);
  };

  const handleRuinsEnd = () => {
    addMaterial('material_1', '素材1-初见绘梨.mp4', 'video');
    addMaterial('material_2', '素材2-通宵观影.mp4', 'video');
    updateAppData({ activeCutscene: null, executeChat: 'eriChat2' });
  };

  const handleRuins20yrEnd = () => {
    updateAppData({ activeCutscene: null, executeChat: 'eriChat4' });
  };

  if (!cutsceneType) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'black',
      zIndex: 99999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      opacity: phase === 1 ? 1 : 0,
      transition: 'opacity 1s ease-in-out'
    }}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1s ease-in-out'
      }}>
        {cutsceneType === 'ruins_movie' ? (
          <>
            {ruinsPhase === 'video1' && !videoError && (
              <>
                <video 
                  src={video1} 
                  autoPlay 
                  onEnded={() => transitionTo('images', 'ruins')}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                <div style={{
                  position: 'absolute', bottom: '15%', left: 0, width: '100%', 
                  textAlign: 'center', fontSize: '28px', color: 'white', 
                  textShadow: '2px 2px 4px #000', letterSpacing: '4px'
                }}>
                  这是我第一次见到绘梨。
                </div>
              </>
            )}

            {ruinsPhase === 'images' && imageIdx < firstMeetImages.length && (
              <img 
                src={firstMeetImages[imageIdx]} 
                alt="first meet sequence" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }} 
              />
            )}

            {ruinsPhase === 'video2' && !videoError && (
              <>
                <video 
                  src={video2} 
                  autoPlay 
                  onEnded={() => {
                    transitionTo('next_day', 'ruins');
                    setTimeout(() => {
                      handleRuinsEnd();
                    }, 4000); // 1s fade in + 2s show + 1s fade out
                  }}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                {CHEAT_MODE && (
                  <button className="premium-btn skip-btn" onClick={handleRuinsVideoEnd}>
                    点击手动跳过并获取素材
                  </button>
                )}
                <div style={{
                  position: 'absolute', bottom: '15%', left: 0, width: '100%', 
                  textAlign: 'center', fontSize: '28px', color: 'white', 
                  textShadow: '2px 2px 4px #000', letterSpacing: '4px'
                }}>
                  于是我和绘梨看了一晚上的电影。
                </div>
              </>
            )}

            {ruinsPhase === 'next_day' && (
              <div style={{ fontSize: '32px', letterSpacing: '4px', textAlign: 'center', color: 'white' }}>
                第二天。
              </div>
            )}

            {videoError && (
              <div style={{ fontSize: '24px', letterSpacing: '2px', padding: '0 20px', textAlign: 'center', lineHeight: '1.5', color: '#ff6b6b' }}>
                ⚠️ 系统错误：无法加载外部素材<br/>
                <span style={{fontSize: '16px', opacity: 0.8}}>(请确保所需文件存在)</span><br/><br/>
                {CHEAT_MODE && (
                  <button className="skip-btn top-right" onClick={handleRuinsEnd}>
                    跳过
                  </button>
                )}
                <button 
                  onClick={handleRuinsEnd}
                  style={{
                    padding: '10px 24px', background: 'transparent', 
                    color: 'white', border: '1px solid white', borderRadius: '4px',
                    cursor: 'pointer', zIndex: 10, fontSize: '18px'
                  }}
                >
                  点击手动跳过并获取素材
                </button>
              </div>
            )}

            {!videoError && CHEAT_MODE && (
              <button 
                onClick={handleRuinsEnd}
                style={{
                  position: 'absolute', top: '20px', right: '20px', 
                  padding: '8px 16px', background: 'rgba(255,255,255,0.2)', 
                  color: 'white', border: '1px solid white', borderRadius: '4px',
                  cursor: 'pointer', zIndex: 10
                }}
              >
                跳过
              </button>
            )}
          </>
        ) : null}
        {cutsceneType === 'weekend_shoot' || cutsceneType === 'weekend_post_chat' ? (
          <>
            {weekendPhase === 'typing' && (
              <div className="premium-glow-text" style={{
                width: '70%',
                fontSize: '32px',
                lineHeight: '2.0',
                letterSpacing: '3px',
                textAlign: 'left'
              }}>
                {typedText}<span style={{animation: 'blink 1s step-end infinite'}}>_</span>
              </div>
            )}

            {weekendPhase === 'video32' && !videoError && (
              <>
                <video 
                  src={video32} 
                  autoPlay 
                  onEnded={() => transitionTo('video31', 'weekend')}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                <div style={{
                  position: 'absolute', bottom: '15%', left: 0, width: '100%', 
                  textAlign: 'center', fontSize: '28px', color: 'white', 
                  textShadow: '2px 2px 4px #000', letterSpacing: '4px'
                }}>
                  这是她吃生牛排的样子
                </div>
              </>
            )}

            {weekendPhase === 'video31' && !videoError && (
              <>
                <video 
                  src={video31} 
                  autoPlay 
                  onEnded={() => transitionTo('video42', 'weekend')}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                <div style={{
                  position: 'absolute', bottom: '15%', left: 0, width: '100%', 
                  textAlign: 'center', fontSize: '28px', color: 'white', 
                  textShadow: '2px 2px 4px #000', letterSpacing: '4px'
                }}>
                  其实她那天吃的是麦当劳
                </div>
              </>
            )}

            {weekendPhase === 'video42' && !videoError && (
              <>
                <video 
                  src={video42} 
                  autoPlay 
                  onEnded={() => transitionTo('video41', 'weekend')}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                <div style={{
                  position: 'absolute', bottom: '15%', left: 0, width: '100%', 
                  textAlign: 'center', fontSize: '28px', color: 'white', 
                  textShadow: '2px 2px 4px #000', letterSpacing: '4px'
                }}>
                  她在海边高兴的样子熠熠生辉
                </div>
              </>
            )}

            {weekendPhase === 'video41' && !videoError && (
              <>
                <video 
                  src={video41} 
                  autoPlay 
                  onEnded={() => transitionTo('photos', 'weekend')}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                <div style={{
                  position: 'absolute', bottom: '15%', left: 0, width: '100%', 
                  textAlign: 'center', fontSize: '28px', color: 'white', 
                  textShadow: '2px 2px 4px #000', letterSpacing: '4px'
                }}>
                  后来刮起大风她被浪花冲刷的很狼狈
                </div>
              </>
            )}

            {weekendPhase === 'photos' && imageIdx < seasidePhotos.length && (
              <img 
                src={seasidePhotos[imageIdx]} 
                alt="seaside sequence" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(0.95)' }} 
              />
            )}

            {weekendPhase === 'typing2' && (
              <div className="premium-glow-text" style={{
                width: '70%',
                fontSize: '32px',
                lineHeight: '2.0',
                letterSpacing: '3px',
                textAlign: 'center'
              }}>
                {typedText}<span style={{animation: 'blink 1s step-end infinite'}}>_</span>
              </div>
            )}

            {weekendPhase === 'typing3' && (
              <div className="premium-glow-text" style={{
                width: '70%',
                fontSize: '32px',
                lineHeight: '2.0',
                letterSpacing: '3px',
                textAlign: 'center'
              }}>
                {typedText}<span style={{animation: 'blink 1s step-end infinite'}}>_</span>
              </div>
            )}

            {videoError && !weekendPhase.startsWith('typing') && weekendPhase !== 'photos' && (
              <div style={{ fontSize: '24px', letterSpacing: '2px', padding: '0 20px', textAlign: 'center', lineHeight: '1.5', color: '#ff6b6b' }}>
                ⚠️ 系统错误：无法加载外部素材<br/>
                <span style={{fontSize: '16px', opacity: 0.8}}>(请确保所需文件存在)</span><br/><br/>
                {CHEAT_MODE && (
                  <button 
                    onClick={cutsceneType === 'weekend_shoot' ? handleWeekendShootSkip : handleWeekendEnd}
                    style={{
                      padding: '10px 24px', background: 'transparent', 
                      color: 'white', border: '1px solid white', borderRadius: '4px',
                      cursor: 'pointer', zIndex: 10, fontSize: '18px'
                    }}
                  >
                    点击手动跳过并获取素材
                  </button>
                )}
              </div>
            )}

            {!videoError && !weekendPhase.startsWith('typing') && weekendPhase !== 'photos' && CHEAT_MODE && (
              <button 
                onClick={cutsceneType === 'weekend_shoot' ? handleWeekendShootSkip : handleWeekendEnd}
                style={{
                  position: 'absolute', top: '20px', right: '20px', 
                  padding: '8px 16px', background: 'rgba(255,255,255,0.2)', 
                  color: 'white', border: '1px solid white', borderRadius: '4px',
                  cursor: 'pointer', zIndex: 10
                }}
              >
                跳过
              </button>
            )}
          </>
        ) : null}

        {cutsceneType === 'ruins_20yr' ? (
          <>
            {ruins20yrPhase === 'video5' && !videoError && (
              <>
                <video 
                  src={video5} 
                  autoPlay 
                  onEnded={() => {
                    setRuins20yrPhase('images');
                    setImageIdx(0);
                    setIsFading(false);
                  }}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                />
                {CHEAT_MODE && (
                  <button 
                    onClick={handleRuins20yrEnd}
                    style={{
                      position: 'absolute', top: '20px', right: '20px', 
                      padding: '8px 16px', background: 'rgba(255,255,255,0.2)', 
                      color: 'white', border: '1px solid white', borderRadius: '4px',
                      cursor: 'pointer', zIndex: 10
                    }}
                  >
                    跳过
                  </button>
                )}
              </>
            )}
            
            {ruins20yrPhase === 'images' && imageIdx < goodbyePhotos.length && (
              <img 
                src={goodbyePhotos[imageIdx]} 
                alt="Goodbye Memory" 
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              />
            )}

            {videoError && (
              <div style={{ fontSize: '24px', letterSpacing: '2px', padding: '0 20px', textAlign: 'center', lineHeight: '1.5', color: '#ff6b6b' }}>
                ⚠️ 系统错误：无法加载外部素材<br/>
                <span style={{fontSize: '16px', opacity: 0.8}}>(请确保所需文件存在)</span><br/><br/>
                {CHEAT_MODE && (
                  <button 
                    onClick={handleRuins20yrEnd}
                    style={{
                      padding: '10px 24px', background: 'transparent', 
                      color: 'white', border: '1px solid white', borderRadius: '4px',
                      cursor: 'pointer', zIndex: 10, fontSize: '18px'
                    }}
                  >
                    点击手动跳过并获取素材
                  </button>
                )}
              </div>
            )}
          </>
        ) : null}

        {cutsceneType === 'ending_1_transition' ? (
          <div style={{ color: 'white', fontSize: '24px', letterSpacing: '4px', animation: 'fadeInOutText 3s forwards' }}>
            这就结束了吗...
          </div>
        ) : null}

        {cutsceneType === 'funeral_transition' ? (
          <div className="premium-glow-text" style={{
            width: '80%',
            fontSize: '32px',
            lineHeight: '2.0',
            letterSpacing: '3px',
            textAlign: 'left',
            color: 'white'
          }}>
            {typedText}<span style={{animation: 'blink 1s step-end infinite'}}>_</span>
          </div>
        ) : null}

        {cutsceneType === 'tunnel_of_light' ? (
          <TunnelOfLight onComplete={() => {
             updateAppData({ activeCutscene: null, executeChat: 'eriReturn' });
             advanceChapter();
          }} />
        ) : null}
      </div>
    </div>
  );
};

export default FullScreenCutscene;
