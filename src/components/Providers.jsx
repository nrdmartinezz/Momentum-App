"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ProfileProvider } from "../context/ProfileContext";
import { ThemeProvider } from "../context/ThemeContext";
import { TimerProvider } from "../context/TimerContext";
import { TaskProvider } from "../context/TaskContext";

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ProfileProvider>
      <ThemeProvider>
        <TimerProvider>
          <TaskProvider>{children}</TaskProvider>
        </TimerProvider>
      </ThemeProvider>
    </ProfileProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};
