"use client";

import { createContext, useState } from "react";
import PropTypes from "prop-types";

const STORAGE_KEY = "clockDisplay";

export const DATE_FORMATS = {
  weekday: { weekday: "long", month: "short", day: "numeric" },
  monthDay: { month: "short", day: "numeric" },
  numeric: { month: "numeric", day: "numeric", year: "numeric" },
};

const DEFAULT_CLOCK = {
  hour12: true,
  dateFormat: "weekday",
};

function readStoredClock() {
  if (typeof window === "undefined") return DEFAULT_CLOCK;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      hour12: saved?.hour12 !== false,
      dateFormat: DATE_FORMATS[saved?.dateFormat] ? saved.dateFormat : "weekday",
    };
  } catch {
    return DEFAULT_CLOCK;
  }
}

export const ClockContext = createContext();

export function ClockProvider({ children }) {
  const [clock, setClock] = useState(readStoredClock);

  const updateClock = (partial) => {
    setClock((current) => {
      const next = { ...current, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setHour12 = (value) => updateClock({ hour12: value });

  const setDateFormat = (value) => {
    if (!DATE_FORMATS[value]) return;
    updateClock({ dateFormat: value });
  };

  return (
    <ClockContext.Provider
      value={{
        hour12: clock.hour12,
        dateFormat: clock.dateFormat,
        setHour12,
        setDateFormat,
      }}
    >
      {children}
    </ClockContext.Provider>
  );
}

ClockProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
