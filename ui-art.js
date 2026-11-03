const paths={
 wood:'<path fill="#d89a53" stroke="#754e38" d="m7 15 35-7 4 21-35 8z"/><path d="m14 21 23-5m-21 12 22-5" stroke="#f8d69d" stroke-width="3"/>',
 barrels:'<path fill="#5cabe6" stroke="#285c87" stroke-width="2" d="M12 10q14-7 28 0l2 26q-16 10-32 0z"/><path d="m10 17 32 0M10 31h32" stroke="#d1e5ed" stroke-width="5"/>',
 cloth:'<path fill="#fff0bd" stroke="#b29b69" stroke-width="2" d="M10 9h29v28l-9 5-10-4-10 4z"/><path d="M20 10v28m9-28v30" stroke="#e7cf94" stroke-width="2"/>',
 deck:'<path fill="#9d6948" d="m5 25 21-12 21 12v9L26 46 5 34z"/><path fill="#e8b36c" stroke="#855a39" stroke-width="2" d="m5 25 21-12 21 12-21 12z"/><path d="m11 21 21 12m-15-16 21 12m-15-16 21 12" stroke="#b57d42"/>',
 float:'<path d="M6 16h40v7H6z" fill="#e6b177"/><path fill="#63ade7" stroke="#285c87" stroke-width="2" d="M10 26q16-7 32 0v12q-16 8-32 0z"/><path d="M17 24v17m18-17v17" stroke="#c0dce6" stroke-width="4"/>',
 sail:'<path d="M26 7v35M9 44h35" stroke="#91613f" stroke-width="4"/><path fill="#fff0b6" stroke="#c29860" d="m24 9-18 27h18zm5 6v21h14z"/><path d="M14 25h10m6 3h8" stroke="#e98c5e" stroke-width="4"/>',
 roof:'<path d="M9 20v23m34-23v23M9 42h34" stroke="#9a6741" stroke-width="4"/><path fill="#edac60" stroke="#bc7a41" d="M5 24 12 9h28l8 15z"/><path d="m19 10-3 14m14-14v14m8-14 5 14" stroke="#fff0a9" stroke-width="5"/>',
 hook:'<path d="M25 5v19q-17-4-17 8c0 16 30 16 30-4v-8" fill="none" stroke="#436d83" stroke-width="5"/><path d="m31 24 7-11 8 11" fill="#436d83"/>',
 check:'<path d="m11 27 10 10 21-25" fill="none" stroke="#267561" stroke-width="7" stroke-linecap="round"/>',
 land:'<path d="M6 42h40" stroke="#91613f" stroke-width="5"/><path d="m17 39 4-31h12l4 31z" fill="#fff4da" stroke="#ae7056"/><path d="M21 20h12m-13 9h15" stroke="#e88a66" stroke-width="5"/><path d="m19 8 8-7 8 7" fill="#e88a66"/>',
 bail:'<path fill="#81d2e4" stroke="#377488" stroke-width="3" d="m10 17 5 25h25l4-25z"/><path d="M15 15c0-18 26-18 26 0" fill="none" stroke="#377488" stroke-width="3"/>',
 brace:'<path fill="#f6ca65" stroke="#a67d3b" stroke-width="2" d="m26 5 18 7-3 19-15 15L11 31 8 12z"/><path d="m18 25 6 7 12-14" stroke="#fff7dc" stroke-width="4" fill="none"/>',
 patch:'<path d="m12 42 21-29" stroke="#a3784f" stroke-width="8"/><path d="m25 11 9-7 14 12-9 8z" fill="#bcced4" stroke="#4c6f80"/>',
 drop:'<path d="m9 20 7 24h24l6-24M6 14h42M19 9h17" fill="none" stroke="#536f78" stroke-width="4"/>',
};
export const icon=(kind)=>`<svg viewBox="0 0 52 52" aria-hidden="true" focusable="false">${paths[kind]||paths.check}</svg>`;
