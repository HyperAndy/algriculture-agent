import { CommandCenter } from "@/components/command-center/command-center";
import { getCommandDashboardViewModel } from "@/features/dashboard/server/get-command-dashboard-view-model";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const data = await getCommandDashboardViewModel();

  return <CommandCenter data={data} />;
}
