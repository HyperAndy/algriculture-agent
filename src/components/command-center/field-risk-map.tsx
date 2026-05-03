"use client";

import { useState } from "react";
import { CloudRain, CloudSun, Droplets, Layers, Wind } from "lucide-react";
import { MAP_ZONES, SENSOR_POINTS, hatchPath } from "./map-layout";

export function FieldRiskMap() {
  const [activeLayer, setActiveLayer] = useState("图层");
  const layers = ["图层", "气象", "土壤", "病虫", "灾害", "实景"];

  return (
    <div className="sci-map-box">
      <div className="sci-map-texture">
        <span className="road r1" />
        <span className="road r2" />
        <span className="road r3" />
        <span className="signal s1" />
        <span className="signal s2" />
        <span className="radar-orbit orbit-a" />
        <span className="radar-orbit orbit-b" />
        <span className="map-scanline" />
      </div>

      <div className="sci-map-weather">
        <span><CloudSun size={18} /> 26℃</span>
        <span><Droplets size={18} /> 湿度 68%</span>
        <span><Wind size={18} /> 风速 2.3m/s</span>
        <span><CloudRain size={18} /> 降雨量 0mm</span>
      </div>

      <div className="sci-map-legend">
        <b>风险等级</b>
        <span><i className="high" />高风险</span>
        <span><i className="medium" />中风险</span>
        <span><i className="low" />低风险</span>
        <span><i className="safe" />安全</span>
        <hr />
        <small>气象站</small>
        <small>墒情站</small>
        <small>虫情站</small>
      </div>

      <div className="sci-layer-rail">
        {layers.map((layer) => (
          <button key={layer} className={activeLayer === layer ? "is-active" : ""} onClick={() => setActiveLayer(layer)}>
            <Layers size={15} />
            {layer}
          </button>
        ))}
      </div>

      <svg className="sci-map-svg" viewBox="0 0 760 560" aria-label="田间风险态势地图">
        <defs>
          <filter id="sciGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="map-boundary" d="M38 470 C152 382 194 84 432 56 C604 38 734 186 724 494" />
        <path className="map-grid" d="M86 86 L718 510 M38 212 L674 68 M122 520 L706 128 M36 392 L708 246" />
        {MAP_ZONES.map((zone) => (
          <g className={`map-zone ${zone.risk}`} key={`${zone.crop}-${zone.points}`}>
            <polygon points={zone.points} />
            <path d={hatchPath(zone.points)} />
            {zone.risk === "high" ? (
              <g className="risk-badge" transform={`translate(${zone.iconX} ${zone.iconY})`} filter="url(#sciGlow)">
                <circle r="24" />
                <path d="M0 -14 L15 12 H-15 Z" />
                <line x1="0" y1="-5" x2="0" y2="5" />
                <circle cx="0" cy="10" r="2" />
              </g>
            ) : null}
            {zone.label ? (
              <g className="crop-tag" transform={`translate(${zone.labelX} ${zone.labelY})`}>
                <rect x="-44" y="-22" width="88" height="38" rx="18" />
                <text>{zone.label}</text>
              </g>
            ) : null}
          </g>
        ))}
        {SENSOR_POINTS.map(([x, y], index) => (
          <g className="sensor" key={`${x}-${y}`}>
            <circle className="sensor-pulse" cx={x} cy={y} r="22" />
            <path d={`M${x - 7} ${y + 6}h14v18h-14z`} />
            <path d={`M${x - 9} ${y - 5}c5-5 13-5 18 0M${x - 5} ${y - 1}c3-3 7-3 10 0`} />
            {index < 4 ? <text x={x + 12} y={y - 10}>监测点</text> : null}
          </g>
        ))}
      </svg>
      <div className="sci-scale"><span>0</span><i /><span>50</span><span>100</span><span>200m</span></div>
    </div>
  );
}
