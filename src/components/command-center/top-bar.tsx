"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CloudSun, Droplets, Menu, Wind } from "lucide-react";

export function TopBar({
  formattedTime,
  dataSourceText
}: {
  formattedTime: string;
  dataSourceText: string;
}) {
  const [timeText, setTimeText] = useState(formattedTime);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const d = new Date();
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      setTimeText(`${y}-${mo}-${day} ${h}:${mi}:${s}`);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="sci-top">
      <div className="sci-top-left sci-ambient-strip">
        <span><CloudSun size={16} /> 26℃</span>
        <span>多云转晴</span>
        <span><Droplets size={16} /> 湿度 68%</span>
        <span><Wind size={16} /> 东南风 2级</span>
      </div>
      <div className="sci-title">
        <h1>AI驱动的大田作物稳产减灾决策平台</h1>
        <p>水 稻 <b>|</b> 小 麦 <b>|</b> 玉 米 <b>|</b> 大 豆</p>
      </div>
      <div className="sci-top-right sci-ambient-strip">
        <span>{timeText}</span>
        <span className="sci-online"><CheckCircle2 size={16} /> 系统正常</span>
        <span className="sci-data-source">{dataSourceText}</span>
        <Menu size={18} />
      </div>
    </header>
  );
}
