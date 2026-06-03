"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function TextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  config = {},
}) {
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder,
      ...config,
    }),
    [placeholder, config]
  );

  return (
    <JoditEditor
      value={value}
      config={editorConfig}
      onChange={(content) => onChange && onChange(content)}
    />
  );
}