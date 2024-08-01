type Props = {
  label: string;
  value: boolean;
  setValue: (event: boolean) => void;
};

export function CheckboxInput({ label, value, setValue }: Props) {
  return (
    <div className="flex gap-4">
      <label className="text-black" htmlFor={label}>
        {label}:{" "}
      </label>
      <input
        id={label}
        type="checkbox"
        className={`text-black`}
        name={label}
        checked={value}
        onChange={(e) => {
          setValue(e.target.checked);
        }}
      />
    </div>
  );
}
