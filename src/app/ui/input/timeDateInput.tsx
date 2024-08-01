type Props = {
  label: string | undefined;
  value: string;
  setValue: (event: string) => void;
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
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}
