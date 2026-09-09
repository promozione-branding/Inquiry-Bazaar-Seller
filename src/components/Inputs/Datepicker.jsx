"use client";

import { useEffect, useRef } from "react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function MyDateRangePicker({
  value,
  onChange,
  open,
  setOpen,
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  const handleChange = (item) => {
    const selection = item.selection;

    onChange({
      startDate: selection.startDate,
      endDate: selection.endDate,
    });

    if (selection.startDate && selection.endDate) {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative inline-block w-full sm:w-auto">
      <input
        type="text"
        readOnly
        onClick={() => setOpen((prev) => !prev)}
        value={
          value?.startDate && value?.endDate
            ? `${format(value.startDate, "dd MMM yyyy")} - ${format(
              value.endDate,
              "dd MMM yyyy"
            )}`
            : ""
        }
        placeholder="Select date range"
        className="
          border border-gray-300
          rounded-md
          px-2 py-2
          text-base
          bg-white
          cursor-pointer
          w-full sm:w-auto
          outline-none
        "
      />

      {open && (
        <div className="date-picker-dropdown">
          <DateRangePicker
            ranges={[
              {
                startDate: value?.startDate || new Date(),
                endDate: value?.endDate || new Date(),
                key: "selection",
              },
            ]}
            onChange={handleChange}
            months={2}
            direction="horizontal"
            moveRangeOnFirstSelection={false}
            maxDate={new Date()}
          />
        </div>
      )}
    </div>
  );
}