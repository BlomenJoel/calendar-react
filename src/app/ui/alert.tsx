import OutsideAlerter from "../hooks/clickOutside";
import { Input } from "./input";

type Props = {
  startDate: string;
  setStartDate: (newDate: string) => void;
  endDate: string;
  setEndDate: (newDate: string) => void;
  handleCreateEvent: (data: any) => void;
  title: string;
  setTitle: (newTitle: string) => void;
  allDayEvent: boolean;
  setAllDayEvent: (newVal: boolean) => void;
  handelOutsideClick: () => void;
};

export function Alert({
  endDate,
  setEndDate,
  setStartDate,
  startDate,
  handleCreateEvent,
  setTitle,
  title,
  allDayEvent,
  setAllDayEvent,
  handelOutsideClick
}: Props) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50  flex flex-row items-center justify-center z-10" >
      <OutsideAlerter handelOutsideClick={handelOutsideClick}>
        <div className="p-24 bg-white flex flex-col gap-4" >
          <h1 className="text-black">Event</h1>
          <Input.Text label="Title" value={title} setValue={setTitle} />

          <Input.CheckBox
            label="All day event"
            value={allDayEvent}
            setValue={setAllDayEvent}
          />
          {!allDayEvent && (
            <Input.TimeDate
              label="Start"
              value={startDate}
              setValue={(event) => setStartDate(event)}
            />
          )}
          {!allDayEvent && (
            <Input.TimeDate
              label={undefined}
              value={endDate}
              setValue={(event) => setEndDate(event)}
            />
          )}
          <button className="text-black" onClick={handleCreateEvent}>
            Create event
          </button>
        </div>
      </OutsideAlerter>
    </div>
  );
}
