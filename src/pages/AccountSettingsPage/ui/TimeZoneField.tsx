
import { FormField } from "src/shared/ui/Form/FormField/FormField";
import { Select } from "src/shared/ui/Form/Select/Select";

export type TimeZoneOption = { value: string; label: string };

type Props = {
  value: string;
  options: ReadonlyArray<TimeZoneOption>;
  disabled?: boolean;
  onChange: (v: string) => void;
};

export function TimeZoneField({ value, options, disabled, onChange }: Props) {
  return (
    <FormField label="Time zone" required>
      {({ id, describedBy }) => (
        <Select<string>
          id={id}
          aria-describedby={describedBy}
          value={value}
          onChange={onChange}
          options={options}
          disabled={disabled}
        />
      )}
    </FormField>
  );
}
