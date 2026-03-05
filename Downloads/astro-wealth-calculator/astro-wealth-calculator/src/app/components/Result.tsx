import { motion } from "motion/react";
import { ArrowLeft, Sparkles, Share } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";

type WealthLevel = {
  id: "A6" | "A7" | "A8" | "A9" | "A10";
  range: string;
  title: string;
  tag: string;
  desc: string;
  blueprint: string;
  score?: number;
  details?: {
    secondHouseAnalysis: string;
    eighthHouseAnalysis: string;
    venusAnalysis: string;
    jupiterAnalysis: string;
    aspectsAnalysis: string;
    wealthPattern: string;
    keyPeriods: string[];
  };
};

export function Result() {
  const [result, setResult] = useState<WealthLevel | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const storedName = sessionStorage.getItem("astroname") || "旅者";
    setName(storedName);
    
    // 尝试从sessionStorage获取分析结果
    const wealthAnalysisStr = sessionStorage.getItem("wealthAnalysis");
    if (wealthAnalysisStr) {
      try {
        const wealthAnalysis = JSON.parse(wealthAnalysisStr);
        setResult({
          id: wealthAnalysis.wealthLevel,
          range: wealthAnalysis.wealthRange,
          title: wealthAnalysis.title,
          tag: wealthAnalysis.tag,
          desc: wealthAnalysis.description,
          blueprint: wealthAnalysis.blueprint,
          score: wealthAnalysis.score,
          details: wealthAnalysis.details,
        });
      } catch (err) {
        console.error("Failed to parse wealth analysis:", err);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[80vh] font-sans">
        <div className="text-center">
          <p className="text-zinc-600 mb-4">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[80vh] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center"
      >
        {/* Header Section */}
        <div className="text-center mb-16 w-full">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-zinc-400 opacity-60">✦</span>
            <span className="text-sm tracking-[0.3em] text-zinc-500 opacity-80 font-serif uppercase">Astro Wealth Chart</span>
            <span className="text-zinc-400 opacity-60">✦</span>
          </div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[120px] leading-none font-serif text-transparent bg-clip-text bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-900 mb-4 drop-shadow-sm"
          >
            {result.id}
          </motion.div>
          
          <h2 className="text-2xl tracking-[0.3em] font-serif mb-4 text-zinc-800">{result.title}</h2>
          <p className="text-sm tracking-widest text-zinc-500 mb-6 font-medium">财富量级：{result.range}</p>
          <div className="inline-block border border-white/60 bg-white/50 backdrop-blur-sm text-zinc-700 px-6 py-2 text-xs tracking-widest rounded-full shadow-sm">
            {result.tag}
          </div>
          {result.score !== undefined && (
            <p className="text-xs text-zinc-500 mt-4 font-medium">综合评分：{result.score}分</p>
          )}
        </div>

        {/* Progress Bar Section */}
        <div className="w-full mb-20 px-4">
          <div className="flex h-1.5 w-full bg-white/40 border border-white/60 rounded-full overflow-hidden mb-4 shadow-inner">
            {['A6', 'A7', 'A8', 'A9', 'A10'].map((level, i) => {
               const isCurrent = result.id === level;
               const isPast = result.id > level;
               
               return (
                 <div key={level} className="flex-1 flex border-r border-zinc-200/50 last:border-none relative">
                   {isPast && <div className="absolute inset-0 bg-zinc-200/60" />}
                   {isCurrent && (
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-800 shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                     />
                   )}
                 </div>
               )
            })}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 tracking-widest px-1 font-serif font-medium">
            <span className={result.id >= 'A6' ? 'text-zinc-800 font-bold' : ''}>A6 十万</span>
            <span className={result.id >= 'A7' ? 'text-zinc-800 font-bold' : ''}>A7 百万</span>
            <span className={result.id >= 'A8' ? 'text-zinc-800 font-bold' : ''}>A8 千万</span>
            <span className={result.id >= 'A9' ? 'text-zinc-800 font-bold' : ''}>A9 亿</span>
            <span className={result.id >= 'A10' ? 'text-zinc-800 font-bold' : ''}>A10 十亿+</span>
          </div>
        </div>

        {/* Cards Flow */}
        <div className="w-full flex flex-col gap-8 md:gap-12">
          
          {/* Card 1: Overview */}
          <AstroCard title="命盘格局总览" subtitle="CHART OVERVIEW" watermark="☉" delay={0.2}>
            <div className="space-y-4">
              <p className="text-[14px] text-zinc-700 leading-relaxed font-medium">
                {result.desc}
              </p>
              {result.details && (
                <div className="pt-4 border-t border-white/30 space-y-3">
                  <DetailItem label="正财宫位分析" value={result.details.secondHouseAnalysis} />
                  <DetailItem label="偏财宫位分析" value={result.details.eighthHouseAnalysis} />
                  <DetailItem label="金星能量" value={result.details.venusAnalysis} />
                  <DetailItem label="木星能量" value={result.details.jupiterAnalysis} />
                </div>
              )}
            </div>
          </AstroCard>

          {/* Card 2: Wealth Pattern */}
          {result.details && (
            <AstroCard title="财富获取模式" subtitle="WEALTH PATTERN" watermark="♃" delay={0.4}>
              <div className="space-y-4">
                <p className="text-[14px] text-zinc-700 leading-relaxed font-medium">
                  {result.details.wealthPattern}
                </p>
                <div className="pt-4 border-t border-white/30">
                  <p className="text-xs text-zinc-500 font-bold tracking-widest mb-3">相位与星群分析</p>
                  <p className="text-[13px] text-zinc-600 leading-relaxed font-medium">
                    {result.details.aspectsAnalysis}
                  </p>
                </div>
              </div>
            </AstroCard>
          )}

          {/* Card 3: Blueprint */}
          <AstroCard title="命盘格局断言" subtitle="CHART ASSERTION" watermark="✧" delay={0.6}>
            <div className="space-y-8">
              <p className="text-[15px] text-zinc-700 leading-loose font-medium text-justify">
                {result.blueprint}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {['稳健积累', '专业变现', '贵人相助', '复利思维', '长线布局'].map((tag) => (
                  <span key={tag} className="border border-white/60 bg-white/40 px-4 py-1.5 text-xs tracking-widest text-zinc-600 rounded-full hover:bg-white/80 transition-colors shadow-sm cursor-default">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative p-6 mt-8 border border-white/60 bg-white/30 rounded-xl shadow-sm before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-zinc-400 before:to-zinc-600 before:rounded-r-md">
                <p className="text-sm text-zinc-600 leading-loose font-medium italic">
                  " {result.blueprint} "
                </p>
              </div>
            </div>
          </AstroCard>

          {/* Card 4: Key Periods */}
          {result.details && (
            <AstroCard title="关键财富周期" subtitle="WEALTH CYCLES" watermark="⧖" delay={0.8}>
              <div className="space-y-4">
                {result.details.keyPeriods.map((period, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-lg bg-white/40 border border-white/60 hover:bg-white/60 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-zinc-800 mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                      {period}
                    </p>
                  </div>
                ))}
              </div>
            </AstroCard>
          )}

        </div>

        {/* Action Buttons */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2, duration: 1 }}
           className="flex flex-col sm:flex-row gap-4 w-full mt-16 pt-12 border-t border-zinc-200/50"
        >
           <Link to="/" className="flex-1 py-4 border border-white/60 bg-white/40 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-zinc-600 font-serif tracking-widest text-xs uppercase hover:bg-white/80 hover:text-zinc-900 transition-all flex justify-center items-center gap-3 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>重新测算</span>
           </Link>
           <button 
             className="flex-1 py-4 bg-zinc-900 rounded-xl text-white font-serif tracking-widest text-xs uppercase hover:bg-zinc-800 transition-all flex justify-center items-center gap-3 shadow-lg"
             onClick={() => alert("长按截屏或使用浏览器打印功能保存您的专属星盘财富密卷")}
           >
              <Share className="w-4 h-4" />
              <span>封存命盘报告</span>
           </button>
        </motion.div>

      </motion.div>
    </div>
  );
}

// Subcomponents

function AstroCard({ title, subtitle, children, delay = 0, watermark = "" }: { title: string, subtitle?: string, children: React.ReactNode, delay?: number, watermark?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 md:p-10 overflow-hidden group hover:border-white transition-colors duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-zinc-200/0 rounded-tl-3xl group-hover:border-zinc-300 transition-colors duration-700" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-zinc-200/0 rounded-tr-3xl group-hover:border-zinc-300 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-zinc-200/0 rounded-bl-3xl group-hover:border-zinc-300 transition-colors duration-700" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-zinc-200/0 rounded-br-3xl group-hover:border-zinc-300 transition-colors duration-700" />

      {/* Background Watermark */}
      {watermark && (
        <div className="absolute -right-6 -bottom-16 text-[200px] text-zinc-900/[0.02] font-serif leading-none select-none pointer-events-none group-hover:text-zinc-900/[0.04] transition-colors duration-1000">
          {watermark}
        </div>
      )}

      {/* Card Header */}
      <div className="relative z-10 flex flex-col items-center mb-10 text-center">
        {subtitle && <span className="text-[10px] text-zinc-400 font-bold tracking-[0.4em] uppercase mb-3">{subtitle}</span>}
        <h3 className="text-xl md:text-2xl text-zinc-900 font-serif tracking-widest flex items-center gap-4">
          <span className="text-zinc-300 text-sm">✧</span>
          {title}
          <span className="text-zinc-300 text-sm">✧</span>
        </h3>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-zinc-300 to-transparent mt-6" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-zinc-500 font-bold tracking-widest uppercase">{label}</span>
      <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
        {value}
      </p>
    </div>
  );
}
