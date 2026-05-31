import React from 'react';
import { useGame } from '../GameContext';
import './Diary.css';

const Diary = () => {
  const { chapter, advanceChapter, closeWindow } = useGame();
  return (
    <div className="diary-content" contentEditable suppressContentEditableWarning>
      <div className="diary-date">202X年 4月14日 晴</div>
      <div className="diary-p">今天是我十四岁的生日。</div>
      <div className="diary-p">我原本以为又是个平平无奇的日子，但爸妈送了我的一个大礼物——一部智能手机。</div>
      <div className="diary-p">拿到它的时候我还没来得及高兴，妈妈就把我叫到了床边。她的脸色很难看，医生说她可能撑不了多久了。她看着我，眼睛里有一种让我有点害怕的狂热。她对我说：“优太，用这部手机录下我接下来的日子吧。直到我死去为止。”</div>
      <div className="diary-p">那一刻，我手心全是汗。爸爸在旁边哭，但我只是机械地举起手机，隔着屏幕看着妈妈。屏幕里的她显得更瘦了。</div>
      <div className="diary-p">我不知道自己能不能做好，但既然是妈妈最后的愿望，我只能拍下去。我的电影，好像就这样被迫开机了。</div>

      <div className="diary-date">202X年 7月22日 阴</div>
      <div className="diary-p">我已经拍了三个多月了。我的生活完全被这部手机统治了。</div>
      <div className="diary-p">不管是吃饭、吃药、妈妈因为痛苦而抓紧床单的瞬间，还是她偶尔精神好一点、坐在轮椅上晒太阳的侧影，我都录了下来。</div>
      <div className="diary-p">有时候我觉得自己像个冷血的怪物。妈妈在受苦，而我却在调整焦距，在想哪个角度的采光更好。爸爸好几次看着我，欲言又止，眼神里满是绝望和不解。</div>
      <div className="diary-p">但我不敢放下手机，因为一旦放下，我就必须去直面“妈妈马上就要死了”这个现实。躲在镜头后面，至少能让我觉得这一切只是一场戏，我只是个负责记录的导演。</div>
      <div className="diary-p">妈妈的身体一天不如一天了，她清醒的时间越来越少，但只要镜头对准她，她就会努力挤出完美的笑容。她想在录像里留下最美的样子。我只能拼命地拍。</div>

      <div className="diary-date">202X年 10月5日 雨</div>
      <div className="diary-p">妈妈走了。</div>
      <div className="diary-p">就在今天，医院下了病危通知。我拿着手机一秒都不敢关，一路小跑穿过医院冰冷的走廊。病房里全是仪器滴滴答答的声音，爸爸跪在床边泣不成声。</div>
      <div className="diary-p">可是，当手触碰到病房大门的那一刻，我突然停住了。</div>
      <div className="diary-p">我看着屏幕里濒死的妈妈，身上插满了管子，枯槁、痛苦、毫无尊严。那一瞬间，强烈的抗拒感击中了我。我真的要把她人生最后、最难看的这一幕拍下来，永远留在这部手机里吗？这是她真正想要的“最美的样子”吗？</div>
      <div className="diary-p">我做不到。我转过身，疯狂地逃离了医院。</div>
      <div className="diary-p">在跑出医院大楼的那一刻，身后传来了爸爸的哭喊声。我知道结束了。</div>
      <div className="diary-p">我站在大雨里，按下了录制结束键，然后在文件的结尾，加上了一个我脑海中挥之不去的画面——</div>
      <div className="diary-p no-indent" style={{fontWeight: 'bold', color: '#d9534f', textAlign: 'center'}}>轰。</div>
      <div className="diary-p">我亲手在剧本里把整座医院炸成了碎片。</div>

      <div className="diary-date">202X年 文化祭当天 阴转多云</div>
      <div className="diary-p">今天成了全校的笑柄。</div>
      <div className="diary-p">在全校师生面前，我满怀期待地放映了这部耗时大半年、倾注了我所有痛苦和心血的纪录片《死去的母亲》。我以为大家能明白我的悲伤，或者至少能感受到一点点震撼。</div>
      <div className="diary-p">可当电影最后一幕——医院在我身后轰然爆炸的特效亮起，片尾字幕滚动时，礼堂里死一般的寂静。</div>
      <div className="diary-p">接着，是排山倒海的嘲笑和辱骂：</div>
      <div className="diary-p" style={{fontStyle: 'italic', color: '#555'}}>“这算什么啊？人渣吧！”</div>
      <div className="diary-p" style={{fontStyle: 'italic', color: '#555'}}>“把自己母亲的死当成玩笑吗？”</div>
      <div className="diary-p" style={{fontStyle: 'italic', color: '#555'}}>“最后那个爆炸太恶心了，对死者也太不尊重了！”</div>
      <div className="diary-p">那些声音像针一样扎在我的背上。台下的同学们用看怪物一样的眼神看着我。</div>
      <div className="diary-p">他们不懂，他们根本不懂！他们只看到了对死亡的不敬，却根本没有看到我有多痛苦！我只是不想用那么绝望的方式去记住妈妈啊！</div>
      <div className="diary-p">爸爸也显得很难堪。我忍着眼泪跑出了礼堂，躲在教学楼最顶层的天台上。</div>
      <div className="diary-p">风很大，我看着脚下的地面，觉得这个世界糟糕透了。我的电影是一场灾难，我的坚持是一场笑话。</div>
      <div className="diary-p">我拿出了手机，翻看着那些被我剪掉的、妈妈生前痛苦咒骂的画面。也许，我真的不该来到这个世界上，更不该拍什么电影。</div>
      
      <div style={{textAlign: 'center', marginTop: '30px'}}>
        {chapter === 0 ? (
          <button 
            className="start-game-btn"
            onClick={() => {
              advanceChapter();
              closeWindow('diary');
              alert('剧情前置结束。微信收到新消息！');
            }}
          >
            关闭日记，回到桌面
          </button>
        ) : (
          <span style={{fontSize: '12px', color: '#888'}}>-- 完 --</span>
        )}
      </div>
    </div>
  );
};

export default Diary;
