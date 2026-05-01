import { AppShell } from "@/components/app-shell";
import { FieldCard } from "@/components/field-card";
import { prisma } from "@/lib/db";

export default async function FieldsPage() {
  const fields = await prisma.field.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1f6f49]">Fields</p>
        <h1 className="mt-2 text-3xl font-bold">地块管理</h1>
        <p className="mt-2 text-[#637064]">MVP内置水稻、小麦、玉米、大豆四个示范地块。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fields.map((field) => <FieldCard key={field.id} field={field} />)}
      </div>
    </AppShell>
  );
}
