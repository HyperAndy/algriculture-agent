"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlayCircle } from "lucide-react";

export function AnalyzeButton({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setError("");
    setLoading(true);
    const response = await fetch(`/api/fields/${fieldId}/analyze`, { method: "POST" });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.message || "分析失败");
      return;
    }
    router.push(`/console/reports/${data.reportId}`);
    router.refresh();
  }

  return (
    <div>
      <button onClick={analyze} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-[#1f6f49] px-5 py-3 font-semibold text-white disabled:opacity-60">
        <PlayCircle className="h-5 w-5" />
        {loading ? "Agent分析中..." : "开始Agent分析"}
      </button>
      {error ? <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
