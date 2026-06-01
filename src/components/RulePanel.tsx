import React from 'react';
import { SubjectLegend } from './SubjectLegend';

interface RulePanelProps {
  onAccept: () => void;
}

export const RulePanel: React.FC<RulePanelProps> = ({ onAccept }) => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <h2 className="text-glow-cyan" style={{ margin: 0, fontSize: '2rem' }}>系统规则校准</h2>
        <button className="cyber-btn" onClick={onAccept} style={{ padding: '8px 24px', fontSize: '1rem' }}>
          我已了解，开始手势校准
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
        
        {/* 左侧：规则说明 */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
          
          <section style={{ marginBottom: '2rem' }}>
            <h3 className="text-glow-cyan" style={{ borderLeft: '4px solid var(--primary-cyan)', paddingLeft: '0.5rem' }}>一、基础玩法</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>屏幕上方会随机掉落不同学科的代表物件。</li>
              <li>玩家通过双手食指指尖划过物件进行选中。</li>
              <li>每次切中的学科，等于手指尖划过的所有物件对应学科。</li>
              <li>左手和右手都可以同时选中物件。</li>
              <li>每次切中后，屏幕会显示切中的学科名和得分变化。</li>
              <li style={{ color: '#FFB86C' }}>[调试模式]：在无摄像头情况下，可按住鼠标左键拖动模拟划动。</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 className="text-glow-cyan" style={{ borderLeft: '4px solid var(--primary-cyan)', paddingLeft: '0.5rem' }}>二、计分规则</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>普通学科：+1 分。</li>
              <li>
                <span className="text-glow-like">喜爱学科：</span>
                <ul style={{ marginTop: '0.5rem' }}>
                  <li>如果当前已有厌恶次数，则 +2 分，并抵消 1 次厌恶次数。</li>
                  <li>如果当前没有厌恶次数，则 +3 分。</li>
                </ul>
              </li>
              <li>
                <span className="text-glow-hate">厌恶学科：</span>
                <ul style={{ marginTop: '0.5rem' }}>
                  <li>默认 -3 分，厌恶次数 +1。</li>
                  <li>如果连续选中同一门厌恶学科，则 -8 分，并视为选中 3 次厌恶学科。</li>
                </ul>
              </li>
              <li style={{ color: '#FFB86C', fontWeight: 'bold', marginTop: '0.5rem' }}>一局内厌恶次数达到 5 次，游戏结束。</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 className="text-glow-cyan" style={{ borderLeft: '4px solid var(--primary-cyan)', paddingLeft: '0.5rem' }}>三、每关随机规则</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>每关随机抽取 2 门喜爱学科。</li>
              <li>每关随机抽取 2 门厌恶学科。</li>
              <li>喜爱学科使用<span className="text-glow-like">青绿色高亮</span>。</li>
              <li>厌恶学科使用<span className="text-glow-hate">红色危险高亮</span>。</li>
            </ul>
          </section>
        </div>

        {/* 右侧：学科物件提示表 */}
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
          <h3 className="text-glow-cyan" style={{ margin: '0 0 1rem 0', borderLeft: '4px solid var(--primary-cyan)', paddingLeft: '0.5rem' }}>学科物件数据库</h3>
          <SubjectLegend />
        </div>

      </div>
    </div>
  );
};