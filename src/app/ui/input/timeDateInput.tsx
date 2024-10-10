type Props = {
  label: string | undefined;
  value: string | undefined;
  type?: 'datetime-local' | 'date';
  setValue?: (event: string) => void;
};

export function TimeDateInput({ label, value, setValue, type = 'datetime-local'
}: Props) {
  return (
    <>
      {label && (
        <label className="text-black" htmlFor={label}>
          {label}:{" "}
        </label>
      )}
      <input
        id={label}
        type={type}
        className="text-black"
        name={label}
        defaultValue={value}
        disabled={!setValue}
        onChange={(e) => { if (setValue) setValue(e.target.value) }}
      />
    </>
  );
}
