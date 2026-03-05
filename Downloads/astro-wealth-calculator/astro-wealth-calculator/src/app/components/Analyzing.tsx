import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { analyzeWealth } from "@/utils/localAstrology";

export function Analyzing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("Parsing planetary phases...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        // 从sessionStorage获取表单数据
        const name = sessionStorage.getItem("astroname") || "旅者";
        const birthDate = sessionStorage.getItem("birthDate") || "";
        const birthTime = sessionStorage.getItem("birthTime") || "";
        const latitude = parseFloat(sessionStorage.getItem("latitude") || "39.9");
        const longitude = parseFloat(sessionStorage.getItem("longitude") || "116.4");

        if (!birthDate || !birthTime) {
          throw new Error("Missing birth data");
        }

        // 解析日期和时间
        const [year, month, day] = birthDate.split("-").map(Number);
        const [hour, minute] = birthTime.split(":").map(Number);

        setPhase("Parsing planetary phases...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        setPhase("Aligning birth chart...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        setPhase("Calculating wealth nodes...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 执行本地星盘分析
        const wealthAnalysis = analyzeWealth(
          day,
          month,
          year,
          hour,
          minute,
          latitude,
          longitude,
          name
        );

        // 保存分析结果到sessionStorage
        sessionStorage.setItem("wealthAnalysis", JSON.stringify(wealthAnalysis));

        setPhase("Drawing conclusions...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 导航到结果页面
        navigate("/result");
      } catch (err) {
        console.error("Analysis error:", err);
        const errorMessage = err instanceof Error ? err.message : "Analysis failed";
        setError(errorMessage);
        setPhase("Error occurred during analysis");
      }
    };

    performAnalysis();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-900 mt-[-10vh]">
        <div className="text-center max-w-md bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/60">
          <h2 className="text-xl font-serif mb-4 text-red-600">⚠️ Error</h2>
          <p className="text-sm text-zinc-600 mb-6 font-mono whitespace-pre-wrap text-left">
            {error}
          </p>
          <button
            onClick={() => window.location.href = "/form"}
            className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-900 mt-[-10vh]">
      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        {/* Core center dot */}
        <motion.div 
           className="w-1.5 h-1.5 bg-black rounded-full z-20 shadow-sm"
           animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
           transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Outer Ring 1 */}
        <motion.div
          className="absolute inset-0 border border-black/10 rounded-full bg-white/30 backdrop-blur-sm"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/40 rounded-full" />
        </motion.div>

        {/* Outer Ring 2 */}
        <motion.div
          className="absolute inset-4 border border-black/20 rounded-full border-dashed"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        />

        {/* Inner glow ring */}
        <motion.div
          className="absolute inset-16 border-[0.5px] border-black/10 rounded-full"
          animate={{ rotate: -360, scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
               key={i} 
               className="absolute w-1 h-1 bg-black/60 rounded-full"
               style={{
                 top: `${50 + 40 * Math.sin(i * Math.PI / 2)}%`,
                 left: `${50 + 40 * Math.cos(i * Math.PI / 2)}%`,
                 transform: 'translate(-50%, -50%)',
               }}
            />
          ))}
        </motion.div>

      </div>

      <motion.div 
         key={phase}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         transition={{ duration: 0.8 }}
         className="font-serif tracking-widest text-sm text-zinc-800 font-medium"
      >
        {phase}
      </motion.div>
    </div>
  );
}
