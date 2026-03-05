/**
 * Astrology API 集成模块
 * 用于调用真实的占星学API获取星盘数据
 */

// ⚠️ 重要：请在下方填入您的API凭证
const ASTROLOGY_API_USER_ID = "650657"; // 从 https://astrologyapi.com/ 获取
const ASTROLOGY_API_KEY = "9b8c5677b7e3a07e43211d670196d37f89fc987d";     // 从 https://astrologyapi.com/ 获取
const ASTROLOGY_API_BASE_URL = "https://api.astrologyapi.com/v1";

interface ChartData {
  ascendant: number;
  mc: number;
  planets: PlanetData[];
  houses: number[];
}

interface PlanetData {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde?: boolean;
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
 * 调用API的通用方法
 */
async function callAstrologyAPI(endpoint: string, requestBody: any): Promise<any> {
  try {
    // 创建基础认证头
    const credentials = btoa(`${ASTROLOGY_API_USER_ID}:${ASTROLOGY_API_KEY}`);
    
    const response = await fetch(`${ASTROLOGY_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * 获取星盘数据
 */
export async function getChartData(
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number
): Promise<ChartData> {
  try {
    const requestBody = {
      day,
      month,
      year,
      hour,
      minute,
      latitude,
      longitude,
      timezone: 8, // 默认中国时区
    };

    const data = await callAstrologyAPI('/planets', requestBody);

    // 解析API响应
    const chartData: ChartData = {
      ascendant: data.ascendant || 0,
      mc: data.mc || 0,
      planets: (data.planets || []).map((planet: any) => ({
        name: planet.name,
        sign: planet.sign,
        degree: planet.fullDegree || planet.degree,
        house: planet.house || 1,
        retrograde: planet.retrograde || false,
      })),
      houses: data.houses || [],
    };

    return chartData;
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    throw error;
  }
}

/**
 * 获取宫位信息
 */
export async function getHousesData(
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number
): Promise<any> {
  try {
    const requestBody = {
      day,
      month,
      year,
      hour,
      minute,
      latitude,
      longitude,
      timezone: 8,
    };

    return await callAstrologyAPI('/houses', requestBody);
  } catch (error) {
    console.error('Failed to fetch houses data:', error);
    throw error;
  }
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

  // 金星分析
  if (venus) {
    if (['Taurus', 'Libra'].includes(venus.sign)) {
      score += 40; // 金星庙旺
    } else if (['Aries', 'Scorpio'].includes(venus.sign)) {
      score -= 20; // 金星失势
    } else {
      score += 10;
    }
  }

  // 木星分析
  if (jupiter) {
    if (['Sagittarius', 'Pisces'].includes(jupiter.sign)) {
      score += 40; // 木星庙旺
    } else if (['Gemini', 'Virgo'].includes(jupiter.sign)) {
      score -= 20; // 木星失势
    } else {
      score += 10;
    }
  }

  // 第二宫分析
  const secondHousePlanets = chartData.planets.filter(p => p.house === 2);
  score += secondHousePlanets.length * 15;

  // 第八宫分析
  const eighthHousePlanets = chartData.planets.filter(p => p.house === 8);
  score += eighthHousePlanets.length * 15;

  analysis = `金星位置：${venus?.sign || '未知'} | 木星位置：${jupiter?.sign || '未知'} | 第二宫行星数：${secondHousePlanets.length} | 第八宫行星数：${eighthHousePlanets.length}`;

  return { score, analysis };
}

/**
 * 综合分析并生成财富等级
 */
export async function analyzeWealth(
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number,
  name: string
): Promise<WealthAnalysis> {
  try {
    // 获取星盘数据
    const chartData = await getChartData(day, month, year, hour, minute, latitude, longitude);

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
      description = '先天财富格局非凡，罕见的大十字相位或群星汇聚，赋予你改写规则的能量。财帛宫主星落入显赫位置，财富对你而言只是资源调配的工具。';
      blueprint = '财富格局属A9亿元级顶层范畴。建议着眼于宏大叙事与行业周期，建立企业或家族信托，你的每一个决策都将产生深远影响。';
    } else if (score >= 150) {
      wealthLevel = 'A8';
      wealthRange = '千万元级';
      title = '银河领主';
      tag = '时代红利型';
      description = '先天财富格局广阔，天王星带来的革新力量使你总能敏锐嗅到时代红利。第八宫偏财能量极强，极易通过投资、合伙或杠杆实现阶层跃升。';
      blueprint = '财富格局属A8千万级高净值范畴。建议把握时代风口，建立多元资产组合，35岁左右是重要的财富爆发期，需注意风险对冲。';
    } else if (score >= 100) {
      wealthLevel = 'A7';
      wealthRange = '百万元级';
      title = '中产精英';
      tag = '稳健积累型';
      description = '先天财富格局稳健，金星与木星配置显示财富增长有据可循。第二宫与第八宫能量均衡，正财与偏财并重。土星影响使积累需要时间，但基础一旦建立便难以撼动。';
      blueprint = '财富格局属A7百万级中产精英范畴。建议以专业能力为核心，配合系统化投资，40岁前建立核心资产，此后进入复利增长通道。';
    } else if (score >= 50) {
      wealthLevel = 'A6';
      wealthRange = '十万元级';
      title = '初涉星海';
      tag = '平稳起步型';
      description = '先天财富格局平稳，金星与木星配置显示财富增长以积累为主。正财稳定，偏财稍弱。土星影响使积累需要时间，但基础稳固。';
      blueprint = '财富格局属A6十万级平稳范畴。建议以本职工作为核心，配合强制储蓄与低风险理财，30岁前建立安全垫，避免高风险投资。';
    } else {
      wealthLevel = 'A6';
      wealthRange = '十万元级';
      title = '初涉星海';
      tag = '平稳起步型';
      description = '先天财富格局平稳，需要通过持续的努力和学习来提升财富水平。建议专注于基础积累和能力提升。';
      blueprint = '财富格局属A6十万级平稳范畴。建议以本职工作为核心，配合强制储蓄与低风险理财，30岁前建立安全垫，避免高风险投资。';
    }

    // 详细分析
    const details = {
      secondHouseAnalysis: `第二宫（正财宫）能量评估：包含${secondHousePlanets.length}颗行星。${secondHousePlanets.length > 0 ? '此宫能量充沛，正财收入稳定且有增长潜力。' : '此宫能量一般，正财收入需要主动开拓。'}`,
      eighthHouseAnalysis: `第八宫（偏财宫）能量评估：包含${eighthHousePlanets.length}颗行星。${eighthHousePlanets.length > 0 ? '此宫能量充沛，偏财机遇众多，投资理财前景广阔。' : '此宫能量一般，偏财需要谨慎对待。'}`,
      venusAnalysis: `金星落在${venus?.sign || '未知'}座第${venus?.house || '1'}宫，${venus && ['Taurus', 'Libra'].includes(venus.sign) ? '处于强势位置，金钱吸引力强，理财能力优秀。' : '需要通过学习来提升理财能力。'}`,
      jupiterAnalysis: `木星落在${jupiter?.sign || '未知'}座第${jupiter?.house || '1'}宫，${jupiter && ['Sagittarius', 'Pisces'].includes(jupiter.sign) ? '处于强势位置，幸运之星眷顾，扩张机遇众多。' : '需要把握机遇，主动出击。'}`,
      aspectsAnalysis: analysis,
      wealthPattern: score >= 150 ? '机遇扩张型 - 通过把握时代机遇和投资获得财富' : score >= 100 ? '稳健积累型 - 通过长期积累和稳健投资获得财富' : '均衡发展型 - 多元化获取财富',
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
      score,
      details,
    };
  } catch (error) {
    console.error('Wealth analysis error:', error);
    throw error;
  }
}

/**
 * 检查API凭证是否已配置
 */
export function isApiConfigured(): boolean {
  return (
    ASTROLOGY_API_USER_ID !== 'YOUR_USER_ID_HERE' &&
    ASTROLOGY_API_KEY !== 'YOUR_API_KEY_HERE'
  );
}

/**
 * 获取API配置说明
 */
export function getApiConfigInstructions(): string {
  return `
请按照以下步骤配置 Astrology API：

1. 访问 https://astrologyapi.com/
2. 注册账户并登录
3. 在账户设置中找到您的 User ID 和 API Key
4. 打开文件 src/utils/astrologyApi.ts
5. 找到第 8-9 行：
   const ASTROLOGY_API_USER_ID = "YOUR_USER_ID_HERE";
   const ASTROLOGY_API_KEY = "YOUR_API_KEY_HERE";
6. 将 YOUR_USER_ID_HERE 替换为您的 User ID
7. 将 YOUR_API_KEY_HERE 替换为您的 API Key
8. 保存文件并重新部署

示例：
   const ASTROLOGY_API_USER_ID = "12345";
   const ASTROLOGY_API_KEY = "abc123xyz789";
  `;
}
