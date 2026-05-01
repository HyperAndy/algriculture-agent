"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ObservationForm({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setError("");
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/fields/${fieldId}/observations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "保存失败");
      return;
    }
    router.push(`/console/fields/${fieldId}/analysis`);
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-5">
      {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <Fieldset title="天气">
        <Input name="temperatureC" label="当前温度(℃)" defaultValue="34" />
        <Input name="rainfallMm" label="近24小时降雨(mm)" defaultValue="0" />
        <Input name="windLevel" label="风力" defaultValue="3级" />
        <Input name="weatherTrend" label="未来天气趋势" defaultValue="未来5天高温少雨" />
      </Fieldset>
      <Fieldset title="土壤">
        <Input name="soilMoisturePercent" label="土壤墒情(%)" defaultValue="38" />
        <Input name="soilTemperatureC" label="土壤温度(℃)" defaultValue="27" />
        <Input name="soilPh" label="土壤pH" defaultValue="6.8" />
        <Select name="nitrogenLevel" label="氮素" />
        <Select name="phosphorusLevel" label="磷素" />
        <Select name="potassiumLevel" label="钾素" defaultValue="low" />
      </Fieldset>
      <Fieldset title="苗情与病虫草害">
        <Input name="plantHeightCm" label="株高(cm)" defaultValue="65" />
        <Select name="leafColor" label="叶色" options={[["pale", "偏淡"], ["normal", "正常"], ["dark", "偏深"]]} defaultValue="pale" />
        <Select name="growthStatus" label="长势" options={[["weak", "偏弱"], ["normal", "正常"], ["vigorous", "旺长"]]} defaultValue="weak" />
        <Input name="pestDescription" label="虫害描述" defaultValue="少量虫咬叶片" />
        <Input name="diseaseDescription" label="病害描述" defaultValue="" />
        <Input name="weedDescription" label="杂草描述" defaultValue="田间有零星杂草" />
      </Fieldset>
      <Fieldset title="农事记录">
        <Input name="notes" label="备注" defaultValue="部分叶片午后卷曲" />
      </Fieldset>
      <button disabled={loading} className="rounded-md bg-[#1f6f49] px-5 py-3 font-semibold text-white disabled:opacity-60">
        {loading ? "保存中..." : "保存并进入Agent分析"}
      </button>
    </form>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-[#dce5d8] bg-white p-4">
      <legend className="px-2 text-sm font-bold text-[#1f6f49]">{title}</legend>
      <div className="grid gap-3 md:grid-cols-3">{children}</div>
    </fieldset>
  );
}

function Input({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-[#536156]">{label}</span>
      <input name={name} defaultValue={defaultValue} className="rounded-md border border-[#cbd8c7] bg-white px-3 py-2 outline-none focus:border-[#1f6f49]" />
    </label>
  );
}

function Select({ name, label, defaultValue = "normal", options = [["low", "偏低"], ["normal", "正常"], ["high", "偏高"]] }: { name: string; label: string; defaultValue?: string; options?: string[][] }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-[#536156]">{label}</span>
      <select name={name} defaultValue={defaultValue} className="rounded-md border border-[#cbd8c7] bg-white px-3 py-2 outline-none focus:border-[#1f6f49]">
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
