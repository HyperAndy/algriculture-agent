import { AppShell } from "@/components/app-shell";
import { ObservationForm } from "@/components/observation-form";
import { prisma } from "@/lib/db";

export default async function ObservationInputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await prisma.field.findUnique({ where: { id } });
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1f6f49]">Observation Input</p>
        <h1 className="mt-2 text-3xl font-bold">录入观测数据</h1>
        <p className="mt-2 text-[#637064]">{field?.name ?? "示范地块"}：天气、土壤、苗情、病虫草害和农事记录。</p>
      </div>
      <ObservationForm fieldId={id} />
    </AppShell>
  );
}
