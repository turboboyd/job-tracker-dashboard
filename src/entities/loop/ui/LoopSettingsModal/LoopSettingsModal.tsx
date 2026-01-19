import type { CanonicalFilters } from "src/entities/loop/model";
import { CompactFilters } from "src/entities/loop/ui/CompactFilters/CompactFilters";
import { Modal } from "src/shared/ui";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  value: CanonicalFilters;
  onChange: (next: CanonicalFilters) => void;

  onApply: () => Promise<void> | void;
  onReset: () => void;

  disabled?: boolean;
};

export function LoopSettingsModal({
  open,
  onOpenChange,
  value,
  onChange,
  onApply,
  onReset,
  disabled,
}: Props) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="My Loop settings"
      description="Update filters, click Apply to refresh links and save settings to your loop."
      size="lg"
    >
      <CompactFilters
        value={value}
        onChange={onChange}
        onApply={onApply}
        onReset={onReset}
        disabled={disabled}
      />
    </Modal>
  );
}
