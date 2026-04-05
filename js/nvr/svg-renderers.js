// NVR SVG Renderers — ES module
// Converts shape specs into SVG markup for rendering NVR questions.
//
// Shape spec format: [type, fill, rotation, scale]
//   type:  c=circle, s=square, t=triangle, d=diamond, p=pentagon,
//          h=hexagon, *=star, +=cross, a=arrow, ov=oval
//   fill:  e=empty (white), g=grey, b=black, l=light-grey
//   rotation: degrees (optional, default 0)
//   scale:    multiplier (optional, default 1.0)

const FILL_STYLES = {
  e: 'fill="white" stroke="#1B2A4A" stroke-width="2.5"',
  g: 'fill="#999" stroke="#1B2A4A" stroke-width="2"',
  b: 'fill="#1B2A4A" stroke="#1B2A4A" stroke-width="1"',
  l: 'fill="#CCC" stroke="#1B2A4A" stroke-width="2"',
};

/**
 * Build an SVG element (string) for a single shape spec at (cx,cy) with radius r.
 * @param {Array} spec  [type, fill, rotation?, scale?]
 * @param {number} cx   centre-x
 * @param {number} cy   centre-y
 * @param {number} r    radius (half-width) before scale
 * @returns {string} SVG markup for the shape (no outer <svg>)
 */
export function shapeEl(spec, cx, cy, r) {
  const type = spec[0] || 'c';
  const fill = spec[1] || 'e';
  const rot = spec[2] || 0;
  const scale = spec[3] !== undefined ? spec[3] : 1.0;
  r = r * scale;

  const fs = FILL_STYLES[fill] || FILL_STYLES.e;

  const poly = (pts) => `<polygon points="${pts}" ${fs}/>`;
  const reg = (n, off = -90) =>
    [...Array(n)].map((_, i) => {
      const a = ((i * 360) / n + off) * Math.PI / 180;
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(' ');

  let el = '';
  switch (type) {
    case 'c':
      el = `<circle cx="${cx}" cy="${cy}" r="${r}" ${fs}/>`;
      break;
    case 's':
      el = `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" ${fs}/>`;
      break;
    case 't':
      el = poly(`${cx},${cy - r} ${cx + r * 0.866},${cy + r * 0.5} ${cx - r * 0.866},${cy + r * 0.5}`);
      break;
    case 'd':
      el = poly(`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`);
      break;
    case 'p':
      el = poly(reg(5));
      break;
    case 'h':
      el = poly(reg(6));
      break;
    case 'ov':
      el = `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.4}" ry="${r * 0.75}" ${fs}/>`;
      break;
    case '+': {
      const w = r * 0.35;
      el = poly(
        `${cx - w},${cy - r} ${cx + w},${cy - r} ${cx + w},${cy - w} ${cx + r},${cy - w} ` +
        `${cx + r},${cy + w} ${cx + w},${cy + w} ${cx + w},${cy + r} ${cx - w},${cy + r} ` +
        `${cx - w},${cy + w} ${cx - r},${cy + w} ${cx - r},${cy - w} ${cx - w},${cy - w}`
      );
      break;
    }
    case 'a': {
      const hw = r * 0.35;
      el = poly(
        `${cx - r},${cy - hw} ${cx + r * 0.05},${cy - hw} ${cx + r * 0.05},${cy - r} ` +
        `${cx + r},${cy} ${cx + r * 0.05},${cy + r} ${cx + r * 0.05},${cy + hw} ${cx - r},${cy + hw}`
      );
      break;
    }
    case '*': {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (i * 36 - 90) * Math.PI / 180;
        const ri = i % 2 === 0 ? r : r * 0.45;
        pts.push(`${(cx + ri * Math.cos(a)).toFixed(2)},${(cy + ri * Math.sin(a)).toFixed(2)}`);
      }
      el = poly(pts.join(' '));
      break;
    }
    default:
      el = `<circle cx="${cx}" cy="${cy}" r="${r}" ${fs}/>`;
  }

  if (rot === 0) return el;
  return `<g transform="rotate(${rot},${cx},${cy})">${el}</g>`;
}

/**
 * Render a shape spec inside its own <svg> at width w × height h.
 * @param {Array} spec   shape spec
 * @param {number} w     svg width (px)
 * @param {number} h     svg height (px)
 * @returns {string} full SVG markup
 */
export function cellSVG(spec, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.36;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;">${shapeEl(spec, cx, cy, r)}</svg>`;
}

/**
 * Render an absolute-positioned shape (for hidden-shape composites).
 * Spec format: [type, fill, rotation, cx, cy, r]
 * @param {Array} spec 6-element absolute spec
 * @returns {string} SVG element markup
 */
export function absShapeEl(spec) {
  const [type, fill, rot, cx, cy, r] = spec;
  return shapeEl([type, fill, rot], cx, cy, r);
}
