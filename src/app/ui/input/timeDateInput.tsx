type Props = {
  label: string | undefined;
  value: string | undefined;
  setValue?: (event: string) => void;
};

export function TimeDateInput({ label, value, setValue }: Props) {
  return (
    <>
      {label && (
        <label className="text-black" htmlFor={label}>
          {label}:{" "}
        </label>
      )}
      <input
        id={label}
        type="datetime-local"
        className="text-black"
        name={label}
        defaultValue={value}
        disabled={!setValue}
        onChange={(e) => { if (setValue) setValue(e.target.value) }}
      />
    </>
  );
}
