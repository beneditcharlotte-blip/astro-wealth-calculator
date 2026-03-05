import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft } from "lucide-react";

export function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: 39.9,
    longitude: 116.4,
  });
  
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
       alert("请完成所有字段以获得准确的星盘解读。");
       return;
    }
    
    // 保存表单数据到sessionStorage
    sessionStorage.setItem("astroname", formData.name);
    sessionStorage.setItem("birthDate", formData.birthDate);
    sessionStorage.setItem("birthTime", formData.birthTime);
    sessionStorage.setItem("birthPlace", formData.birthPlace);
    sessionStorage.setItem("latitude", String(formData.latitude));
    sessionStorage.setItem("longitude", String(formData.longitude));
    
    setIsLoading(true);
    navigate("/analyzing");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-white/60"
      >
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate("/")}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-serif text-zinc-900 pr-5">Seek Your Stars</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <Input 
               name="name" 
               placeholder="Your Name" 
               value={formData.name} 
               onChange={handleChange}
               onFocus={() => setIsFocused("name")}
               onBlur={() => setIsFocused(null)}
               isFocused={isFocused === "name"}
            />
            <Input 
               name="birthDate" 
               placeholder="Date of Birth" 
               value={formData.birthDate} 
               onChange={handleChange}
               onFocus={() => setIsFocused("birthDate")}
               onBlur={() => setIsFocused(null)}
               isFocused={isFocused === "birthDate"}
               type="date"
            />
            <Input 
               name="birthTime" 
               placeholder="Time of Birth" 
               value={formData.birthTime} 
               onChange={handleChange}
               onFocus={() => setIsFocused("birthTime")}
               onBlur={() => setIsFocused(null)}
               isFocused={isFocused === "birthTime"}
               type="time"
            />
            <Input 
               name="birthPlace" 
               placeholder="Place of Birth" 
               value={formData.birthPlace} 
               onChange={handleChange}
               onFocus={() => setIsFocused("birthPlace")}
               onBlur={() => setIsFocused(null)}
               isFocused={isFocused === "birthPlace"}
            />
            
            {/* 可选的坐标输入 */}
            <div className="pt-2 border-t border-white/30">
              <p className="text-xs text-zinc-500 mb-3 font-medium">可选：精确坐标（默认北京）</p>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                   name="latitude" 
                   placeholder="Latitude" 
                   value={String(formData.latitude)} 
                   onChange={handleChange}
                   onFocus={() => setIsFocused("latitude")}
                   onBlur={() => setIsFocused(null)}
                   isFocused={isFocused === "latitude"}
                   type="number"
                   step="0.01"
                />
                <Input 
                   name="longitude" 
                   placeholder="Longitude" 
                   value={String(formData.longitude)} 
                   onChange={handleChange}
                   onFocus={() => setIsFocused("longitude")}
                   onBlur={() => setIsFocused(null)}
                   isFocused={isFocused === "longitude"}
                   type="number"
                   step="0.01"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full py-3 px-6 bg-black text-white rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-black/80 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            <span>{isLoading ? "Analyzing..." : "Reveal Destiny"}</span>
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

function Input({ 
  name, 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  isFocused, 
  type = "text",
  step = "1"
}: { 
  name: string, 
  placeholder: string, 
  value: string, 
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onFocus: () => void,
  onBlur: () => void,
  isFocused: boolean,
  type?: string,
  step?: string
}) {
  return (
    <div className="relative group bg-white/50 backdrop-blur-sm rounded-xl px-4 pt-5 pb-2 border border-white/60 focus-within:border-white focus-within:bg-white/80 transition-colors shadow-sm">
      <label 
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 text-zinc-500 font-medium ${
          value || isFocused || type === "date" || type === "time" || type === "number"
            ? "top-2 text-[10px]" 
            : "top-3.5 text-sm"
        }`}
      >
        {placeholder}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        step={step}
        className="w-full bg-transparent text-zinc-900 focus:outline-none text-sm font-medium"
        required
      />
    </div>
  );
}
