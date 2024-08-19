type Props = {
  label: string;
  options: { label: string, val: string }[]
  onChange: (newVal: string) => void;
};

export function SelectInput({ label, options, onChange }: Props) {
  return (
    <div className="flex gap-4 text-black">
      <select
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}>
        <option>{label}</option>
        {options.map(option =>
          <option value={option.val}>{option.label}</option>
        )}
      </select>
    </div>
  );
}
