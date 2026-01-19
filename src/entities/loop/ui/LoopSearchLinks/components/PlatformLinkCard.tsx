import type { LoopPlatform } from "src/entities/loop/model";
import { PLATFORM_LABEL_BY_ID } from "src/entities/loop/model/platformRegistry";
import { Button } from "src/shared/ui";

type Props = {
  platform: LoopPlatform;
  url: string;
  isActive: boolean;

  onOpen: () => void;
  onAdd: () => void;

  addDisabled?: boolean;
};

export function PlatformLinkCard({
  platform,
  url,
  isActive,
  onOpen,
  onAdd,
  addDisabled,
}: Props) {
  const label = PLATFORM_LABEL_BY_ID[platform] ?? platform;

  return (
    <div
      className={[
        "rounded-2xl border bg-background p-4 space-y-3",
        isActive ? "border-primary/50 ring-1 ring-primary/30" : "border-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {label}
          </div>
          <div className="text-xs text-muted-foreground truncate">{url}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" shape="lg" onClick={onOpen}>
            Open
          </Button>
          <Button
            variant="default"
            shape="lg"
            shadow="sm"
            onClick={onAdd}
            disabled={addDisabled}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
