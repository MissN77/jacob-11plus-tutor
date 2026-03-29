// ── NVR SHAPE RENDERER ────────────────────────────────────────────────────
// spec: [type, fill, rotation, scale]
// type: c=circle, s=square, t=triangle, d=diamond, p=pentagon, h=hexagon, *=star, +=cross, a=arrow, ov=oval
// fill: e=empty, g=grey, b=black, l=lightgrey

export function shapeEl(spec,cx,cy,r){
  const type=spec[0]||'c', fill=spec[1]||'e', rot=spec[2]||0;
  const scale=spec[3]!==undefined?spec[3]:1.0; r=r*scale;
  const fs={
    e:`fill="white" stroke="#1B2A4A" stroke-width="2.5"`,
    g:`fill="#999" stroke="#1B2A4A" stroke-width="2"`,
    b:`fill="#1B2A4A" stroke="#1B2A4A" stroke-width="1"`,
    l:`fill="#CCC" stroke="#1B2A4A" stroke-width="2"`,
  }[fill]||`fill="white" stroke="#1B2A4A" stroke-width="2"`;

  function poly(pts){return `<polygon points="${pts}" ${fs}/>`;}
  function reg(n,off=-90){
    return [...Array(n)].map((_,i)=>{
      const a=(i*360/n+off)*Math.PI/180;
      return `${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`;
    }).join(' ');
  }

  let el='';
  switch(type){
    case 'c': el=`<circle cx="${cx}" cy="${cy}" r="${r}" ${fs}/>`; break;
    case 's': el=`<rect x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" ${fs}/>`; break;
    case 't': el=poly(`${cx},${cy-r} ${cx+r*0.866},${cy+r*0.5} ${cx-r*0.866},${cy+r*0.5}`); break;
    case 'd': el=poly(`${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}`); break;
    case 'p': el=poly(reg(5)); break;
    case 'h': el=poly(reg(6)); break;
    case 'ov': el=`<ellipse cx="${cx}" cy="${cy}" rx="${r*1.4}" ry="${r*0.75}" ${fs}/>`; break;
    case '+': {
      const w=r*0.35;
      el=poly(`${cx-w},${cy-r} ${cx+w},${cy-r} ${cx+w},${cy-w} ${cx+r},${cy-w} ${cx+r},${cy+w} ${cx+w},${cy+w} ${cx+w},${cy+r} ${cx-w},${cy+r} ${cx-w},${cy+w} ${cx-r},${cy+w} ${cx-r},${cy-w} ${cx-w},${cy-w}`);
      break;
    }
    case 'a': {
      const hw=r*0.35;
      el=poly(`${cx-r},${cy-hw} ${cx+r*0.05},${cy-hw} ${cx+r*0.05},${cy-r} ${cx+r},${cy} ${cx+r*0.05},${cy+r} ${cx+r*0.05},${cy+hw} ${cx-r},${cy+hw}`);
      break;
    }
    case '*': {
      const pts=[];
      for(let i=0;i<10;i++){const a=(i*36-90)*Math.PI/180;const ri=i%2===0?r:r*0.45;pts.push(`${(cx+ri*Math.cos(a)).toFixed(2)},${(cy+ri*Math.sin(a)).toFixed(2)}`);}
      el=poly(pts.join(' '));break;
    }
    default: el=`<circle cx="${cx}" cy="${cy}" r="${r}" ${fs}/>`;
  }
  if(rot===0) return el;
  return `<g transform="rotate(${rot},${cx},${cy})">${el}</g>`;
}

export function cellSVG(spec,w,h){
  const cx=w/2,cy=h/2,r=Math.min(w,h)*0.36;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;">${shapeEl(spec,cx,cy,r)}</svg>`;
}
