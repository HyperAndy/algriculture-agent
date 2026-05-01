import Link from "next/link";
import { getCropLabel, type CropType } from "@/lib/domain/crops";
import { RiskBadge } from "./risk-badge";

export function FieldCard({ field }: { field: { id: string; name: string; cropType: string; growthStage: string; areaMu: number; riskLevel: string; location: string } }) {
  return (
    <Link href={`/console/fields/${field.id}`} className="block rounded-lg border border-[#dce5d8] bg-white p-4 shadow-sm transition hover:border-[#1f6f49]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{field.name}</h3>
          <p className="mt-1 text-sm text-[#637064]">{field.location}</p>
        </div>
        <RiskBadge level={field.riskLevel} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-[#7a867c]">作物</p>
          <p className="font-semibold">{getCropLabel(field.cropType as CropType)}</p>
        </div>
        <div>
          <p className="text-[#7a867c]">生育期</p>
          <p className="font-semibold">{field.growthStage}</p>
        </div>
        <div>
          <p className="text-[#7a867c]">面积</p>
          <p className="font-semibold">{field.areaMu}亩</p>
        </div>
      </div>
    </Link>
  );
}
