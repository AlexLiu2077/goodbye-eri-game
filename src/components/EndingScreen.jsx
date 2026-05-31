import React from 'react';
import { useGame } from '../GameContext';
import './EndingScreen.css';

const endings = {
  1: {
    title: '达成结局：真实的你',
    desc: '我残忍的拒绝了绘梨的请求，把她的一切毫无保留的记录了下来。\n或许素材里的她不是美丽的，但一定是真实动人的。\n或许我做的不一定是对的，但这个结局一定是最接近真相的。',
    image: '/ending0.png'
  },
  2: {
    title: '达成结局：梦醒时刻',
    desc: '我放弃了一切滤镜，我什么也不相信。有些时候我会后悔当初为什么没能保留她真实的一面，现在我想做出补偿。',
    image: '/ending1.png'
  },
  3: {
    title: '达成结局：最美的你',
    desc: '我是一个双标的人，我只相信我愿意相信的谎言，她一定不是吸血鬼，她的完美形象定格在二十年前，因为我最喜欢那时她站在海边微笑的样子。',
    image: '/ending2.png'
  },
  4: {
    title: '达成结局：你的另一面',
    desc: '为什么当初那个偏执狂女生会变成吸血鬼？我不知道，但电影语言的留白告诉我，一切皆有可能。',
    image: '/ending3.png'
  },
  5: {
    title: '达成结局：真实的你？',
    desc: '我分不清什么是真的，什么是假的，既然如此我不如相信她就是一个吸血鬼，就当我祝福她永远年轻永远不死',
    image: '/ending4.png'
  }
};

const EndingScreen = () => {
  const { ending, triggerEnding } = useGame();
  const currentEnding = endings[ending] || { title: '未知结局', desc: '发生了错误。' };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    triggerEnding(null);
  };

  return (
    <div className="ending-container">
      <h1 className="ending-title">{currentEnding.title}</h1>

      {currentEnding.image && (
        <img
          src={currentEnding.image}
          alt="Ending Visual"
          className="ending-image"
        />
      )}

      <p className="ending-desc">{currentEnding.desc}</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {ending !== 1 && (
          <button className="restart-btn" onClick={handleGoBack} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)' }}>
            回退到剪辑台
          </button>
        )}
        <button className="restart-btn" onClick={handleRestart}>
          重新开始游戏
        </button>
      </div>
    </div>
  );
};

export default EndingScreen;
