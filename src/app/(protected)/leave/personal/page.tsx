import EmployeeLeavePage from "@/features/leave/pages/EmployeeLeavePage";

export default function PersonalLeavePage() {
  return <EmployeeLeavePage />;
import { PersonalLeaveView } from "@/features/leave/components/personal-leave-view";

export const metadata = {
  title: "Lịch sử xin nghỉ | Mini-HRM",
};

export default function PersonalLeavePage() {
  return <PersonalLeaveView />;
}
