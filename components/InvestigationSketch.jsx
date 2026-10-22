export default function InvestigationSketch({ magnifierClassName }) {
  return (
    <svg viewBox="0 0 560 470" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="sketch-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <path d="M0 0V7" stroke="#b3ad9d" strokeWidth="0.7" />
        </pattern>
      </defs>
      <path d="M30 367c39 18 80 7 87-19 7-27-33-40-48-20-20 28 41 63 97 33" stroke="#c9bdab" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" />
      <path d="m41 357-8 12-13-1" stroke="#c9bdab" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m168 100 243 31 22 274-253-15z" fill="url(#sketch-hatch)" stroke="#aaa597" strokeWidth="1.2" />
      <path d="m133 93 250-26 38 285-252 29z" fill="#eeece2" stroke="#aaa597" strokeWidth="1.2" />
      <path d="m145 77 211-23 45 36 28 249-251 29z" fill="#faf8f0" stroke="#6c7264" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m356 54 4 42 41-6" fill="#e5e4d8" stroke="#6c7264" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m175 119 64-7m-63 15 93-10" stroke="#a6ab9b" strokeWidth="2" strokeLinecap="round" />
      <path d="m180 158 189-20" stroke="#d8d9cc" />
      <text x="184" y="184" transform="rotate(-6 184 184)" fill="#6d7566" fontFamily="monospace" fontSize="11">function investigate(issue) {"{"}</text>
      <path d="m191 206 33-4m8-1 80-8m-119 30 57-6m8-1 75-8m-138 30 28-3m8-1 99-10m-133 32 57-6m9-1 37-4" stroke="#b0b6a5" strokeWidth="3.5" strokeLinecap="round" />
      <path d="m201 292 13-1m8-1 78-9m-97 28 38-4m8-1 102-11" stroke="#c7cbbb" strokeWidth="3.5" strokeLinecap="round" />
      <text x="205" y="333" transform="rotate(-6 205 333)" fill="#6d7566" fontFamily="monospace" fontSize="16">{"}"}</text>
      <path d="m160 225 7 6 9-17" stroke="#a35438" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m316 270 30 5m-31 2 26 4" stroke="#a35438" strokeWidth="1.2" strokeLinecap="round" />
      <g className={magnifierClassName}>
        <path d="m356 303 73 82c9 10 26-3 17-14l-77-78" fill="url(#sketch-hatch)" />
        <circle cx="317" cy="233" r="79" fill="#f5f3e9" fillOpacity="0.94" stroke="#495747" strokeWidth="1.8" />
        <circle cx="317" cy="233" r="68" stroke="#909b85" strokeWidth="1.2" />
        <path d="M261 220a59 59 0 0 1 47-45" stroke="#c5cbbb" strokeWidth="3" strokeLinecap="round" />
        <path d="m369 292 13 14-13 12-13-15" fill="#d2d5c5" stroke="#495747" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m379 302 69 76c5 6 3 12-2 17-6 5-12 5-17-1l-68-76z" fill="#495747" stroke="#354333" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m376 317 60 67" stroke="#87917a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="m425 388 16-14" stroke="#354333" strokeWidth="1.5" />
      </g>
      <g transform="translate(316 232) rotate(-14)" stroke="#a35438" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-9-5c-4-17 22-17 18 0M-7-13l-5-6m19 6 5-6" />
        <path d="M-13-5C-24 27 24 27 13-5z" fill="#e9d5c5" />
        <path d="M0-5v29m-15-24-10-6m9 17-12 2m17 9-10 9M15 0l10-6m-9 17 12 2m-17 9 10 9" />
        <path d="M-8 4-5 9m13-5L5 9" strokeWidth="1.2" />
      </g>
      <path d="m410 47 7-19m7 32 15-15m-6 32 22-5" stroke="#e8b66a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m149 398 59-7m9-1 15-2" stroke="#b9b9a9" strokeWidth="1.1" strokeLinecap="round" />
      <text x="81" y="157" transform="rotate(-10 81 157)" fill="#c9bdab" fontFamily="Georgia, serif" fontStyle="italic" fontSize="15">hmm.</text>
      <path d="m102 79 3-10 3 10 10 3-10 3-3 10-3-10-10-3z" stroke="#e8b66a" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m465 265 2-7 2 7 7 2-7 2-2 7-2-7-7-2z" stroke="#c9bdab" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
