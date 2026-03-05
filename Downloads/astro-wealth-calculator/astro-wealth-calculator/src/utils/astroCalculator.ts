import * as swisseph from 'swisseph';

/**
 * 占星学计算引擎
 * 基于西方占星学三步法进行财富等级推测
 */

// 星座名称和度数范围
const ZODIAC_SIGNS = [
  { name: '白羊座', symbol: '♈', range: [0, 30] },
  { name: '金牛座', symbol: '♉', range: [30, 60] },
  { name: '双子座', symbol: '♊', range: [60, 90] },
  { name: '巨蟹座', symbol: '♋', range: [90, 120] },
  { name: '狮子座', symbol: '♌', range: [120, 150] },
  { name: '处女座', symbol: '♍', range: [150, 180] },
  { name: '天秤座', symbol: '♎', range: [180, 210] },
  { name: '天蝎座', symbol: '♏', range: [210, 240] },
  { name: '射手座', symbol: '♐', range: [240, 270] },
  { name: '摩羯座', symbol: '♑', range: [270, 300] },
  { name: '水瓶座', symbol: '♒', range: [300, 330] },
  { name: '双鱼座', symbol: '♓', range: [330, 360] },
];

// 行星信息
const PLANETS = {
  SUN: 0,      // 太阳
  MOON: 1,     // 月亮
  MERCURY: 2,  // 水星
  VENUS: 3,    // 金星
  MARS: 4,     // 火星
  JUPITER: 5,  // 木星
  SATURN: 6,   // 土星
  URANUS: 7,   // 天王星
  NEPTUNE: 8,  // 海王星
  PLUTO: 9,    // 冥王星
  CHIRON: 15,  // 凯龙星
};

const PLANET_NAMES = {
  0: '太阳',
  1: '月亮',
  2: '水星',
  3: '金星',
  4: '火星',
  5: '木星',
  6: '土星',
  7: '天王星',
  8: '海王星',
  9: '冥王星',
  15: '凯龙星',
};

const PLANET_SYMBOLS = {
  0: '☉',
  1: '☽',
  2: '☿',
  3: '♀',
  4: '♂',
  5: '♃',
  6: '♄',
  7: '♅',
  8: '♆',
  9: '♇',
  15: '⚷',
};

// 行星庙旺落陷位置
const PLANET_DIGNITIES = {
  // 庙旺 (Domicile) - 行星的本命星座
  0: { domicile: [4, 5], exaltation: [1], detriment: [7, 8], fall: [10] }, // 太阳
  1: { domicile: [3], exaltation: [2], detriment: [9], fall: [6] },       // 月亮
  2: { domicile: [2, 5], exaltation: [6], detriment: [8, 9], fall: [12] }, // 水星
  3: { domicile: [6, 7], exaltation: [3], detriment: [2, 8], fall: [9] },  // 金星
  4: { domicile: [0, 7], exaltation: [10], detriment: [3, 6], fall: [4] }, // 火星
  5: { domicile: [8, 11], exaltation: [10], detriment: [2, 5], fall: [6] }, // 木星
  6: { domicile: [9, 10], exaltation: [7], detriment: [3, 4], fall: [1] }, // 土星
  7: { domicile: [10, 11], exaltation: [0], detriment: [4, 5], fall: [7] }, // 天王星
  8: { domicile: [11, 12], exaltation: [6], detriment: [5, 6], fall: [9] }, // 海王星
  9: { domicile: [7, 8], exaltation: [11], detriment: [2, 3], fall: [10] }, // 冥王星
};

interface PlanetPosition {
  planet: number;
  name: string;
  symbol: string;
  longitude: number;
  latitude: number;
  zodiacSign: string;
  degree: number;
  house: number;
  dignity: string; // 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral'
}

interface BirthChart {
  asc: number;
  mc: number;
  planets: PlanetPosition[];
  houses: number[];
  secondHouseSign: string;
  eighthHouseSign: string;
  tenthHouseSign: string;
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
 * 根据度数获取星座信息
 */
function getZodiacSign(longitude: number): { name: string; symbol: string; degree: number } {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLongitude / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const degree = Math.round((normalizedLongitude % 30) * 10) / 10;
  return {
    name: sign.name,
    symbol: sign.symbol,
    degree,
  };
}

/**
 * 获取行星的尊严状态
 */
function getPlanetDignity(planetIndex: number, signIndex: number): string {
  const dignity = PLANET_DIGNITIES[planetIndex];
  if (!dignity) return 'neutral';

  if (dignity.domicile?.includes(signIndex)) return 'domicile';
  if (dignity.exaltation?.includes(signIndex)) return 'exaltation';
  if (dignity.detriment?.includes(signIndex)) return 'detriment';
  if (dignity.fall?.includes(signIndex)) return 'fall';
  return 'neutral';
}

/**
 * 计算宫位
 */
function calculateHouses(asc: number, mc: number): number[] {
  const houses = [asc]; // 第一宫
  const step = 30; // 简化计算：每个宫位30度

  for (let i = 1; i < 12; i++) {
    houses.push((asc + i * step) % 360);
  }

  return houses;
}

/**
 * 确定行星所在的宫位
 */
function getPlanetHouse(longitude: number, houses: number[]): number {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % 12];

    let isInHouse = false;
    if (i === 11) {
      // 第12宫跨越0度
      isInHouse = normalizedLongitude >= currentHouse || normalizedLongitude < nextHouse;
    } else {
      isInHouse = normalizedLongitude >= currentHouse && normalizedLongitude < nextHouse;
    }

    if (isInHouse) {
      return i + 1;
    }
  }

  return 1;
}

/**
 * 计算两个行星之间的相位
 */
function calculateAspect(
  lon1: number,
  lon2: number
): { aspect: string; angle: number; isHarmonic: boolean } | null {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;

  const aspects = [
    { name: '合相', angle: 0, orb: 8 },
    { name: '六分相', angle: 60, orb: 6, harmonic: true },
    { name: '四分相', angle: 90, orb: 8 },
    { name: '三分相', angle: 120, orb: 8, harmonic: true },
    { name: '对分相', angle: 180, orb: 8 },
  ];

  for (const asp of aspects) {
    if (Math.abs(diff - asp.angle) <= asp.orb) {
      return {
        aspect: asp.name,
        angle: diff,
        isHarmonic: asp.harmonic || false,
      };
    }
  }

  return null;
}

/**
 * 计算出生星盘
 */
export async function calculateBirthChart(
  birthDate: string,
  birthTime: string,
  birthPlace: string,
  latitude: number = 39.9, // 默认北京坐标
  longitude: number = 116.4
): Promise<BirthChart> {
  // 解析出生日期和时间
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);

  // 计算儒略日数
  const jd = swisseph.swe_julday(year, month, day, hour + minute / 60, 1);

  // 计算上升点和中天
  const result = swisseph.swe_houses(jd, latitude, longitude, 'P');
  const asc = result.houses[0];
  const mc = result.houses[9];

  // 计算行星位置
  const planetIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const planets: PlanetPosition[] = [];
  const houses = calculateHouses(asc, mc);

  for (const planetIndex of planetIndices) {
    const planetResult = swisseph.swe_calc(jd, planetIndex, 256);
    const longitude = planetResult.longitude;
    const latitude = planetResult.latitude;

    const zodiac = getZodiacSign(longitude);
    const signIndex = Math.floor(longitude / 30);
    const dignity = getPlanetDignity(planetIndex, signIndex);
    const house = getPlanetHouse(longitude, houses);

    planets.push({
      planet: planetIndex,
      name: PLANET_NAMES[planetIndex],
      symbol: PLANET_SYMBOLS[planetIndex],
      longitude,
      latitude,
      zodiacSign: zodiac.name,
      degree: zodiac.degree,
      house,
      dignity,
    });
  }

  // 获取第二、八、十宫的星座
  const secondHouseSign = getZodiacSign(houses[1]).name;
  const eighthHouseSign = getZodiacSign(houses[7]).name;
  const tenthHouseSign = getZodiacSign(houses[9]).name;

  return {
    asc,
    mc,
    planets,
    houses,
    secondHouseSign,
    eighthHouseSign,
    tenthHouseSign,
  };
}

/**
 * 分析财富格局 - 第一步：确立财富核心宫位与征象星
 */
function analyzeWealthFoundation(chart: BirthChart): {
  secondHouseScore: number;
  eighthHouseScore: number;
  venusScore: number;
  jupiterScore: number;
  analysis: string;
} {
  const venus = chart.planets.find(p => p.planet === 3)!;
  const jupiter = chart.planets.find(p => p.planet === 5)!;

  let secondHouseScore = 0;
  let eighthHouseScore = 0;
  let venusScore = 0;
  let jupiterScore = 0;

  // 第二宫分析
  const secondHousePlanets = chart.planets.filter(p => p.house === 2);
  secondHouseScore = secondHousePlanets.length * 20;
  if (venus.house === 2) secondHouseScore += 30;

  // 第八宫分析
  const eighthHousePlanets = chart.planets.filter(p => p.house === 8);
  eighthHouseScore = eighthHousePlanets.length * 20;
  if (jupiter.house === 8) eighthHouseScore += 30;

  // 金星分析
  if (venus.dignity === 'domicile' || venus.dignity === 'exaltation') venusScore += 40;
  else if (venus.dignity === 'detriment' || venus.dignity === 'fall') venusScore -= 20;
  else venusScore += 10;

  // 木星分析
  if (jupiter.dignity === 'domicile' || jupiter.dignity === 'exaltation') jupiterScore += 40;
  else if (jupiter.dignity === 'detriment' || jupiter.dignity === 'fall') jupiterScore -= 20;
  else jupiterScore += 10;

  const analysis = `第二宫（正财）能量评分：${secondHouseScore}分 | 第八宫（偏财）能量评分：${eighthHouseScore}分 | 金星力量：${venusScore}分 | 木星力量：${jupiterScore}分`;

  return {
    secondHouseScore,
    eighthHouseScore,
    venusScore,
    jupiterScore,
    analysis,
  };
}

/**
 * 分析财富格局 - 第二步：分析财富格局与模式
 */
function analyzeWealthPattern(chart: BirthChart): {
  aspectScore: number;
  stelliumScore: number;
  wealthPattern: string;
  analysis: string;
} {
  const venus = chart.planets.find(p => p.planet === 3)!;
  const jupiter = chart.planets.find(p => p.planet === 5)!;
  const saturn = chart.planets.find(p => p.planet === 6)!;
  const mars = chart.planets.find(p => p.planet === 4)!;

  let aspectScore = 0;
  let stelliumScore = 0;

  // 相位联动分析
  const venusJupiterAspect = calculateAspect(venus.longitude, jupiter.longitude);
  if (venusJupiterAspect?.isHarmonic) aspectScore += 30;
  else if (venusJupiterAspect) aspectScore -= 15;

  const venusSaturnAspect = calculateAspect(venus.longitude, saturn.longitude);
  if (venusSaturnAspect?.isHarmonic) aspectScore += 20;
  else if (venusSaturnAspect) aspectScore -= 10;

  const jupiterSaturnAspect = calculateAspect(jupiter.longitude, saturn.longitude);
  if (jupiterSaturnAspect?.isHarmonic) aspectScore += 20;
  else if (jupiterSaturnAspect) aspectScore -= 10;

  // 星群分析
  const secondHousePlanets = chart.planets.filter(p => p.house === 2);
  const eighthHousePlanets = chart.planets.filter(p => p.house === 8);

  if (secondHousePlanets.length >= 3) stelliumScore += 40;
  else if (secondHousePlanets.length === 2) stelliumScore += 20;

  if (eighthHousePlanets.length >= 3) stelliumScore += 40;
  else if (eighthHousePlanets.length === 2) stelliumScore += 20;

  // 确定财富获取模式
  let wealthPattern = '';
  if (saturn.dignity === 'domicile' && venus.dignity !== 'fall') {
    wealthPattern = '稳定积累型 - 通过长期积累和稳健投资获得财富';
  } else if (venus.dignity === 'domicile' || venus.dignity === 'exaltation') {
    wealthPattern = '专业合作型 - 通过专业能力和人脉合作获得财富';
  } else if (jupiter.dignity === 'domicile' && jupiter.house === 8) {
    wealthPattern = '机遇扩张型 - 通过把握时代机遇和投资获得财富';
  } else if (mars.house === 8 || mars.house === 10) {
    wealthPattern = '风险投资型 - 通过冒险和竞争获得财富';
  } else {
    wealthPattern = '均衡发展型 - 多元化获取财富';
  }

  const analysis = `相位评分：${aspectScore}分 | 星群评分：${stelliumScore}分 | 财富模式：${wealthPattern}`;

  return {
    aspectScore,
    stelliumScore,
    wealthPattern,
    analysis,
  };
}

/**
 * 综合评估财富等级
 */
export async function analyzeWealth(
  birthDate: string,
  birthTime: string,
  birthPlace: string,
  name: string,
  latitude: number = 39.9,
  longitude: number = 116.4
): Promise<WealthAnalysis> {
  // 计算出生星盘
  const chart = await calculateBirthChart(birthDate, birthTime, birthPlace, latitude, longitude);

  // 第一步：确立财富核心宫位与征象星
  const foundation = analyzeWealthFoundation(chart);

  // 第二步：分析财富格局与模式
  const pattern = analyzeWealthPattern(chart);

  // 综合评分
  const totalScore =
    foundation.secondHouseScore +
    foundation.eighthHouseScore +
    foundation.venusScore +
    foundation.jupiterScore +
    pattern.aspectScore +
    pattern.stelliumScore;

  // 确定财富等级
  let wealthLevel: 'A6' | 'A7' | 'A8' | 'A9' | 'A10';
  let wealthRange: string;
  let title: string;
  let tag: string;
  let description: string;
  let blueprint: string;

  if (totalScore >= 200) {
    wealthLevel = 'A9';
    wealthRange = '亿元级';
    title = '宇宙尊主';
    tag = '格局重塑型';
    description =
      '先天财富格局非凡，罕见的大十字相位或群星汇聚，赋予你改写规则的能量。财帛宫主星落入显赫位置，财富对你而言只是资源调配的工具。';
    blueprint =
      '财富格局属A9亿元级顶层范畴。建议着眼于宏大叙事与行业周期，建立企业或家族信托，你的每一个决策都将产生深远影响。';
  } else if (totalScore >= 150) {
    wealthLevel = 'A8';
    wealthRange = '千万元级';
    title = '银河领主';
    tag = '时代红利型';
    description =
      '先天财富格局广阔，天王星带来的革新力量使你总能敏锐嗅到时代红利。第八宫偏财能量极强，极易通过投资、合伙或杠杆实现阶层跃升。';
    blueprint =
      '财富格局属A8千万级高净值范畴。建议把握时代风口，建立多元资产组合，35岁左右是重要的财富爆发期，需注意风险对冲。';
  } else if (totalScore >= 100) {
    wealthLevel = 'A7';
    wealthRange = '百万元级';
    title = '中产精英';
    tag = '稳健积累型';
    description =
      '先天财富格局稳健，金星与木星配置显示财富增长有据可循。第二宫与第八宫能量均衡，正财与偏财并重。土星影响使积累需要时间，但基础一旦建立便难以撼动。';
    blueprint =
      '财富格局属A7百万级中产精英范畴。建议以专业能力为核心，配合系统化投资，40岁前建立核心资产，此后进入复利增长通道。';
  } else if (totalScore >= 50) {
    wealthLevel = 'A6';
    wealthRange = '十万元级';
    title = '初涉星海';
    tag = '平稳起步型';
    description =
      '先天财富格局平稳，金星与木星配置显示财富增长以积累为主。正财稳定，偏财稍弱。土星影响使积累需要时间，但基础稳固。';
    blueprint =
      '财富格局属A6十万级平稳范畴。建议以本职工作为核心，配合强制储蓄与低风险理财，30岁前建立安全垫，避免高风险投资。';
  } else {
    wealthLevel = 'A6';
    wealthRange = '十万元级';
    title = '初涉星海';
    tag = '平稳起步型';
    description =
      '先天财富格局平稳，需要通过持续的努力和学习来提升财富水平。建议专注于基础积累和能力提升。';
    blueprint =
      '财富格局属A6十万级平稳范畴。建议以本职工作为核心，配合强制储蓄与低风险理财，30岁前建立安全垫，避免高风险投资。';
  }

  // 详细分析
  const venus = chart.planets.find(p => p.planet === 3)!;
  const jupiter = chart.planets.find(p => p.planet === 5)!;

  const details = {
    secondHouseAnalysis: `第二宫宫头为${chart.secondHouseSign}，代表正财宫位。${foundation.secondHouseScore > 40 ? '此宫能量充沛，正财收入稳定且有增长潜力。' : '此宫能量一般，正财收入需要主动开拓。'}`,
    eighthHouseAnalysis: `第八宫宫头为${chart.eighthHouseSign}，代表偏财宫位。${foundation.eighthHouseScore > 40 ? '此宫能量充沛，偏财机遇众多，投资理财前景广阔。' : '此宫能量一般，偏财需要谨慎对待。'}`,
    venusAnalysis: `金星落在${venus.zodiacSign}第${venus.house}宫，${venus.dignity === 'domicile' || venus.dignity === 'exaltation' ? '处于强势位置，金钱吸引力强，理财能力优秀。' : '需要通过学习来提升理财能力。'}`,
    jupiterAnalysis: `木星落在${jupiter.zodiacSign}第${jupiter.house}宫，${jupiter.dignity === 'domicile' || jupiter.dignity === 'exaltation' ? '处于强势位置，幸运之星眷顾，扩张机遇众多。' : '需要把握机遇，主动出击。'}`,
    aspectsAnalysis: pattern.analysis,
    wealthPattern: pattern.wealthPattern,
    keyPeriods: [
      '木星回归期（约12年一次）：财富意识觉醒和扩张的关键期',
      '土星回归期（约29.5年一次）：财务重组和优化的转折期',
      '金星循环期（约8年一次）：人脉和合作机遇的活跃期',
    ],
  };

  return {
    wealthLevel,
    wealthRange,
    title,
    tag,
    description,
    blueprint,
    score: totalScore,
    details,
  };
}
