import { ActionRow } from "src/shared/ui";
import { DashboardIcon } from "../DashboardIcon";

type Props = {
  hasJobs: boolean;
  onGoProfile: () => void;
  onGoQuestions: () => void;
  onGoLoop: () => void;
  onGoJobs: () => void;
  className?: string;
};

export function DashboardOnboardingActions({
  hasJobs,
  onGoProfile,
  onGoQuestions,
  onGoLoop,
  onGoJobs,
  className,
}: Props) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3 md:max-w-[520px]">
        <ActionRow
          icon={<DashboardIcon name="user" />}
          title="Setup profile"
          onGo={onGoProfile}
        />
        <ActionRow
          icon={<DashboardIcon name="question" />}
          title="Answer questions"
          onGo={onGoQuestions}
        />
        <ActionRow
          icon={<DashboardIcon name="loop" />}
          title="Start first loop"
          onGo={onGoLoop}
        />
        <ActionRow
          icon={<DashboardIcon name="add" />}
          title={hasJobs ? "Add another job" : "Add first job"}
          onGo={onGoJobs}
        />
      </div>
    </div>
  );
}
