// ── NVR QUESTION & OPTION RENDERERS ───────────────────────────────────────
import { shapeEl, cellSVG } from './svg-renderers.js';

// ── QUESTION AREA RENDERERS ───────────────────────────────────────────────
export function renderQArea(typeId, q){
  switch(typeId){
    case 'ooo': return renderOOO(q);
    case 'sim': return renderSIM(q);
    case 'seq': return renderSEQ(q);
    case 'ana': return renderANA(q);
    case 'mat': return renderMAT(q);
    case 'cod': return renderCOD(q);
    case 'ref': return renderREF(q);
    case 'fol': return renderFOL(q);
    case 'net': return renderNET(q);
    case 'hid': return renderHID(q);
    default: return '';
  }
}

function renderOOO(q){
  // 4 shapes shown in question area — options ARE the shapes
  // We store shapes in q.s and display them as option buttons
  return '<p style="color:#8A8A8A;font-size:13px;text-align:center;">Tap the odd one out below</p>';
}

function renderSIM(q){
  const w=90,h=90;
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
    <div style="font-size:12px;font-weight:700;color:#8A8A8A;">MATCH THIS SHAPE:</div>
    <div style="background:#E8E0D8;border-radius:12px;padding:10px;">${cellSVG(q.src,w,h)}</div>
  </div>`;
}

function renderSEQ(q){
  const w=70,h=70;
  const cells=q.seq.map(s=>`<div style="background:#F5F0EB;border-radius:8px;padding:4px;">${cellSVG(s,w,h)}</div>`).join('<div style="font-size:18px;color:#8A8A8A;">→</div>');
  return `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;">
    ${cells}
    <div style="font-size:18px;color:#8A8A8A;">→</div>
    <div style="background:#E8E0D8;border-radius:8px;padding:4px;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#1B2A4A;">?</div>
  </div>`;
}

function renderANA(q){
  const w=60,h=60;
  return `<div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
    <div style="display:flex;align-items:center;gap:6px;">
      ${cellSVG(q.pa,w,h)}
      <span style="font-size:22px;font-weight:800;color:#8A8A8A;">→</span>
      ${cellSVG(q.pb,w,h)}
    </div>
    <div style="font-size:12px;color:#8A8A8A;font-weight:700;">AS</div>
    <div style="display:flex;align-items:center;gap:6px;">
      ${cellSVG(q.pc,w,h)}
      <span style="font-size:22px;font-weight:800;color:#8A8A8A;">→</span>
      <div style="width:${w}px;height:${h}px;background:#E8E0D8;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#1B2A4A;">?</div>
    </div>
  </div>`;
}

function renderMAT(q){
  const w=64,h=64;
  let rows='';
  for(let r=0;r<3;r++){
    let row='';
    for(let c=0;c<3;c++){
      const cell=q.g[r][c];
      if(cell===null){
        row+=`<div style="width:${w}px;height:${h}px;background:#1B2A4A;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;font-weight:800;">?</div>`;
      } else {
        row+=`<div style="background:#F5F0EB;border-radius:6px;">${cellSVG(cell,w,h)}</div>`;
      }
    }
    rows+=`<div style="display:flex;gap:4px;">${row}</div>`;
  }
  return `<div style="display:flex;flex-direction:column;gap:4px;">${rows}</div>`;
}

function renderCOD(q){
  const w=46,h=46;
  const exs=q.ex.map(e=>`
    <div style="display:flex;align-items:center;gap:10px;background:#F5F0EB;border-radius:10px;padding:6px 10px;">
      ${cellSVG(e.s,w,h)}
      <span style="font-size:13px;color:#8A8A8A;">→</span>
      <span style="font-size:20px;font-weight:800;color:#1B2A4A;min-width:40px;">${e.c}</span>
    </div>`).join('');
  return `<div style="width:100%;display:flex;flex-direction:column;gap:6px;">
    ${exs}
    <div style="display:flex;align-items:center;gap:10px;background:#E8E0D8;border-radius:10px;padding:6px 10px;border:2px solid #1B2A4A;">
      ${cellSVG(q.tgt,w,h)}
      <span style="font-size:13px;color:#8A8A8A;">→</span>
      <span style="font-size:22px;font-weight:800;color:#1B2A4A;">?</span>
    </div>
  </div>`;
}

function renderREF(q){
  const w=80,h=80;
  const axis=q.axis==='v'?'vertical':'horizontal';
  const lineH=q.axis==='v'?`<line x1="50" y1="0" x2="50" y2="100" stroke="#C05545" stroke-width="2.5" stroke-dasharray="6,4"/>`:
    `<line x1="0" y1="50" x2="100" y2="50" stroke="#C05545" stroke-width="2.5" stroke-dasharray="6,4"/>`;
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
    <div style="font-size:12px;color:#8A8A8A;font-weight:700;">${axis.toUpperCase()} MIRROR LINE (red dotted)</div>
    <div style="display:flex;align-items:center;gap:8px;">
      ${cellSVG(q.orig,w,h)}
      <svg width="100" height="100" viewBox="0 0 100 100" style="display:block;">
        ${shapeEl(q.orig,35,50,28)}
        ${lineH}
      </svg>
    </div>
    <div style="font-size:12px;color:#8A8A8A;">Which option shows the reflection?</div>
  </div>`;
}

function renderFOL(q){
  // Shows a HALF-paper (folded state) with fold line and punched hole
  // fold='v': show RIGHT half of paper; fold='h': show BOTTOM half
  const PW=100,PH=100; // dimensions of folded half-paper shown
  // Map holePos to pixel coords on the folded half
  const holeMap={
    'tr':[PW*0.65,PH*0.25],'br':[PW*0.65,PH*0.75],'mr':[PW*0.65,PH*0.5],
    'bl':[PW*0.35,PH*0.75],'tl':[PW*0.35,PH*0.25],'ml':[PW*0.35,PH*0.5],
    'mb':[PW*0.5,PH*0.65],'mt':[PW*0.5,PH*0.35],
  };
  const hp=holeMap[q.holePos]||[PW*0.65,PH*0.35];
  // For fold='v' show fold line on LEFT edge of half; for 'h' show on TOP edge
  const foldLineEl=q.fold==='v'
    ?`<line x1="2" y1="0" x2="2" y2="${PH}" stroke="#C05545" stroke-width="3" stroke-dasharray="6,4"/>`
    :`<line x1="0" y1="2" x2="${PW}" y2="2" stroke="#C05545" stroke-width="3" stroke-dasharray="6,4"/>`;
  // Arrow label
  const foldArrow=q.fold==='v'?'← FOLD':'↑ FOLD';
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
    <div style="font-size:11px;font-weight:700;color:#C05545;">${foldArrow}</div>
    <svg width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}" style="display:block;border-radius:4px;">
      <rect x="2" y="2" width="${PW-4}" height="${PH-4}" fill="white" stroke="#1B2A4A" stroke-width="2"/>
      ${foldLineEl}
      <circle cx="${hp[0]}" cy="${hp[1]}" r="8" fill="#1B2A4A"/>
    </svg>
    <div style="font-size:11px;color:#8A8A8A;">Paper is folded — which option shows it <strong>unfolded</strong>?</div>
  </div>`;
}

function renderNET(q){
  return `<div style="background:#E8E0D8;border-radius:12px;padding:14px;text-align:center;">
    <div style="font-size:32px;margin-bottom:8px;">📦</div>
    <p style="font-size:14px;font-weight:600;color:#1B2A4A;">${q.q}</p>
  </div>`;
}

function renderHID(q){
  const W=130,H=130;
  const shapes=q.cmp.map(s=>{
    const [type,fill,rot,cx,cy,r]=s;
    // r in spec overrides default; default = 80% of the smaller centre coordinate
    const radius=r!==undefined?r:Math.min(cx,cy)*0.8;
    return shapeEl([type,fill,rot],cx,cy,radius);
  }).join('');
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
    <div style="font-size:12px;color:#8A8A8A;font-weight:700;">FIND THE HIDDEN SHAPE:</div>
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background:white;border-radius:12px;border:2px solid #E8E0D8;">${shapes}</svg>
  </div>`;
}

// ── OPTION RENDERERS ────────────────────────────────────────────────────────
export function renderOpts(typeId, q){
  const labels=['A','B','C','D'];
  switch(typeId){
    case 'ooo':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${cellSVG(q.s[i],90,75)}
      </button>`).join('');
    }
    case 'sim':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${cellSVG(q.opts[i],90,75)}
      </button>`).join('');
    }
    case 'seq':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${cellSVG(q.opts[i],90,75)}
      </button>`).join('');
    }
    case 'ana':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${cellSVG(q.opts[i],90,75)}
      </button>`).join('');
    }
    case 'mat':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${cellSVG(q.opts[i],90,75)}
      </button>`).join('');
    }
    case 'cod':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        <div style="font-size:22px;font-weight:800;padding:8px;">${q.opts[i]}</div>
      </button>`).join('');
    }
    case 'ref':{
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${cellSVG(q.opts[i],90,75)}
      </button>`).join('');
    }
    case 'fol':{
      // Each option in q.opts is an array of [xFrac, yFrac] hole positions on the full unfolded paper
      const PW=76,PH=76;
      function unfolded(holes){
        const hSVG=holes.map(h=>`<circle cx="${(h[0]*PW).toFixed(1)}" cy="${(h[1]*PH).toFixed(1)}" r="7" fill="#1B2A4A"/>`).join('');
        return `<svg width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}" style="display:block;">
          <rect x="1" y="1" width="${PW-2}" height="${PH-2}" fill="white" stroke="#1B2A4A" stroke-width="2"/>
          ${hSVG}
        </svg>`;
      }
      return labels.map((l,i)=>`<button class="opt" data-action="answer" data-value="${i}">
        <div class="lbl">${l}</div>
        ${unfolded(q.opts[i])}
      </button>`).join('');
    }
    case 'net':
    case 'hid':{
      return labels.map((l,i)=>{
        const spec=typeId==='hid'?[q.opts[i],'e']:null;
        const content=spec?cellSVG(spec,90,75):`<div style="font-size:13px;font-weight:600;padding:10px;text-align:center;">${q.opts[i]}</div>`;
        return `<button class="opt" data-action="answer" data-value="${i}">
          <div class="lbl">${l}</div>
          ${content}
        </button>`;
      }).join('');
    }
    default: return '';
  }
}
