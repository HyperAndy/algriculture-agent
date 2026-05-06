import { prisma } from "@/lib/db"
import { FieldListClient } from "@/components/console/field-list-client"

export const dynamic = "force-dynamic"

export default async function FieldsPage() {
  const fields = await prisma.field.findMany({ orderBy: { createdAt: "asc" } })

  return <FieldListClient fields={fields} />
}
