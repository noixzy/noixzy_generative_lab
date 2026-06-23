// patch: move UI binding from DOMContentLoaded (pre-p5) into setup() (p5 ready)
const fs=require("fs"), path=require("path");
const files=[
  "flow_field/noixzy_flow_field.html",
  "reaction_diffusion/noixzy_reaction_diffusion.html",
  "voronoi/noixzy_voronoi.html",
  "contour_field/noixzy_contour_field.html",
  "truchet/noixzy_truchet.html",
  "l_system/noixzy_l_system.html",
  "cellular_erosion/noixzy_cellular_erosion.html",
  "recursive_grid/noixzy_recursive_grid.html",
];
let changed=[];
for(const f of files){
  const p=path.join(__dirname,f);
  let s=fs.readFileSync(p,"utf8");
  const orig=s;
  // 1) DOMContentLoaded handler -> a named function
  s=s.replace('document.addEventListener("DOMContentLoaded",()=>{','function bindUI(){');
  // 2) its closing `});` (right after the save handler) -> `}`
  s=s.replace(/"png"\)\);\s*\}\);/, '"png"));\n}');
  // 3) call bindUI() at the end of setup(), after p5 + initial draw
  if(s.includes('render(); bindUI();')||s.includes('reset(); bindUI();')){
    // already patched
  } else if(s.includes('render(); }')){
    s=s.replace('render(); }','render(); bindUI(); }');
  } else if(s.includes('reset(); }')){
    s=s.replace('reset(); }','reset(); bindUI(); }');
  }
  // flow only: make density/palette rebuild live (sync currently sets label only)
  if(f.startsWith('flow_field')){
    s=s.replace(
      'document.getElementById(outs[i]).textContent=(i===3)?P[i]:P[i].toFixed(2);\n      reset();',
      'document.getElementById(outs[i]).textContent=(i===3)?P[i]:P[i].toFixed(2);');
  }
  if(s!==orig){ fs.writeFileSync(p,s); changed.push(f); }
}
console.log("patched:", changed.length, "\n"+changed.join("\n"));
