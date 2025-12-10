import React, { useState } from "react";

export default function SearchSelect({ label, options, value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full mb-4 relative">
      <label className="block mb-1 font-semibold">{label}</label>

      <div
        className="border p-2 rounded cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        {value ? options.find((o) => o.value === value)?.label : "Select..."}
      </div>

      {open && (
        <div className="absolute z-50 bg-white border mt-1 w-full max-h-60 overflow-y-auto shadow-lg rounded">
          
          {/* SEARCH INPUT */}
          <input
            className="w-full border-b p-2 outline-none"
            placeholder="Search..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.map((opt) => (
            <div
              key={opt.value}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
                setQuery("");
              }}
            >
              {opt.label}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-2 text-gray-500 italic">No results</div>
          )}
        </div>
      )}
    </div>
  );
}
