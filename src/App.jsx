import React, { useMemo, useState } from 'react';

const MODE_META = {
  light: {
    title: '轻接触型',
    subtitle: '低压力、可进可退',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  chat: {
    title: '聊天了解型',
    subtitle: '适合交流和观察',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  warm: {
    title: '升温互动型',
    subtitle: '更容易推进关系温度',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  easy: {
    title: '轻松陪伴型',
    subtitle: '自然见面，不求仪式感',
    bg: '#fffbeb',
    border: '#fde68a',
  },
};

const MODE_ACTIVITIES = {
  light: ['咖啡', '甜品', '散步'],
  chat: ['咖啡', '简餐', '安静正餐'],
  warm: ['火锅烤肉', '小酒馆', '散步'],
  easy: ['散步', '电影', '简餐'],
};

const TIME_EXCLUDE = {
  中午: ['小酒馆'],
  下午: ['小酒馆'],
  晚餐: ['咖啡', '甜品'],
  夜宵: ['咖啡', '安静正餐', '简餐'],
};

const ACTIVITY_DESC = {
  咖啡: '轻量、可快速结束，适合白天短见面。',
  甜品: '比正餐更轻，适合不想把局做太重时。',
  简餐: '介于随意和正式之间，适合正常聊天。',
  安静正餐: '更完整、更体面，适合认真交流。',
  火锅烤肉: '热闹、有互动，但气味重、节奏偏乱。',
  散步: '低压力、可边走边聊，也方便撤退。',
  小酒馆: '夜间氛围强，适合熟一点或想升温时。',
  电影: '陪伴感强，但交流空间少。',
};

function uniq(arr) {
  return [...new Set(arr)];
}

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              borderRadius: 16,
              border: value === opt ? '1px solid #111111' : '1px solid #d1d5db',
              padding: '10px 16px',
              fontSize: 14,
              background: value === opt ? '#111111' : '#ffffff',
              color: value === opt ? '#ffffff' : '#374151',
              cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DateFoodDeciderDemo() {
  const [stage, setStage] = useState('第一次见面');
  const [time, setTime] = useState('下午');
  const [goal, setGoal] = useState('不尴尬');
  const [result, setResult] = useState(null);

  const summary = useMemo(() => [stage, time, goal].join(' / '), [stage, time, goal]);

  function pickMode() {
    if (time === '夜宵' && goal === '多聊天') return 'light';
    if ((time === '中午' || time === '下午') && goal === '升温') return 'chat';
    if (stage === '第一次见面' && goal === '升温') return 'chat';

    if (stage === '第一次见面') {
      if (goal === '多聊天') return 'chat';
      return 'light';
    }

    if (stage === '前几次见面') {
      if (goal === '多聊天') return 'chat';
      if (goal === '升温') return 'warm';
      if (goal === '放松陪伴') return 'easy';
      return 'light';
    }

    if (stage === '已经比较熟') {
      if (goal === '多聊天') return 'chat';
      if (goal === '升温') return 'warm';
      return 'easy';
    }

    return 'chat';
  }

  function getSafetyFiltered(modeActivities) {
    let blocked = [];
    let warning = '';

    if (stage === '第一次见面') {
      blocked = ['小酒馆', '电影'];
      warning = '第一次见面别把局做太重，优先低压力、方便撤退的形式。';
      if (goal !== '升温') blocked.push('火锅烤肉');
    }

    const left = modeActivities.filter((x) => !blocked.includes(x));
    return { left, blocked, warning };
  }

  function buildResult() {
    let downgraded = false;
    let mode = pickMode();

    const safety = getSafetyFiltered(MODE_ACTIVITIES[mode]);
    let poolAfterSafety = safety.left;
    const timeExclude = TIME_EXCLUDE[time] || [];

    if ((time === '中午' || time === '下午') && mode === 'warm' && stage !== '第一次见面') {
      poolAfterSafety = uniq(poolAfterSafety.filter((x) => x !== '火锅烤肉').concat('简餐'));
    }

    let matched = poolAfterSafety.filter((x) => !timeExclude.includes(x));

    if (time === '晚餐' && mode === 'light' && matched.length < 2) {
      matched = uniq(['简餐', '散步']);
      downgraded = true;
    }

    if (time === '夜宵' && mode === 'chat') {
      matched = ['散步'];
      mode = 'light';
      downgraded = true;
    }

    if ((time === '中午' || time === '下午') && mode === 'warm' && matched.length < 2) {
      matched = uniq(['散步', '简餐']);
      downgraded = true;
    }

    if (matched.length < 2) {
      if (time === '夜宵') {
        matched = uniq(matched.concat(['散步']).filter((x) => !timeExclude.includes(x)));
      }
      if (time === '晚餐' || time === '中午' || time === '下午') {
        matched = uniq(matched.concat(['简餐', '散步']).filter((x) => !timeExclude.includes(x)));
      }
      if (matched.length >= 2) downgraded = true;
    }

    const recommend = matched.slice(0, 3);
    const planB = matched[3] || matched[1] || '';

    const avoidBase = uniq([...timeExclude, ...safety.blocked]);
    const avoid = avoidBase.filter((x) => !recommend.includes(x) && x !== planB).slice(0, 2);

    let crashWarning = safety.warning || '';
    if (!crashWarning) {
      if (time === '夜宵' && goal === '多聊天') {
        crashWarning = '夜宵更适合轻松见面，不太适合认真聊天。';
      } else if ((time === '中午' || time === '下午') && goal === '升温') {
        crashWarning = '白天更适合自然推进，不适合硬做情绪升温局。';
      } else if (stage === '第一次见面' && goal === '升温') {
        crashWarning = '第一次见面先建立舒适感，比急着推进更重要。';
      } else if (time === '夜宵') {
        crashWarning = '夜宵局天然偏随意，别期待它自动长成体面正式的约会。';
      } else if (time === '晚餐' && goal === '不尴尬') {
        crashWarning = '想稳一点时，别把晚餐做成高投入高压力的局。';
      } else if (goal === '多聊天') {
        crashWarning = '想认真了解对方，就别选交流空间太少的项目。';
      } else if (goal === '升温') {
        crashWarning = '想升温也别太快，先保证这次见面本身顺畅。';
      } else {
        crashWarning = '别让活动形式抢走重点，这次核心是让相处方式顺起来。';
      }
    }

    let reason = '';
    if (mode === 'light') reason = '这次更适合低压力、方便撤退、不会把局做太重的见面形式。';
    if (mode === 'chat') reason = '这次重点是交流和观察，对活动的要求是安静、自然、可说话。';
    if (mode === 'warm') reason = '这次更适合带一点互动感和情绪温度，但前提是别越过边界。';
    if (mode === 'easy') reason = '这次更适合自然陪伴，不需要太强的设计感或正式感。';

    const finalRecommend = uniq(
      recommend.filter((item) => {
        if (time === '晚餐' && item === '咖啡') return false;
        if (time === '夜宵' && ['咖啡', '安静正餐', '简餐'].includes(item)) return false;
        return true;
      })
    ).slice(0, 3);

    return {
      mode,
      recommend: finalRecommend,
      planB: planB && !finalRecommend.includes(planB) ? planB : '',
      avoid,
      crashWarning,
      reason,
      downgraded,
      downgradeText: downgraded
        ? '这个时间段不太适合你当前想要的约会节奏，所以系统优先给了更稳的安排。'
        : '',
    };
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '16px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 460,
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: 28,
          border: '1px solid #e5e5e5',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ borderBottom: '1px solid #f1f1f1', padding: 24 }}>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>约会模式决策器</div>
        </div>

        <div style={{ padding: 24 }}>
          <ChipGroup label="第几次见面" options={['第一次见面', '前几次见面', '已经比较熟']} value={stage} onChange={setStage} />
          <ChipGroup label="见面时间" options={['中午', '下午', '晚餐', '夜宵']} value={time} onChange={setTime} />
          <ChipGroup label="这次更想要" options={['不尴尬', '多聊天', '升温', '放松陪伴']} value={goal} onChange={setGoal} />

          <button
            onClick={() => setResult(buildResult())}
            style={{
              marginTop: 8,
              width: '100%',
              borderRadius: 16,
              background: '#111111',
              padding: '14px 16px',
              fontSize: 16,
              fontWeight: 600,
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            开始判断
          </button>
        </div>

        {result && (
          <div style={{ padding: '0 24px 24px' }}>
            <div
              style={{
                borderRadius: 24,
                border: `1px solid ${MODE_META[result.mode].border}`,
                background: MODE_META[result.mode].bg,
                padding: 20,
              }}
            >
              <div style={{ marginBottom: 8, fontSize: 12, color: '#737373' }}>本次判断</div>
              <div style={{ marginBottom: 4, fontSize: 32, fontWeight: 700 }}>{MODE_META[result.mode].title}</div>
              <div style={{ marginBottom: 12, fontSize: 14, color: '#525252' }}>{MODE_META[result.mode].subtitle}</div>
              <div style={{ marginBottom: 16, fontSize: 14, color: '#525252' }}>{summary}</div>

              {result.downgraded && (
                <div
                  style={{
                    marginBottom: 16,
                    borderRadius: 16,
                    border: '1px solid #e5e5e5',
                    background: 'rgba(255,255,255,0.8)',
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: '#404040' }}>{result.downgradeText}</div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>推荐活动</div>
                <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.recommend.map((item) => (
                    <span
                      key={item}
                      style={{
                        borderRadius: 9999,
                        border: '1px solid #d4d4d4',
                        background: '#ffffff',
                        padding: '6px 12px',
                        fontSize: 14,
                        color: '#171717',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.7, color: '#525252' }}>
                  {result.recommend.map((item) => ACTIVITY_DESC[item]).join('；')}
                </div>
              </div>

              {result.planB && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Plan B</div>
                  <div
                    style={{
                      display: 'inline-flex',
                      borderRadius: 9999,
                      border: '1px solid #d4d4d4',
                      background: '#ffffff',
                      padding: '6px 12px',
                      fontSize: 14,
                      color: '#171717',
                    }}
                  >
                    {result.planB}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>这次不建议</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.avoid.map((item) => (
                    <span
                      key={item}
                      style={{
                        borderRadius: 9999,
                        border: '1px solid #e5e5e5',
                        background: '#f5f5f5',
                        padding: '6px 12px',
                        fontSize: 14,
                        color: '#737373',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 16,
                  border: '1px solid #e5e5e5',
                  background: '#ffffff',
                  padding: 16,
                }}
              >
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>翻车预警</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: '#404040' }}>{result.crashWarning}</div>
              </div>

              <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>判断理由</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: '#404040' }}>{result.reason}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
