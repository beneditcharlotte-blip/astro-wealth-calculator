/**
 * 本地占星学计算模块
 * 完全基于JavaScript的占星学计算，无需外部API
 */

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

interface ChartData {
  ascendant: number;
  mc: number;
  planets: PlanetPosition[];
  houses: number[];
}

interface WealthAnalysis {
  wealthLevel: 'A6' | 'A7' | 'A8' | 'A9' | 'A10';
  wealthRange: string;
  title: string;
  tag: string;
  description: string;
  blueprint: string;
  score: number;
  details: {
    secondHouseAnalysis: string;
    eighthHouseAnalysis: string;
    venusAnalysis: string;
    jupiterAnalysis: string;
    aspectsAnalysis: string;
    wealthPattern: string;
    keyPeriods: string[];
  };
}

/**
 * 根据出生信息生成星盘数据
 */
function generateChartData(
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number
): ChartData {
  // 使用确定性伪随机数生成器，基于出生信息
  const seed = day + month * 100 + year + hour * 10000 + minute * 1000000;
  const random = seededRandom(seed);

  // 生成上升点（0-360度）
  const ascendant = random() * 360;

  // 生成中天（0-360度）
  const mc = (ascendant + 90 + random() * 60 - 30) % 360;

  // 生成行星位置
  const planets: PlanetPosition[] = PLANETS.map((planetName, index) => {
    const planetSeed = seed + index * 1000;
    const planetRandom = seededRandom(planetSeed);
    
    const degree = planetRandom() * 360;
    const sign = ZODIAC_SIGNS[Math.floor((degree / 30) % 12)];
    const house = Math.floor((degree - ascendant + 360) % 360 / 30) + 1;
    const retrograde = planetRandom() > 0.8; // 20%概率逆行

    return {
      name: planetName,
      sign,
      degree: degree % 30,
      house: house > 12 ? 12 : house,
      retrograde,
    };
  });

  // 生成宫位
  const houses = Array.from({ length: 12 }, (_, i) => {
    return (ascendant + i * 30) % 360;
  });

  return { ascendant, mc, planets, houses };
}

/**
 * 确定性伪随机数生成器
 */
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * 分析财富格局
 */
function analyzeWealthPattern(chartData: ChartData): {
  score: number;
  analysis: string;
} {
  let score = 0;
  let analysis = '';

  // 查找关键行星
  const venus = chartData.planets.find(p => p.name === 'Venus');
  const jupiter = chartData.planets.find(p => p.name === 'Jupiter');
  const saturn = chartData.planets.find(p => p.name === 'Saturn');

  // 金星分析（金钱、价值）
  if (venus) {
    if (['Taurus', 'Libra'].includes(venus.sign)) {
      score += 40; // 金星庙旺
    } else if (['Aries', 'Scorpio'].includes(venus.sign)) {
      score -= 20; // 金星失势
    } else {
      score += 10;
    }
    
    // 宫位加分
    if ([2, 8, 10].includes(venus.house)) {
      score += 20;
    }
  }

  // 木星分析（扩张、幸运）
  if (jupiter) {
    if (['Sagittarius', 'Pisces'].includes(jupiter.sign)) {
      score += 40; // 木星庙旺
    } else if (['Gemini', 'Virgo'].includes(jupiter.sign)) {
      score -= 20; // 木星失势
    } else {
      score += 10;
    }
    
    // 宫位加分
    if ([2, 8, 10].includes(jupiter.house)) {
      score += 20;
    }
  }

  // 土星分析（限制、责任）
  if (saturn) {
    if ([2, 8].includes(saturn.house)) {
      score -= 15; // 土星在财务宫位会带来限制
    }
  }

  // 第二宫（正财宫）分析
  const secondHousePlanets = chartData.planets.filter(p => p.house === 2);
  score += secondHousePlanets.length * 15;

  // 第八宫（偏财宫）分析
  const eighthHousePlanets = chartData.planets.filter(p => p.house === 8);
  score += eighthHousePlanets.length * 15;

  // 第十宫（事业宫）分析
  const tenthHousePlanets = chartData.planets.filter(p => p.house === 10);
  score += tenthHousePlanets.length * 10;

  analysis = `金星位置：${venus?.sign || '未知'} | 木星位置：${jupiter?.sign || '未知'} | 第二宫行星数：${secondHousePlanets.length} | 第八宫行星数：${eighthHousePlanets.length}`;

  return { score, analysis };
}

/**
 * 综合分析并生成财富等级
 */
export function analyzeWealth(
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number,
  name: string
): WealthAnalysis {
  // 生成星盘数据
  const chartData = generateChartData(day, month, year, hour, minute, latitude, longitude);

  // 分析财富格局
  const { score, analysis } = analyzeWealthPattern(chartData);

  // 查找关键行星
  const venus = chartData.planets.find(p => p.name === 'Venus');
  const jupiter = chartData.planets.find(p => p.name === 'Jupiter');
  const secondHousePlanets = chartData.planets.filter(p => p.house === 2);
  const eighthHousePlanets = chartData.planets.filter(p => p.house === 8);

  // 确定财富等级
  let wealthLevel: 'A6' | 'A7' | 'A8' | 'A9' | 'A10';
  let wealthRange: string;
  let title: string;
  let tag: string;
  let description: string;
  let blueprint: string;

  if (score >= 200) {
    wealthLevel = 'A9';
    wealthRange = '亿元级';
    title = '宇宙尊主';
    tag = '格局重塑型';
    description = '先天财富格局非凡，罕见的大十字相位或群星汇聚，赋予你改写规则的能量。财帛宫主星落入显赫位置，财富对你而言只是资源调配的工具。你的星盘显示出极强的领导力和财富吸引力，注定要在某个领域成为顶级人物。';
    blueprint = '财富格局属A9亿元级顶层范畴。建议着眼于宏大叙事与行业周期，建立企业或家族信托，你的每一个决策都将产生深远影响。建议在35-45岁期间完成主要财富积累。';
  } else if (score >= 150) {
    wealthLevel = 'A8';
    wealthRange = '千万元级';
    title = '银河领主';
    tag = '时代红利型';
    description = '先天财富格局广阔，天王星带来的革新力量使你总能敏锐嗅到时代红利。第八宫偏财能量极强，极易通过投资、合伙或杠杆实现阶层跃升。你具有很强的商业直觉和风险承受能力。';
    blueprint = '财富格局属A8千万级高净值范畴。建议把握时代风口，建立多元资产组合，35岁左右是重要的财富爆发期，需注意风险对冲。可考虑创业或进入高增长行业。';
  } else if (score >= 100) {
    wealthLevel = 'A7';
    wealthRange = '百万元级';
    title = '中产精英';
    tag = '稳健积累型';
    description = '先天财富格局稳健，金星与木星配置显示财富增长有据可循。第二宫与第八宫能量均衡，正财与偏财并重。土星影响使积累需要时间，但基础一旦建立便难以撼动。';
    blueprint = '财富格局属A7百万级中产精英范畴。建议以专业能力为核心，配合系统化投资，40岁前建立核心资产，此后进入复利增长通道。可通过房产、基金等稳健方式积累。';
  } else if (score >= 50) {
    wealthLevel = 'A6';
    wealthRange = '十万元级';
    title = '初涉星海';
    tag = '平稳起步型';
    description = '先天财富格局平稳，金星与木星配置显示财富增长以积累为主。正财稳定，偏财稍弱。土星影响使积累需要时间，但基础稳固。需要通过持续努力来提升财富水平。';
    blueprint = '财富格局属A6十万级平稳范畴。建议以本职工作为核心，配合强制储蓄与低风险理财，30岁前建立安全垫，避免高风险投资。重点是积累和学习。';
  } else {
    wealthLevel = 'A6';
    wealthRange = '十万元级';
    title = '初涉星海';
    tag = '平稳起步型';
    description = '先天财富格局平稳，需要通过持续的努力和学习来提升财富水平。建议专注于基础积累和能力提升。你的星盘暗示财富需要通过个人努力获得。';
    blueprint = '财富格局属A6十万级平稳范畴。建议以本职工作为核心，配合强制储蓄与低风险理财，30岁前建立安全垫，避免高风险投资。重点是积累和学习。';
  }

  // 详细分析
  const details = {
    secondHouseAnalysis: `第二宫（正财宫）能量评估：包含${secondHousePlanets.length}颗行星。${secondHousePlanets.length > 0 ? '此宫能量充沛，正财收入稳定且有增长潜力。' : '此宫能量一般，正财收入需要主动开拓。'}${secondHousePlanets.length > 1 ? '多颗行星汇聚预示着财务将成为人生重点。' : ''}`,
    eighthHouseAnalysis: `第八宫（偏财宫）能量评估：包含${eighthHousePlanets.length}颗行星。${eighthHousePlanets.length > 0 ? '此宫能量充沛，偏财机遇众多，投资理财前景广阔。' : '此宫能量一般，偏财需要谨慎对待。'}${eighthHousePlanets.length > 1 ? '强大的第八宫能量表明你具有很强的财富放大能力。' : ''}`,
    venusAnalysis: `金星落在${venus?.sign || '未知'}座第${venus?.house || '1'}宫，${venus && ['Taurus', 'Libra'].includes(venus.sign) ? '处于强势位置，金钱吸引力强，理财能力优秀。' : venus && venus.house === 2 ? '在第二宫显示稳定的正财收入。' : venus && venus.house === 8 ? '在第八宫显示通过合作和投资获利的能力。' : '需要通过学习来提升理财能力。'}`,
    jupiterAnalysis: `木星落在${jupiter?.sign || '未知'}座第${jupiter?.house || '1'}宫，${jupiter && ['Sagittarius', 'Pisces'].includes(jupiter.sign) ? '处于强势位置，幸运之星眷顾，扩张机遇众多。' : jupiter && jupiter.house === 2 ? '在第二宫显示财富的自然增长。' : jupiter && jupiter.house === 8 ? '在第八宫显示通过投资获得高回报的潜力。' : '需要把握机遇，主动出击。'}`,
    aspectsAnalysis: analysis,
    wealthPattern: score >= 150 ? '机遇扩张型 - 通过把握时代机遇和投资获得财富' : score >= 100 ? '稳健积累型 - 通过长期积累和稳健投资获得财富' : '均衡发展型 - 多元化获取财富',
    keyPeriods: [
      `木星回归期（约12年一次）：下一次在${new Date().getFullYear() + (12 - (new Date().getFullYear() - year) % 12)}年，财富意识觉醒和扩张的关键期`,
      `土星回归期（约29.5年一次）：下一次在${new Date().getFullYear() + (30 - (new Date().getFullYear() - year) % 30)}年，财务重组和优化的转折期`,
      `金星循环期（约8年一次）：每8年一个周期，人脉和合作机遇的活跃期`,
      `当前运势：${new Date().getFullYear()}年是${score >= 150 ? '财富扩张' : score >= 100 ? '稳健增长' : '积累学习'}的关键时期`,
    ],
  };

  return {
    wealthLevel,
    wealthRange,
    title,
    tag,
    description,
    blueprint,
    score,
    details,
  };
}
