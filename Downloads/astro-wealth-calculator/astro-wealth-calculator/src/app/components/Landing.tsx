import { motion } from "motion/react";
import { Link } from "react-router";

export function Landing() {
  return (
    <div className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center mt-[-6vh] md:mt-[-8vh]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl md:text-[3.5rem] font-serif text-zinc-900 tracking-tight mb-3 md:mb-4 drop-shadow-sm leading-tight md:leading-[1.15]">
          你的星盘里，<br />
          藏着哪个财富量级？
        </h1>
        
        <p className="text-zinc-600 font-medium tracking-wide text-[14px] md:text-[15px] mb-6 md:mb-8 max-w-md md:max-w-lg mx-auto leading-relaxed px-4">
          解锁星盘中的隐秘财库，预见你的财富天花板（A7/A8/A9+）。从事业抉择到资产层级，为你提供一份基于星象逻辑的财务晋升指南。
        </p>

        {/* CTA Button */}
        <Link 
          to="/form" 
          className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-8 py-3 text-zinc-900 font-medium text-[15px] hover:scale-105 hover:bg-white transition-all duration-300 flex items-center gap-2 mb-6 md:mb-8"
        >
          查看我的财富等级
        </Link>
      </motion.div>

      {/* Wealth Scale Thumbnail */}
      <motion.div
        className="relative z-10 w-full max-w-3xl px-4 md:px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full bg-white/30 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgb(0,0,0,0.03)] rounded-2xl md:rounded-3xl p-5 md:p-6 overflow-hidden relative group transform scale-[0.85] sm:scale-90 md:scale-100 origin-top">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/20 pointer-events-none" />
          
          <div className="flex flex-col items-center relative z-10 pt-2 md:pt-4">
            <div className="w-full relative flex items-center justify-between px-2 md:px-8">
              {/* Connecting Axis / Line */}
              <div className="absolute left-10 right-10 md:left-16 md:right-16 top-[15px] md:top-[17px] h-[3px] bg-zinc-300/80 rounded-full z-0"></div>
              
              {/* Scale Nodes */}
              {[
                { level: 'A6', desc: '百万基础' },
                { level: 'A7', desc: '千万跃迁' },
                { level: 'A8', desc: '亿级圈层' },
                { level: 'A9+', desc: '财富塔尖' }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center group/node cursor-pointer z-10 w-24 pt-1 [perspective:1000px]">
                  {/* Interactive Gold Coin Node (The entire coin flips) */}
                  <div className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/node:[transform:rotateY(180deg)_scale(1.15)] [transform-style:preserve-3d]">
                    
                    {/* Front Face */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-[2px] border-yellow-200 shadow-md flex items-center justify-center [backface-visibility:hidden]">
                      <div className="w-[80%] h-[80%] rounded-full border border-amber-600/30 flex items-center justify-center bg-gradient-to-tr from-yellow-300 to-amber-200">
                        <span className="text-[10px] md:text-xs font-serif text-amber-700/80 font-bold">¥</span>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-amber-200 via-yellow-400 to-amber-600 border-[2px] border-yellow-200 shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className="w-[80%] h-[80%] rounded-full border border-amber-600/30 flex items-center justify-center bg-gradient-to-tr from-amber-200 to-yellow-300">
                        <span className="text-[10px] md:text-xs font-serif text-amber-700/80 font-bold">¥</span>
                      </div>
                    </div>
                    
                  </div>
                  
                  <h4 className="font-serif text-lg md:text-2xl text-zinc-700 mb-1 md:mb-1.5 transition-all duration-300 group-hover/node:-translate-y-1 group-hover/node:text-zinc-900 group-hover/node:font-bold">
                    {item.level}
                  </h4>
                  <span className="text-[10px] text-zinc-500 tracking-widest whitespace-nowrap opacity-80 transition-all duration-300 group-hover/node:opacity-100 group-hover/node:text-zinc-700">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
