type Props = {
  label: string;
  options: { label: string, val: string }[]
  onChange: (newVal: string) => void;
  required?: boolean;
};

export function SelectInput({ label, options, onChange, required }: Props) {
  return (
    <div className="flex gap-4 text-black">
      <select
        required={required}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}>
        <option key={label}>{label}</option>
        {options.map(option =>
          <option value={option.val} key={option.val}>{option.label}</option>
        )}
      </select>
    </div>
  );
}
