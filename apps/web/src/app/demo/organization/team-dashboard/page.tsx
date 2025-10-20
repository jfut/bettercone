import { DemoLayout } from "@/components/layouts/demo-layout";
import { TeamDashboard } from "@/components/team";

export default function TeamDashboardDemo() {
  return (
    <DemoLayout
      title="Team Dashboard"
      description="Comprehensive team management with seat allocation and billing overview"
      category="Organizations"
      pluginName="organization"
    >
      <div className="space-y-6">
        <TeamDashboard showMemberList={true} showUsageBreakdown={true} />
      </div>
    </DemoLayout>
  );
}
