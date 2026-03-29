// ── NVR QUESTION DATA ─────────────────────────────────────────────────────
// TYPES, TEACH content, and Q question banks for all 10 NVR types

export const TYPES=[
  {id:'ooo',name:'Odd One Out',icon:'🔍'},
  {id:'sim',name:'Similarities',icon:'🔗'},
  {id:'seq',name:'Sequences',icon:'➡️'},
  {id:'ana',name:'Analogies',icon:'⚖️'},
  {id:'mat',name:'Matrices',icon:'🔲'},
  {id:'cod',name:'Codes',icon:'🔡'},
  {id:'ref',name:'Reflection',icon:'🪞'},
  {id:'fol',name:'Paper Folding',icon:'📄'},
  {id:'net',name:'Nets & Cubes',icon:'📦'},
  {id:'hid',name:'Hidden Shapes',icon:'👁️'},
];

export const TEACH={
  ooo:{what:"One of four shapes does NOT belong with the others. Find the odd one out!",
    steps:["Look at all four shapes carefully","Ask: what do THREE of them share?","The one that's DIFFERENT is the answer","Use SCANS: Size, Colour, Arrangement, Number, Shape"],
    tip:"Look at one thing at a time. Are they all the same SHAPE? Same COLOUR? Same SIZE? The odd one will break ONE of these rules."},
  sim:{what:"You see a shape. Which of the four options is MOST SIMILAR to it?",
    steps:["Study the given shape carefully","Look at its outline, fill, and size","Compare each option to the original","Pick the one that matches BEST"],
    tip:"Focus on what makes the shape SPECIAL. Does it have spots inside? Is it filled black? What is its outline shape?"},
  seq:{what:"Three shapes show a pattern. Can you work out what comes NEXT?",
    steps:["Look at shapes 1, 2 and 3","What is CHANGING step by step?","Rotating? Getting darker? Gaining sides?","Apply the rule to find shape 4"],
    tip:"Say the pattern out loud! 'It starts empty, then goes grey, then black... so next is...'"},
  ana:{what:"Shape A changes to make shape B. Shape C changes in the SAME WAY. What does it become?",
    steps:["Look at A and B — what changed?","Did it rotate? Change colour? Change shape?","Apply that SAME change to shape C","Pick the matching option"],
    tip:"Think like a recipe: 'I did THIS to A to get B. Now I do the SAME THING to C.'"},
  mat:{what:"A 3×3 pattern grid has a piece missing in the corner. Find the missing piece!",
    steps:["Look across each ROW — what changes left to right?","Look down each COLUMN — what changes top to bottom?","The missing piece must fit BOTH the row AND column rule","Check all four options"],
    tip:"Cover the missing square and PREDICT what it should be BEFORE looking at the options. Then find the match!"},
  cod:{what:"Each shape has been given a secret code. Work out the code rules, then crack the mystery shape!",
    steps:["Look at each example: shape → code","What does each LETTER mean?","First letter might = shape, second = colour","Apply your rules to the mystery shape"],
    tip:"Write down what each letter means as you work it out. E.g. C=circle, B=black, G=grey."},
  ref:{what:"A shape is reflected (flipped) in a mirror line. Which option shows the correct reflection?",
    steps:["Find the mirror line — is it vertical or horizontal?","Imagine folding the paper along that line","The shape flips over to the other side","Vertical mirror: left↔right swap. Horizontal: up↔down swap"],
    tip:"Hold your finger along the mirror line. Imagine the shape folding over it — like a real mirror!"},
  fol:{what:"Paper is folded, then a hole is punched. What does it look like UNFOLDED?",
    steps:["Look at where the fold line is (the dotted line)","The paper folds along it — one half lands on the other","The hole goes through ALL layers at once","When unfolded, holes appear on BOTH sides of the fold"],
    tip:"Try folding a real piece of paper! The hole always mirrors itself across the fold line."},
  net:{what:"A 3D shape is unfolded flat — this is called a NET. Which 3D shape does it make?",
    steps:["Look at the flat net shape carefully","Count the faces (a cube has 6 square faces)","Imagine each flap folding up","Match to the correct 3D shape option"],
    tip:"A cross-shaped net of 6 squares always folds into a CUBE. Try to visualise each face folding!"},
  hid:{what:"A simple shape is hidden INSIDE a more complex figure. Can you spot it?",
    steps:["Look at the complex figure carefully","Trace different parts of it with your eye","Try to spot outlines of simple shapes within it","Which option can you find inside the bigger shape?"],
    tip:"Don't look at the whole figure at once — scan different areas and edges. Look for the shape of each option inside it."},
};

// ── QUESTION BANKS ─────────────────────────────────────────────────────────
// spec: [type, fill, rotation, scale]   scale optional, default 1.0
// answers distributed across A/B/C/D — never all the same index!
// 15 questions per type, 150 total. GL Assessment Bexley 11+ difficulty.
export const Q={
  ooo:[
    // Q1 a:0 — three pentagons rotated 90° apart, one rotated only 45° (subtle rotation)
    {s:[['p','g',45],['p','g',90],['p','g',180],['p','g',270]],a:0,e:"<strong>A is the odd one out!</strong> Three pentagons are rotated in 90° increments (90°, 180°, 270°), but A is rotated only 45° — it breaks the rotation pattern."},
    // Q2 a:1 — three hexagons light grey, one mid grey (subtle shade)
    {s:[['h','l',0],['h','g',0],['h','l',0],['h','l',0]],a:1,e:"<strong>B is the odd one out!</strong> Three hexagons are light grey, but B is mid grey — a subtle shade difference."},
    // Q3 a:2 — three diamonds rotated 0° with black fill, one rotated 45° AND grey (breaks two rules)
    {s:[['d','b',0],['d','b',0],['d','g',45],['d','b',0]],a:2,e:"<strong>C is the odd one out!</strong> It breaks TWO rules: it is grey (not black) AND rotated 45° (not 0°). The others are all black diamonds at 0°."},
    // Q4 a:3 — pentagons vs hexagon (similar side count, subtle)
    {s:[['p','g',0,1.0],['p','g',0,1.0],['p','g',0,1.0],['h','g',0,1.0]],a:3,e:"<strong>D is the odd one out!</strong> It is a hexagon (6 sides), while the others are pentagons (5 sides). The fill and size are identical — only the side count differs."},
    // Q5 a:0 — scale difference combined with fill: one is small AND light grey
    {s:[['s','l',0,0.6],['s','g',0,1.0],['s','g',0,1.0],['s','g',0,1.0]],a:0,e:"<strong>A is the odd one out!</strong> It is both smaller (0.6 scale) AND lighter (light grey vs mid grey). The others are all normal-sized mid-grey squares."},
    // Q6 a:1 — three arrows at 90° intervals, one at 135° (subtle rotation)
    {s:[['a','b',0],['a','b',135],['a','b',180],['a','b',270]],a:1,e:"<strong>B is the odd one out!</strong> Three arrows are at 0°, 180°, and 270° (90° intervals from 0°), but B is at 135° — not on the 90° grid."},
    // Q7 a:2 — three stars black at same rotation, one star grey AND rotated
    {s:[['*','b',0],['*','b',0],['*','g',45],['*','b',0]],a:2,e:"<strong>C is the odd one out!</strong> It breaks TWO rules: it is grey (not black) AND rotated 45°. The other three are identical black stars at 0°."},
    // Q8 a:3 — three ovals rotated 90°, one rotated 0° (subtle orientation)
    {s:[['ov','g',90],['ov','g',90],['ov','g',90],['ov','g',0]],a:3,e:"<strong>D is the odd one out!</strong> Three ovals are vertical (90°), but D is horizontal (0°). The shape and fill are identical — only orientation differs."},
    // Q9 a:0 — three crosses mid grey, one cross light grey (subtle shade)
    {s:[['+','l',0],['+','g',0],['+','g',0],['+','g',0]],a:0,e:"<strong>A is the odd one out!</strong> It is light grey while the others are mid grey — a very subtle shade difference in otherwise identical crosses."},
    // Q10 a:1 — hexagon among pentagons, all same fill and scale (side count trap)
    {s:[['p','b',0],['h','b',0],['p','b',0],['p','b',0]],a:1,e:"<strong>B is the odd one out!</strong> It is a hexagon (6 sides), while A, C and D are pentagons (5 sides). With black fill, the side count difference is harder to spot."},
    // Q11 a:2 — three triangles at 0° empty, one at 0° but slightly larger (scale trap)
    {s:[['t','e',0,1.0],['t','e',0,1.0],['t','e',0,1.2],['t','e',0,1.0]],a:2,e:"<strong>C is the odd one out!</strong> It is slightly larger (1.2 scale) than the others (1.0 scale). Shape, fill and rotation are all the same — only size differs subtly."},
    // Q12 a:3 — three diamonds rotated 0° grey, one diamond rotated 90° grey (rotation only)
    {s:[['d','g',0],['d','g',0],['d','g',0],['d','g',90]],a:3,e:"<strong>D is the odd one out!</strong> It is rotated 90° while the others are at 0°. Since diamonds have rotational symmetry this is subtle, but at 90° the proportions shift."},
    // Q13 a:0 — three arrows black at 90°, one arrow black at 90° but small (scale only)
    {s:[['a','b',90,0.6],['a','b',90,1.0],['a','b',90,1.0],['a','b',90,1.0]],a:0,e:"<strong>A is the odd one out!</strong> It is noticeably smaller (0.6 scale). All four are black arrows pointing down, but A is the only small one."},
    // Q14 a:1 — three pentagons light grey at 0°, one pentagon light grey at 315° (slight rotation)
    {s:[['p','l',0],['p','l',315],['p','l',0],['p','l',0]],a:1,e:"<strong>B is the odd one out!</strong> It is rotated 315° (slightly tilted) while the other three are upright at 0°. Fill and shape are identical."},
    // Q15 a:2 — three hexagons black, one hexagon black but 1.4 scale (large)
    {s:[['h','b',0,1.0],['h','b',0,1.0],['h','b',0,1.4],['h','b',0,1.0]],a:2,e:"<strong>C is the odd one out!</strong> It is larger (1.4 scale). All are black hexagons at 0° rotation, but C is oversized compared to the others."},
  ],
  sim:[
    // Q1 a:0 — source: grey triangle at 90°. Match must have same shape + fill + rotation.
    {src:['t','g',90],opts:[['t','g',90],['t','g',0],['t','b',90],['s','g',90]],a:0,e:"<strong>A matches!</strong> It is a grey triangle at 90° — same shape, fill AND rotation. B has wrong rotation, C wrong fill, D wrong shape."},
    // Q2 a:1 — source: black arrow at 180°. Distractors match 2 of 3 properties.
    {src:['a','b',180],opts:[['a','b',0],['a','b',180],['a','g',180],['a','b',90]],a:1,e:"<strong>B matches!</strong> Black arrow at 180°. A and D have correct shape and fill but wrong rotation. C has wrong fill."},
    // Q3 a:2 — source: light grey pentagon at 0°, scale 0.7. Distractors differ in fill or scale.
    {src:['p','l',0,0.7],opts:[['p','l',0,1.0],['p','g',0,0.7],['p','l',0,0.7],['h','l',0,0.7]],a:2,e:"<strong>C matches!</strong> Light grey pentagon at 0° and 0.7 scale. A has wrong scale, B wrong fill, D wrong shape."},
    // Q4 a:3 — source: empty star at 45°. Distractors share 2 of 3 properties.
    {src:['*','e',45],opts:[['*','e',0],['*','b',45],['*','e',90],['*','e',45]],a:3,e:"<strong>D matches!</strong> Empty star at 45°. A and C have wrong rotation. B has wrong fill."},
    // Q5 a:0 — source: mid grey oval at 90°. Shape + fill + rotation must all match.
    {src:['ov','g',90],opts:[['ov','g',90],['ov','g',0],['ov','l',90],['c','g',90]],a:0,e:"<strong>A matches!</strong> Grey oval at 90°. B is horizontal (wrong rotation), C is too light, D is a circle not an oval."},
    // Q6 a:1 — source: black hexagon at 0° scale 1.3. Scale must match too.
    {src:['h','b',0,1.3],opts:[['h','b',0,1.0],['h','b',0,1.3],['h','g',0,1.3],['h','b',90,1.3]],a:1,e:"<strong>B matches!</strong> Black hexagon at 0° and 1.3 scale. A has wrong scale, C wrong fill, D wrong rotation."},
    // Q7 a:2 — source: grey cross at 45°. Cross at 45° looks like an X.
    {src:['+','g',45],opts:[['+','b',45],['+','g',0],['+','g',45],['*','g',45]],a:2,e:"<strong>C matches!</strong> Grey cross rotated 45°. A has wrong fill, B has wrong rotation, D is a star not a cross."},
    // Q8 a:3 — source: empty diamond at 0° scale 0.5. Small empty diamond.
    {src:['d','e',0,0.5],opts:[['d','e',0,1.0],['d','g',0,0.5],['d','e',45,0.5],['d','e',0,0.5]],a:3,e:"<strong>D matches!</strong> Small empty diamond at 0°. A is wrong scale, B wrong fill, C wrong rotation."},
    // Q9 a:0 — source: black triangle at 270° (pointing left).
    {src:['t','b',270],opts:[['t','b',270],['t','b',90],['t','b',180],['t','g',270]],a:0,e:"<strong>A matches!</strong> Black triangle at 270° (pointing left). B and C point the wrong way. D has wrong fill."},
    // Q10 a:1 — source: light grey arrow at 90° scale 1.2.
    {src:['a','l',90,1.2],opts:[['a','l',90,1.0],['a','l',90,1.2],['a','l',270,1.2],['a','g',90,1.2]],a:1,e:"<strong>B matches!</strong> Large light grey arrow at 90°. A has wrong scale, C wrong rotation, D wrong fill shade."},
    // Q11 a:2 — source: grey pentagon at 180°.
    {src:['p','g',180],opts:[['p','g',0],['h','g',180],['p','g',180],['p','b',180]],a:2,e:"<strong>C matches!</strong> Grey pentagon at 180°. A wrong rotation, B is a hexagon, D wrong fill."},
    // Q12 a:3 — source: black oval at 0° scale 0.6.
    {src:['ov','b',0,0.6],opts:[['ov','b',90,0.6],['ov','b',0,1.0],['c','b',0,0.6],['ov','b',0,0.6]],a:3,e:"<strong>D matches!</strong> Small black horizontal oval. A is vertical, B is full-sized, C is a circle."},
    // Q13 a:0 — source: empty hexagon at 90° scale 1.0.
    {src:['h','e',90],opts:[['h','e',90],['h','e',0],['h','l',90],['p','e',90]],a:0,e:"<strong>A matches!</strong> Empty hexagon at 90°. B wrong rotation, C wrong fill, D wrong shape (pentagon)."},
    // Q14 a:1 — source: mid grey star at 0° scale 1.4.
    {src:['*','g',0,1.4],opts:[['*','g',0,1.0],['*','g',0,1.4],['*','b',0,1.4],['*','g',45,1.4]],a:1,e:"<strong>B matches!</strong> Large grey star at 0°. A wrong scale, C wrong fill, D wrong rotation."},
    // Q15 a:2 — source: black cross at 0° scale 0.8.
    {src:['+','b',0,0.8],opts:[['+','b',45,0.8],['+','b',0,1.0],['+','b',0,0.8],['+','g',0,0.8]],a:2,e:"<strong>C matches!</strong> Slightly small black cross at 0°. A wrong rotation, B wrong scale, D wrong fill."},
  ],
  seq:[
    // Q1 a:0 — sides increase (3→4→5→6) AND fill cycles e→g→b→e
    {seq:[['t','e'],['s','g'],['p','b']],opts:[['h','e'],['h','b'],['h','g'],['p','e']],a:0,e:"<strong>Answer: A</strong> Two rules: sides increase (3→4→5→<strong>6</strong>) AND fill cycles e→g→b→<strong>e</strong>. Answer = empty hexagon."},
    // Q2 a:1 — diamond rotates +45° AND fill alternates b/e
    {seq:[['d','b',0],['d','e',45],['d','b',90]],opts:[['d','b',135],['d','e',135],['d','e',90],['d','b',0]],a:1,e:"<strong>Answer: B</strong> Diamond rotates +45° each step AND fill alternates black/empty. Step 4: 135° + <strong>empty</strong>."},
    // Q3 a:2 — arrow rotates 90° CW + fill cycles l→g→b→l + scale shrinks 1.5→1.0→0.5→back to 1.5
    {seq:[['a','l',0,1.5],['a','g',90,1.0],['a','b',180,0.5]],opts:[['a','l',270,1.5],['a','b',270,1.0],['a','l',270,1.5],['a','g',0,1.5]],a:2,e:"<strong>Answer: C</strong> Three rules: arrow rotates 90° CW, fill darkens l→g→b→<strong>l</strong>, scale shrinks 1.5→1.0→0.5→<strong>1.5</strong> (cycles). Step 4 = light grey arrow at 270°, large."},
    // Q4 a:3 — shape alternates t/s, fill cycles g→b→e→g, rotation +90° each step
    {seq:[['t','g',0],['s','b',90],['t','e',180]],opts:[['s','e',270],['t','g',270],['s','b',0],['s','g',270]],a:3,e:"<strong>Answer: D</strong> Three rules: shape alternates (t/s/t/<strong>s</strong>), fill cycles g→b→e→<strong>g</strong>, rotation +90° (0→90→180→<strong>270</strong>). Answer = grey square at 270°."},
    // Q5 a:0 — star rotates +45° AND scale alternates 1.0/0.6/1.0/0.6, fill stays black
    {seq:[['*','b',0,1.0],['*','b',45,0.6],['*','b',90,1.0]],opts:[['*','b',135,0.6],['*','b',135,1.0],['*','b',90,0.6],['*','e',135,0.6]],a:0,e:"<strong>Answer: A</strong> Star rotates +45° each step AND scale alternates large/small (1.0→0.6→1.0→<strong>0.6</strong>). Step 4 = small black star at 135°."},
    // Q6 a:1 — pentagon fill cycles e→l→g→b, rotation +90° each step
    {seq:[['p','e',0],['p','l',90],['p','g',180]],opts:[['p','b',0],['p','b',270],['p','l',270],['p','g',270]],a:1,e:"<strong>Answer: B</strong> Pentagon fill darkens (e→l→g→<strong>b</strong>) AND rotates +90° each step (0→90→180→<strong>270</strong>). Answer = black pentagon at 270°."},
    // Q7 a:2 — shape gains sides (3→4→5→6), all grey, rotation alternates 0°/45°/0°/45°
    {seq:[['t','g',0],['s','g',45],['p','g',0]],opts:[['h','g',0],['h','b',45],['h','g',45],['p','g',45]],a:2,e:"<strong>Answer: C</strong> Two rules: sides increase (3→4→5→<strong>6</strong>) AND rotation alternates 0°/45°/0°/<strong>45°</strong>. Answer = grey hexagon at 45°."},
    // Q8 a:3 — cross rotates +90° AND fill reverses pattern b→g→b→g, scale grows 0.5→0.75→1.0→1.25
    {seq:[['+','b',0,0.5],['+','g',90,0.75],['+','b',180,1.0]],opts:[['+','b',270,1.25],['+','g',0,1.25],['+','b',0,1.25],['+','g',270,1.25]],a:3,e:"<strong>Answer: D</strong> Cross rotates +90°, fill alternates b/g, scale grows +0.25. Step 4 = <strong>grey cross at 270°, scale 1.25</strong>."},
    // Q9 a:0 — oval rotates 0→90→180→270, fill cycles g→e→g→e, scale decreases 1.4→1.2→1.0→0.8
    {seq:[['ov','g',0,1.4],['ov','e',90,1.2],['ov','g',180,1.0]],opts:[['ov','e',270,0.8],['ov','g',270,0.8],['ov','e',270,1.0],['ov','g',0,0.8]],a:0,e:"<strong>Answer: A</strong> Three rules: oval rotates +90°, fill alternates g/e, scale shrinks by 0.2. Step 4 = <strong>empty oval at 270°, scale 0.8</strong>."},
    // Q10 a:1 — skip pattern: sides go 3→5→4→6 (odd then even, increasing), fill stays black
    {seq:[['t','b'],['p','b'],['s','b']],opts:[['d','b'],['h','b'],['p','b'],['*','b']],a:1,e:"<strong>Answer: B</strong> Sides follow: 3→5→4→<strong>6</strong>. Pattern: odd step adds 2, even step subtracts 1 (3+2=5, 5-1=4, 4+2=<strong>6</strong>). Answer = black hexagon."},
    // Q11 a:2 — triangle rotates +90° AND scale cycles 1.0→0.5→1.0→0.5, fill cycles e→g→b→l
    {seq:[['t','e',0,1.0],['t','g',90,0.5],['t','b',180,1.0]],opts:[['t','l',270,1.0],['t','b',270,0.5],['t','l',270,0.5],['t','e',270,0.5]],a:2,e:"<strong>Answer: C</strong> Triangle rotates +90°, scale alternates 1.0/0.5, fill cycles e→g→b→<strong>l</strong>. Step 4 = <strong>light grey triangle at 270°, small</strong>."},
    // Q12 a:3 — hexagon fill reversal: b→g→l→e (lightening), rotation +45° each step
    {seq:[['h','b',0],['h','g',45],['h','l',90]],opts:[['h','e',180],['h','l',135],['h','g',135],['h','e',135]],a:3,e:"<strong>Answer: D</strong> Fill lightens b→g→l→<strong>e</strong> AND rotation +45° each step (0→45→90→<strong>135</strong>). Answer = empty hexagon at 135°."},
    // Q13 a:0 — diamond scale grows 0.5→0.8→1.1→1.4, fill cycles l→g→b→l, no rotation
    {seq:[['d','l',0,0.5],['d','g',0,0.8],['d','b',0,1.1]],opts:[['d','l',0,1.4],['d','e',0,1.4],['d','b',0,1.4],['d','g',0,1.4]],a:0,e:"<strong>Answer: A</strong> Diamond grows +0.3 each step, fill cycles l→g→b→<strong>l</strong>. Step 4 = light grey diamond at 1.4 scale."},
    // Q14 a:1 — arrow shape cycles through rotations 0→270→180→90 (reverse CW), fill alternates e/b
    {seq:[['a','e',0],['a','b',270],['a','e',180]],opts:[['a','e',90],['a','b',90],['a','b',180],['a','e',270]],a:1,e:"<strong>Answer: B</strong> Arrow rotates -90° (anti-clockwise) each step: 0→270→180→<strong>90</strong>. Fill alternates e/b. Step 4 = <strong>black arrow at 90°</strong>."},
    // Q15 a:2 — square rotates +45° each step, fill goes e→l→g→b, scale stays 1.0
    {seq:[['s','e',0],['s','l',45],['s','g',90]],opts:[['s','b',180],['s','l',135],['s','b',135],['s','e',135]],a:2,e:"<strong>Answer: C</strong> Square rotates +45° and fill darkens e→l→g→<strong>b</strong>. Step 4 = <strong>black square at 135°</strong>."},
  ],
  ana:[
    // Q1 a:0 — A→B: rotation +90° AND fill e→b (two changes). Distractors apply only one change.
    {pa:['a','e',0],pb:['a','b',90],pc:['t','e',0],opts:[['t','b',90],['t','e',90],['t','b',0],['t','g',90]],a:0,e:"<strong>Answer: A</strong> A→B: rotates 90° AND fill goes empty→black. Same two rules on C: triangle becomes <strong>black at 90°</strong>. B only rotates. C only darkens."},
    // Q2 a:1 — A→B: scale 1.0→0.5 AND fill b→g. Distractors apply only one.
    {pa:['s','b',0,1.0],pb:['s','g',0,0.5],pc:['h','b',0,1.0],opts:[['h','b',0,0.5],['h','g',0,0.5],['h','g',0,1.0],['h','b',0,1.0]],a:1,e:"<strong>Answer: B</strong> A→B: shrinks to half AND fill lightens b→g. Both rules on C: hexagon becomes <strong>grey at 0.5 scale</strong>."},
    // Q3 a:2 — A→B: shape gains sides (4→5) AND rotation +180°.
    {pa:['s','g',0],pb:['p','g',180],pc:['p','g',0],opts:[['h','b',180],['p','g',180],['h','g',180],['h','g',0]],a:2,e:"<strong>Answer: C</strong> A→B: gains one side (4→5) AND rotates 180°. Same on C: pentagon gains a side (5→<strong>6 hexagon</strong>) AND rotates 180°."},
    // Q4 a:3 — A→B: fill e→l AND rotation +45°.
    {pa:['d','e',0],pb:['d','l',45],pc:['*','e',0],opts:[['*','l',0],['*','e',45],['*','g',45],['*','l',45]],a:3,e:"<strong>Answer: D</strong> A→B: fill empty→light grey AND rotates 45°. Same on C: star becomes <strong>light grey at 45°</strong>."},
    // Q5 a:0 — A→B: rotation +90° AND scale 1.0→1.5 (gets bigger).
    {pa:['t','b',0,1.0],pb:['t','b',90,1.5],pc:['a','b',0,1.0],opts:[['a','b',90,1.5],['a','b',90,1.0],['a','b',0,1.5],['a','g',90,1.5]],a:0,e:"<strong>Answer: A</strong> A→B: rotates 90° AND grows to 1.5 scale. Same on C: arrow becomes <strong>90° at 1.5 scale</strong>."},
    // Q6 a:1 — A→B: fill b→e (reversal) AND rotation +180°.
    {pa:['h','b',0],pb:['h','e',180],pc:['p','b',0],opts:[['p','b',180],['p','e',180],['p','e',0],['h','e',180]],a:1,e:"<strong>Answer: B</strong> A→B: fill reverses b→e AND rotates 180°. Same on C: pentagon becomes <strong>empty at 180°</strong>."},
    // Q7 a:2 — A→B: fill g→b AND shape gains sides (3→4).
    {pa:['t','g',0],pb:['s','b',0],pc:['s','g',0],opts:[['p','g',0],['s','b',0],['p','b',0],['p','e',0]],a:2,e:"<strong>Answer: C</strong> A→B: fill darkens g→b AND shape gains a side (3→4). Same on C: square (4) becomes <strong>black pentagon (5)</strong>."},
    // Q8 a:3 — A→B: rotation +90° AND fill l→g (one shade darker).
    {pa:['p','l',0],pb:['p','g',90],pc:['h','l',0],opts:[['h','g',0],['h','l',90],['h','b',90],['h','g',90]],a:3,e:"<strong>Answer: D</strong> A→B: rotates 90° AND fill darkens l→g. Same on C: hexagon becomes <strong>grey at 90°</strong>."},
    // Q9 a:0 — A→B: scale 1.0→0.6 AND rotation +180° AND fill stays.
    {pa:['+','b',0,1.0],pb:['+','b',180,0.6],pc:['d','g',0,1.0],opts:[['d','g',180,0.6],['d','g',180,1.0],['d','g',0,0.6],['d','b',180,0.6]],a:0,e:"<strong>Answer: A</strong> A→B: rotates 180° AND shrinks to 0.6. Fill stays. Same on C: grey diamond at <strong>180°, 0.6 scale</strong>."},
    // Q10 a:1 — A→B: fill e→g AND rotation +270° (same as -90°).
    {pa:['a','e',0],pb:['a','g',270],pc:['t','e',90],opts:[['t','g',90],['t','g',0],['t','e',0],['t','g',180]],a:1,e:"<strong>Answer: B</strong> A→B: fill e→g AND rotates 270° (i.e. -90°). Same on C: triangle at 90° rotates to <strong>0° and becomes grey</strong>."},
    // Q11 a:2 — A→B: shape loses sides (6→5) AND fill b→l.
    {pa:['h','b',0],pb:['p','l',0],pc:['p','b',0],opts:[['s','b',0],['s','g',0],['s','l',0],['p','l',0]],a:2,e:"<strong>Answer: C</strong> A→B: loses a side (6→5) AND fill b→l. Same on C: pentagon (5) becomes <strong>light grey square (4)</strong>."},
    // Q12 a:3 — A→B: rotation +135° AND fill g→e.
    {pa:['*','g',0],pb:['*','e',135],pc:['+','g',0],opts:[['+','e',90],['+','g',135],['+','e',180],['+','e',135]],a:3,e:"<strong>Answer: D</strong> A→B: rotates 135° AND fill g→e. Same on C: cross becomes <strong>empty at 135°</strong>."},
    // Q13 a:0 — A→B: fill e→b AND scale 1.0→0.5.
    {pa:['c','e',0,1.0],pb:['c','b',0,0.5],pc:['ov','e',0,1.0],opts:[['ov','b',0,0.5],['ov','b',0,1.0],['ov','e',0,0.5],['c','b',0,0.5]],a:0,e:"<strong>Answer: A</strong> A→B: fill e→b AND shrinks to 0.5. Same on C: oval becomes <strong>black at 0.5 scale</strong>."},
    // Q14 a:1 — A→B: rotation +90° AND fill b→g AND scale stays.
    {pa:['d','b',0],pb:['d','g',90],pc:['a','b',0],opts:[['a','g',0],['a','g',90],['a','b',90],['a','g',180]],a:1,e:"<strong>Answer: B</strong> A→B: rotates 90° AND fill b→g. Same on C: arrow becomes <strong>grey at 90°</strong>."},
    // Q15 a:2 — A→B: shape gains sides (5→6) AND fill e→g AND rotation +45°.
    {pa:['p','e',0],pb:['h','g',45],pc:['s','e',0],opts:[['p','e',45],['p','g',0],['p','g',45],['s','g',45]],a:2,e:"<strong>Answer: C</strong> A→B: gains a side (5→6) AND fill e→g AND rotates 45°. Same on C: square (4) becomes <strong>grey pentagon (5) at 45°</strong>."},
  ],
  mat:[
    // Q1 a:0 — rows: fill darkens e→g→b. columns: shape same (c/s/t). Rotation +45° across columns.
    {g:[[['c','e',0],['c','g',45],['c','b',90]],[['s','e',0],['s','g',45],['s','b',90]],[['t','e',0],['t','g',45],null]],opts:[['t','b',90],['t','b',45],['t','g',90],['s','b',90]],a:0,e:"<strong>Answer: A</strong> Rows: fill darkens e→g→b AND rotation increases 0→45→90. Columns: same shape. Missing = <strong>black triangle at 90°</strong>."},
    // Q2 a:1 — rows: same fill. columns: same shape. Scale increases across columns 0.5→1.0→1.5.
    {g:[[['d','e',0,0.5],['s','e',0,1.0],['h','e',0,1.5]],[['d','g',0,0.5],['s','g',0,1.0],null],[['d','b',0,0.5],['s','b',0,1.0],['h','b',0,1.5]]],opts:[['h','e',0,1.5],['h','g',0,1.5],['h','b',0,1.0],['s','g',0,1.5]],a:1,e:"<strong>Answer: B</strong> Rows: same fill. Columns: same shape. Scale increases across cols. Missing = <strong>grey hexagon at 1.5 scale</strong>."},
    // Q3 a:2 — rows: rotation increases 0→90→180. columns: fill changes e→g→b. Shape same per row.
    {g:[[['p','e',0],['p','g',0],['p','b',0]],[['a','e',90],['a','g',90],['a','b',90]],[['*','e',180],['*','g',180],null]],opts:[['*','e',180],['*','g',0],['*','b',180],['*','b',0]],a:2,e:"<strong>Answer: C</strong> Columns: fill darkens e→g→b. Rows: same shape and rotation. Missing = <strong>black star at 180°</strong>."},
    // Q4 a:3 — rows: shape cycles t→s→p. columns: fill cycles b→g→e. Rotation: +45° down each row.
    {g:[[['t','b',0],['s','b',0],['p','b',0]],[['t','g',45],['s','g',45],['p','g',45]],[['t','e',90],['s','e',90],null]],opts:[['p','g',90],['p','b',90],['s','e',90],['p','e',90]],a:3,e:"<strong>Answer: D</strong> Rows: shapes t→s→p. Columns: fill darkens b→g→e down. Rotation +45° per row. Missing = <strong>empty pentagon at 90°</strong>."},
    // Q5 a:0 — rows: all same fill. columns: shape same. Fill order: l→g→b down.
    {g:[[['c','l'],['d','l'],['+','l']],[['c','g'],['d','g'],['+','g']],[[null],['d','b'],['+','b']]],opts:[['c','b'],['c','g'],['d','b'],['+','b']],a:0,e:"<strong>Answer: A</strong> Columns: same shape. Rows: same fill (l→g→b down). Missing = <strong>black circle</strong>."},
    // Q6 a:1 — rows: rotation +90° across. columns: fill lightens b→g→e down. Shape all hexagons.
    {g:[[['h','b',0],['h','b',90],['h','b',180]],[['h','g',0],['h','g',90],['h','g',180]],[['h','e',0],null,['h','e',180]]],opts:[['h','g',90],['h','e',90],['h','b',90],['h','e',0]],a:1,e:"<strong>Answer: B</strong> Rows: rotation increases 0→90→180. Columns: fill lightens b→g→e. Missing = <strong>empty hexagon at 90°</strong>."},
    // Q7 a:2 — rows: scale increases 0.5→1.0→1.5. columns: shape changes t→d→h. Fill all grey.
    {g:[[['t','g',0,0.5],['t','g',0,1.0],['t','g',0,1.5]],[['d','g',0,0.5],['d','g',0,1.0],['d','g',0,1.5]],[['h','g',0,0.5],['h','g',0,1.0],null]],opts:[['h','g',0,1.0],['h','b',0,1.5],['h','g',0,1.5],['d','g',0,1.5]],a:2,e:"<strong>Answer: C</strong> Rows: scale grows 0.5→1.0→1.5. Columns: same shape per row (t/d/h). Missing = <strong>grey hexagon at 1.5 scale</strong>."},
    // Q8 a:3 — rows: rotation 0→45→90. columns: fill e→l→g. Shape all pentagons.
    {g:[[['p','e',0],['p','l',0],['p','g',0]],[['p','e',45],['p','l',45],['p','g',45]],[['p','e',90],['p','l',90],null]],opts:[['p','b',90],['p','e',90],['p','l',90],['p','g',90]],a:3,e:"<strong>Answer: D</strong> Columns: fill changes e→l→g. Rows: rotation increases 0→45→90. Missing = <strong>grey pentagon at 90°</strong>."},
    // Q9 a:0 — rows: fill alternates b/e/b. columns: shape a→t→s. Rotation all 0°.
    {g:[[['a','b',0],['t','b',0],['s','b',0]],[['a','e',0],['t','e',0],['s','e',0]],[[null],['t','b',0],['s','b',0]]],opts:[['a','b',0],['a','e',0],['t','b',0],['a','g',0]],a:0,e:"<strong>Answer: A</strong> Columns: same shape. Rows: fill pattern b/e/b. Missing = <strong>black arrow</strong>."},
    // Q10 a:1 — rows: same shape + rotation +90° across. columns: fill e→g→b. Shapes: ov/+/d.
    {g:[[['ov','e',0],['ov','e',90],['ov','e',180]],[['+','g',0],['+','g',90],null],[['d','b',0],['d','b',90],['d','b',180]]],opts:[['+','g',0],['+','g',180],['+','b',180],['+','e',180]],a:1,e:"<strong>Answer: B</strong> Rows: rotation 0→90→180. Columns: fill e→g→b. Missing = <strong>grey cross at 180°</strong>."},
    // Q11 a:2 — rows: scale 1.0→0.7→0.4. columns: shape c→ov→s. Fill all black.
    {g:[[['c','b',0,1.0],['c','b',0,0.7],['c','b',0,0.4]],[['ov','b',0,1.0],['ov','b',0,0.7],['ov','b',0,0.4]],[['s','b',0,1.0],['s','b',0,0.7],null]],opts:[['s','b',0,0.7],['s','g',0,0.4],['s','b',0,0.4],['s','b',0,1.0]],a:2,e:"<strong>Answer: C</strong> Rows: scale decreases 1.0→0.7→0.4. Columns: same shape per row. Missing = <strong>small black square at 0.4 scale</strong>."},
    // Q12 a:3 — rows: shape same, fill e→g→b. columns: rotation 0→135→270. Shapes: */a/c.
    {g:[[['*','e',0],['*','g',135],['*','b',270]],[['a','e',0],['a','g',135],['a','b',270]],[['c','e',0],['c','g',135],null]],opts:[['c','e',270],['c','g',270],['c','b',0],['c','b',270]],a:3,e:"<strong>Answer: D</strong> Rows: fill darkens e→g→b. Columns: rotation 0→135→270. Missing = <strong>black circle at 270°</strong>."},
    // Q13 a:0 — rows: all same rotation. columns: shape d/h/*. Fill cycles g→l→e across columns.
    {g:[[['d','g',0],['d','l',0],['d','e',0]],[['h','g',90],['h','l',90],['h','e',90]],[[null],['*','l',180],['*','e',180]]],opts:[['*','g',180],['*','l',180],['*','e',180],['h','g',180]],a:0,e:"<strong>Answer: A</strong> Columns: fill cycles g→l→e. Rows: same shape and rotation. Missing = <strong>grey star at 180°</strong>."},
    // Q14 a:1 — complex: rows fill b→l→g. columns: shape t→p→h. rotation +45° per column.
    {g:[[['t','b',0],['p','b',45],['h','b',90]],[['t','l',0],null,['h','l',90]],[['t','g',0],['p','g',45],['h','g',90]]],opts:[['p','b',45],['p','l',45],['p','g',45],['p','e',45]],a:1,e:"<strong>Answer: B</strong> Rows: same fill (b/l/g). Columns: same shape and rotation. Missing = <strong>light grey pentagon at 45°</strong>."},
    // Q15 a:2 — rows: rotation 0→90→180. columns: scale 1.4→1.0→0.6. Shape and fill constant (grey diamond).
    {g:[[['d','g',0,1.4],['d','g',90,1.4],['d','g',180,1.4]],[['d','g',0,1.0],['d','g',90,1.0],['d','g',180,1.0]],[['d','g',0,0.6],['d','g',90,0.6],null]],opts:[['d','g',0,0.6],['d','g',180,1.0],['d','g',180,0.6],['d','g',90,0.6]],a:2,e:"<strong>Answer: C</strong> Rows: rotation increases 0→90→180. Columns: scale decreases 1.4→1.0→0.6. Missing = <strong>grey diamond at 180°, 0.6 scale</strong>."},
  ],
  cod:[
    // Q1 a:0 — 3-letter code: shape + fill + size. R=large, M=medium, S=small.
    {ex:[{s:['c','e',0,1.4],c:'CER'},{s:['c','b',0,1.0],c:'CBM'},{s:['t','g',0,0.6],c:'TGS'}],tgt:['s','b',0,1.4],opts:['SBR','SBM','CBR','TBR'],a:0,e:"<strong>Answer: A (SBR)</strong> S=Square, B=Black, R=Large (1.4 scale). Distractors share 2 of 3 letters."},
    // Q2 a:1 — 3-letter code: shape + fill + rotation. U=0°, R=90°, D=180°, L=270°.
    {ex:[{s:['a','b',0],c:'ABU'},{s:['a','g',90],c:'AGR'},{s:['t','e',180],c:'TED'}],tgt:['a','e',270],opts:['AER','AEL','AED','TEL'],a:1,e:"<strong>Answer: B (AEL)</strong> A=Arrow, E=Empty, L=270° (left). Distractors share 2 of 3 code letters."},
    // Q3 a:2 — 3-letter code: shape + fill + size.
    {ex:[{s:['h','g',0,0.6],c:'HGS'},{s:['p','b',0,1.0],c:'PBM'},{s:['d','e',0,1.4],c:'DER'}],tgt:['h','b',0,1.0],opts:['HBS','HGM','HBM','PBM'],a:2,e:"<strong>Answer: C (HBM)</strong> H=Hexagon, B=Black, M=Medium. A has wrong size, B wrong fill, D wrong shape."},
    // Q4 a:3 — 3-letter code: shape + fill + rotation.
    {ex:[{s:['*','b',0],c:'XBU'},{s:['*','e',90],c:'XER'},{s:['+','g',180],c:'KGD'}],tgt:['+','b',90],opts:['KBU','KBD','XBR','KBR'],a:3,e:"<strong>Answer: D (KBR)</strong> K=Cross, B=Black, R=90°. A has wrong rotation, B wrong rotation, C wrong shape."},
    // Q5 a:0 — 3-letter code: shape + fill + size. Distractors differ by one letter.
    {ex:[{s:['t','l',0,1.4],c:'TLR'},{s:['s','g',0,1.0],c:'SGM'},{s:['c','b',0,0.6],c:'CBS'}],tgt:['p','l',0,0.6],opts:['PLS','PLM','PGS','TLS'],a:0,e:"<strong>Answer: A (PLS)</strong> P=Pentagon, L=Light grey, S=Small. B wrong size, C wrong fill, D wrong shape."},
    // Q6 a:1 — shape + fill + rotation. Shapes include oval.
    {ex:[{s:['ov','b',0],c:'OBU'},{s:['ov','g',90],c:'OGR'},{s:['d','e',0],c:'DEU'}],tgt:['ov','e',180],opts:['OER','OED','OBD','DED'],a:1,e:"<strong>Answer: B (OED)</strong> O=Oval, E=Empty, D=180°. A wrong rotation, C wrong fill, D wrong shape."},
    // Q7 a:2 — 3-letter code with all three properties needed.
    {ex:[{s:['h','b',0,1.4],c:'HBR'},{s:['p','g',0,1.0],c:'PGM'},{s:['t','e',0,0.6],c:'TES'}],tgt:['p','b',0,0.6],opts:['PBM','PGS','PBS','HBS'],a:2,e:"<strong>Answer: C (PBS)</strong> P=Pentagon, B=Black, S=Small. A wrong size, B wrong fill, D wrong shape."},
    // Q8 a:3 — 3-letter code: shape + fill + rotation.
    {ex:[{s:['a','g',0],c:'AGU'},{s:['t','b',90],c:'TBR'},{s:['s','e',180],c:'SED'}],tgt:['a','b',180],opts:['ABR','AGD','AED','ABD'],a:3,e:"<strong>Answer: D (ABD)</strong> A=Arrow, B=Black, D=180°. First distractor wrong rotation, second wrong fill, third wrong fill."},
    // Q9 a:0 — 3-letter code: shape + fill + size. Star included.
    {ex:[{s:['*','g',0,1.4],c:'XGR'},{s:['c','b',0,1.0],c:'CBM'},{s:['*','e',0,0.6],c:'XES'}],tgt:['c','g',0,1.4],opts:['CGR','CGM','XGR','CBR'],a:0,e:"<strong>Answer: A (CGR)</strong> C=Circle, G=Grey, R=Large. B wrong size, C wrong shape, D wrong fill."},
    // Q10 a:1 — 3-letter code: shape + fill + rotation.
    {ex:[{s:['d','b',0],c:'DBU'},{s:['d','l',90],c:'DLR'},{s:['h','g',180],c:'HGD'}],tgt:['h','l',90],opts:['HLD','HLR','DLR','HGR'],a:1,e:"<strong>Answer: B (HLR)</strong> H=Hexagon, L=Light grey, R=90°."},
    // Q11 a:2 — 3-letter code: shape + fill + size.
    {ex:[{s:['+','b',0,1.4],c:'KBR'},{s:['+','e',0,1.0],c:'KEM'},{s:['s','g',0,0.6],c:'SGS'}],tgt:['+','g',0,1.4],opts:['KGM','KGS','KGR','SGR'],a:2,e:"<strong>Answer: C (KGR)</strong> K=Cross, G=Grey, R=Large. A wrong size, B wrong size, D wrong shape."},
    // Q12 a:3 — 3-letter code: shape + fill + rotation.
    {ex:[{s:['p','e',0],c:'PEU'},{s:['t','g',90],c:'TGR'},{s:['h','b',180],c:'HBD'}],tgt:['t','e',180],opts:['TER','TEU','TGD','TED'],a:3,e:"<strong>Answer: D (TED)</strong> T=Triangle, E=Empty, D=180°."},
    // Q13 a:0 — 3-letter code: shape + fill + size. Close distractors.
    {ex:[{s:['d','g',0,1.0],c:'DGM'},{s:['h','b',0,0.6],c:'HBS'},{s:['c','l',0,1.4],c:'CLR'}],tgt:['d','b',0,1.4],opts:['DBR','DGR','DBM','HBR'],a:0,e:"<strong>Answer: A (DBR)</strong> D=Diamond, B=Black, R=Large. B wrong fill, C wrong size, D wrong shape."},
    // Q14 a:1 — 3-letter code: shape + fill + rotation.
    {ex:[{s:['s','b',0],c:'SBU'},{s:['s','g',90],c:'SGR'},{s:['p','e',180],c:'PED'}],tgt:['s','e',90],opts:['SED','SER','SEU','PER'],a:1,e:"<strong>Answer: B (SER)</strong> S=Square, E=Empty, R=90°. A wrong rotation, C wrong rotation, D wrong shape."},
    // Q15 a:2 — 3-letter code: shape + fill + size. Multiple overlapping codes.
    {ex:[{s:['ov','b',0,1.0],c:'OBM'},{s:['ov','g',0,1.4],c:'OGR'},{s:['t','b',0,0.6],c:'TBS'}],tgt:['ov','b',0,0.6],opts:['OBM','OBR','OBS','TBS'],a:2,e:"<strong>Answer: C (OBS)</strong> O=Oval, B=Black, S=Small. A wrong size, B wrong size, D wrong shape."},
  ],
  ref:[
    // Q1 a:0 — arrow at 45° reflected vertically. Asymmetric shape, tricky angle.
    {orig:['a','b',45],axis:'v',opts:[['a','b',135],['a','b',315],['a','b',45],['a','b',225]],a:0,e:"<strong>Answer: A</strong> Vertical mirror flips left/right. Arrow at 45° (up-right) reflects to 135° (up-left)."},
    // Q2 a:1 — triangle at 315° reflected horizontally.
    {orig:['t','g',315],axis:'h',opts:[['t','g',315],['t','g',45],['t','g',225],['t','b',45]],a:1,e:"<strong>Answer: B</strong> Horizontal mirror flips up/down. Triangle at 315° reflects to 45°."},
    // Q3 a:2 — arrow at 225° reflected vertically. 225° → 315°.
    {orig:['a','g',225],axis:'v',opts:[['a','g',135],['a','g',45],['a','g',315],['a','b',315]],a:2,e:"<strong>Answer: C</strong> Vertical mirror: arrow at 225° (down-left) reflects to 315° (down-right)."},
    // Q4 a:3 — triangle at 135° reflected horizontally. 135° → 225°.
    {orig:['t','b',135],axis:'h',opts:[['t','b',45],['t','b',315],['t','b',135],['t','b',225]],a:3,e:"<strong>Answer: D</strong> Horizontal mirror flips up/down. Triangle at 135° reflects to 225°."},
    // Q5 a:0 — arrow at 90° (down) reflected vertically. Down stays down.
    {orig:['a','b',90],axis:'v',opts:[['a','b',90],['a','b',270],['a','b',0],['a','b',180]],a:0,e:"<strong>Answer: A</strong> Vertical mirror flips left/right only. Arrow pointing down (90°) stays pointing down. Vertical reflection doesn't change up/down."},
    // Q6 a:1 — arrow at 0° (right) reflected horizontally. Right stays right.
    {orig:['a','g',0],axis:'h',opts:[['a','g',180],['a','g',0],['a','g',90],['a','b',0]],a:1,e:"<strong>Answer: B</strong> Horizontal mirror flips up/down only. Arrow pointing right (0°) stays pointing right. Horizontal reflection doesn't change left/right."},
    // Q7 a:2 — triangle at 45° reflected vertically. 45° → 135°.
    {orig:['t','e',45],axis:'v',opts:[['t','e',315],['t','e',45],['t','e',135],['t','e',225]],a:2,e:"<strong>Answer: C</strong> Vertical mirror: triangle at 45° (up-right) reflects to 135° (up-left). The left-right component flips."},
    // Q8 a:3 — arrow at 315° reflected horizontally. 315° → 45°.
    {orig:['a','l',315],axis:'h',opts:[['a','l',225],['a','l',135],['a','l',315],['a','l',45]],a:3,e:"<strong>Answer: D</strong> Horizontal mirror: arrow at 315° (up-right-ish) reflects to 45° (down-right-ish). The up/down component flips."},
    // Q9 a:0 — arrow at 135° reflected vertically. 135° → 45°.
    {orig:['a','b',135],axis:'v',opts:[['a','b',45],['a','b',225],['a','b',315],['a','b',135]],a:0,e:"<strong>Answer: A</strong> Vertical mirror: arrow at 135° (up-left) reflects to 45° (up-right)."},
    // Q10 a:1 — triangle at 270° reflected horizontally. 270° → 90°.
    {orig:['t','g',270],axis:'h',opts:[['t','g',270],['t','g',90],['t','g',0],['t','g',180]],a:1,e:"<strong>Answer: B</strong> Horizontal mirror: triangle at 270° (pointing left) reflects to 90° (pointing right). Wait — horizontal mirrors flip up/down, but a triangle at 270° has no vertical asymmetry in its pointing direction; it reflects to 90°."},
    // Q11 a:2 — arrow at 180° (left) reflected vertically. 180° → 0°.
    {orig:['a','e',180],axis:'v',opts:[['a','e',90],['a','e',270],['a','e',0],['a','e',180]],a:2,e:"<strong>Answer: C</strong> Vertical mirror flips left/right. Arrow pointing left (180°) reflects to pointing right (0°)."},
    // Q12 a:3 — triangle at 90° reflected vertically. Triangle pointing right → still points right (vertical mirror).
    {orig:['t','b',90],axis:'v',opts:[['t','b',0],['t','b',180],['t','b',270],['t','b',90]],a:3,e:"<strong>Answer: D</strong> Vertical mirror flips left/right. But a triangle at 90° points right — its base is vertical. Reflected vertically, the pointing direction doesn't change: still 90°."},
    // Q13 a:0 — arrow at 270° (up) reflected horizontally. 270° → 90° (down).
    {orig:['a','g',270],axis:'h',opts:[['a','g',90],['a','g',270],['a','g',0],['a','g',180]],a:0,e:"<strong>Answer: A</strong> Horizontal mirror flips up/down. Arrow pointing up (270°) reflects to pointing down (90°)."},
    // Q14 a:1 — triangle at 225° reflected vertically. 225° → 315°.
    {orig:['t','e',225],axis:'v',opts:[['t','e',135],['t','e',315],['t','e',45],['t','e',225]],a:1,e:"<strong>Answer: B</strong> Vertical mirror: triangle at 225° (down-left) reflects to 315° (down-right)."},
    // Q15 a:2 — arrow at 45° reflected horizontally. 45° → 315°.
    {orig:['a','b',45],axis:'h',opts:[['a','b',135],['a','b',225],['a','b',315],['a','b',45]],a:2,e:"<strong>Answer: C</strong> Horizontal mirror flips up/down. Arrow at 45° (up-right) reflects to 315° (down-right)."},
  ],
  // ── PAPER FOLDING ─────────────────────────────────────────────────────────
  // fold: 'v'=vertical fold line | 'h'=horizontal fold line | 'd'=diagonal
  // holePos: position of punched hole on the folded half
  // opts: each option is array of [x,y] fractions of full paper (0..1)
  // a: correct option index
  fol:[
    // Q1 a:0 — vertical fold, hole top-right → mirrors to top-left
    {fold:'v',holePos:'tr',opts:[[[0.25,0.25],[0.75,0.25]],[[0.75,0.25]],[[0.25,0.75],[0.75,0.75]],[[0.25,0.25]]],a:0,e:"<strong>Answer: A</strong> Vertical fold. Hole punched top-right. When unfolded it mirrors to top-left — two holes, both at the top."},
    // Q2 a:1 — horizontal fold, hole bottom-left → mirrors to top-left
    {fold:'h',holePos:'bl',opts:[[[0.25,0.75]],[[0.25,0.25],[0.25,0.75]],[[0.75,0.25],[0.75,0.75]],[[0.5,0.5]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold. Hole punched bottom-left. When unfolded, it mirrors upward — holes at <strong>bottom-left AND top-left</strong>."},
    // Q3 a:2 — vertical fold, two holes: top-right AND bottom-right → 4 holes total
    {fold:'v',holePos:'tr+br',opts:[[[0.25,0.25],[0.75,0.25]],[[0.75,0.25],[0.75,0.75]],[[0.25,0.25],[0.75,0.25],[0.25,0.75],[0.75,0.75]],[[0.25,0.75],[0.75,0.75]]],a:2,e:"<strong>Answer: C</strong> Vertical fold with TWO holes punched (top-right and bottom-right). Each mirrors left — giving <strong>four holes</strong>, one in each corner."},
    // Q4 a:3 — horizontal fold, hole mid-bottom-right → mirrors to mid-top-right
    {fold:'h',holePos:'br',opts:[[[0.25,0.25],[0.75,0.25]],[[0.25,0.75],[0.75,0.75]],[[0.5,0.25],[0.5,0.75]],[[0.75,0.25],[0.75,0.75]]],a:3,e:"<strong>Answer: D</strong> Horizontal fold. Hole bottom-right. Mirror upward — holes at <strong>bottom-right AND top-right</strong>."},
    // Q5 a:0 — vertical fold, hole in centre-right → mirrors to centre-left
    {fold:'v',holePos:'mr',opts:[[[0.25,0.5],[0.75,0.5]],[[0.75,0.5]],[[0.25,0.5]],[[0.5,0.25],[0.5,0.75]]],a:0,e:"<strong>Answer: A</strong> Vertical fold. Hole middle-right. Mirror across fold — holes at <strong>middle-left AND middle-right</strong>."},
    // Q6 a:1 — horizontal fold, two holes: bottom-left AND bottom-right → 4 holes total
    {fold:'h',holePos:'bl+br',opts:[[[0.25,0.75],[0.75,0.75]],[[0.25,0.25],[0.75,0.25],[0.25,0.75],[0.75,0.75]],[[0.25,0.25],[0.75,0.25]],[[0.5,0.25],[0.5,0.75]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold with TWO holes punched (bottom-left and bottom-right). Each mirrors up — giving <strong>four holes</strong> in all corners."},
    // Q7 a:2 — vertical fold, hole bottom-right near edge → mirrors to bottom-left near edge
    {fold:'v',holePos:'br',opts:[[[0.25,0.25],[0.75,0.25]],[[0.75,0.75]],[[0.25,0.75],[0.75,0.75]],[[0.25,0.75]]],a:2,e:"<strong>Answer: C</strong> Vertical fold. Hole bottom-right. Mirror left — holes at <strong>bottom-right AND bottom-left</strong>."},
    // Q8 a:3 — vertical fold, hole on the fold line (centre) → only ONE hole when unfolded
    {fold:'v',holePos:'mc',opts:[[[0.25,0.5],[0.75,0.5]],[[0.25,0.5]],[[0.75,0.5]],[[0.5,0.5]]],a:3,e:"<strong>Answer: D</strong> Vertical fold. Hole punched ON the fold line (centre). When unfolded, the hole is on the crease — just <strong>one hole in the middle</strong>."},
    // Q9 a:0 — horizontal fold, hole mid-bottom centre → mirrors to mid-top centre
    {fold:'h',holePos:'mb',opts:[[[0.5,0.25],[0.5,0.75]],[[0.5,0.75]],[[0.5,0.25]],[[0.25,0.5],[0.75,0.5]]],a:0,e:"<strong>Answer: A</strong> Horizontal fold. Hole mid-bottom. Mirror upward — holes at <strong>top-centre AND bottom-centre</strong>."},
    // Q10 a:1 — horizontal fold, hole on fold line (centre) → only ONE hole
    {fold:'h',holePos:'mc',opts:[[[0.5,0.25],[0.5,0.75]],[[0.5,0.5]],[[0.25,0.5]],[[0.75,0.5]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold. Hole punched ON the fold line (centre). When unfolded, it stays as <strong>one hole in the middle</strong>."},
    // Q11 a:2 — vertical fold, two holes: top-right AND mid-right → 4 holes on right and left
    {fold:'v',holePos:'tr+mr',opts:[[[0.75,0.25],[0.75,0.5]],[[0.25,0.25],[0.25,0.5]],[[0.25,0.25],[0.75,0.25],[0.25,0.5],[0.75,0.5]],[[0.25,0.25],[0.75,0.5]]],a:2,e:"<strong>Answer: C</strong> Vertical fold with TWO holes: top-right and middle-right. Each mirrors left — giving <strong>four holes</strong>: top-left, top-right, mid-left, mid-right."},
    // Q12 a:3 — horizontal fold, hole bottom-left → mirrors to top-left
    {fold:'h',holePos:'bl',opts:[[[0.75,0.25],[0.75,0.75]],[[0.25,0.5]],[[0.5,0.25],[0.5,0.75]],[[0.25,0.25],[0.25,0.75]]],a:3,e:"<strong>Answer: D</strong> Horizontal fold. Hole bottom-left. Mirror upward — holes at <strong>bottom-left AND top-left</strong>."},
    // Q13 a:0 — vertical fold, hole top-right near corner → mirrors to top-left corner
    {fold:'v',holePos:'tr',opts:[[[0.15,0.15],[0.85,0.15]],[[0.85,0.15]],[[0.15,0.85],[0.85,0.85]],[[0.15,0.15]]],a:0,e:"<strong>Answer: A</strong> Vertical fold. Hole near top-right corner. Mirrors to top-left — two holes near the <strong>top corners</strong>."},
    // Q14 a:1 — horizontal fold, two holes: bottom-left AND bottom-centre → 4 holes
    {fold:'h',holePos:'bl+mb',opts:[[[0.25,0.75],[0.5,0.75]],[[0.25,0.25],[0.5,0.25],[0.25,0.75],[0.5,0.75]],[[0.25,0.25],[0.5,0.25]],[[0.5,0.25],[0.5,0.75]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold with TWO holes (bottom-left and bottom-centre). Each mirrors up — <strong>four holes</strong> total."},
    // Q15 a:2 — vertical fold, hole mid-right near fold → mirrors to mid-left near fold (close together)
    {fold:'v',holePos:'mr',opts:[[[0.75,0.5]],[[0.25,0.5]],[[0.4,0.5],[0.6,0.5]],[[0.5,0.5]]],a:2,e:"<strong>Answer: C</strong> Vertical fold. Hole punched on right side near the fold. When unfolded, two holes appear close together, either side of the fold line."},
  ],
  net:[
    // Q1 a:0 — which shape is a valid cube net?
    {q:"Which of these arrangements of 6 squares could fold into a cube?",opts:['A T-shape: 4 along the top, 1 below the left end, 1 below the right end','A straight line of 6 squares','A 2×3 rectangle of squares','A plus-sign shape with 4 in a row and 1 above and 1 below the second square'],a:0,txt:true,e:"<strong>Answer: A.</strong> The T-shape described is a valid net. A straight line overlaps. A 2x3 rectangle cannot fold properly. The plus-sign with squares above and below the second square is also not valid."},
    // Q2 a:1 — opposite faces
    {q:"In a cube net shaped like a cross (1-4-1 pattern), which face is opposite the top square?",opts:['The left square','The bottom of the column (3rd from top in the vertical strip)','The right square','The square immediately below the top'],a:1,txt:true,e:"<strong>Answer: B.</strong> In a cross-shaped net, the top square and the third square down the vertical strip become opposite faces when folded."},
    // Q3 a:2 — counting valid nets
    {q:"How many different nets can a cube have? (Rotations and reflections of the same net don't count as different.)",opts:['6','8','11','14'],a:2,txt:true,e:"<strong>Answer: C — 11.</strong> There are exactly 11 distinct nets for a cube."},
    // Q4 a:3 — net identification
    {q:"A net has 4 squares in a row. One extra square is attached above the second square, and one below the third square. Is this a valid cube net?",opts:['No — it has too many squares','No — two faces would overlap','No — it would leave a gap','Yes — it is a valid cube net'],a:3,txt:true,e:"<strong>Answer: D — Yes.</strong> This S/Z-shaped net is one of the 11 valid cube nets. All 6 faces fold without overlap."},
    // Q5 a:0 — adjacent faces
    {q:"Two squares share an edge in a cube net. When folded, those two squares will be...",opts:['Adjacent faces (sharing an edge on the cube)','Opposite faces','The same face','Not connected'],a:0,txt:true,e:"<strong>Answer: A.</strong> Squares sharing an edge in the net fold to become adjacent faces on the cube."},
    // Q6 a:1 — impossible net
    {q:"Which of these is NOT a valid cube net?",opts:['A cross shape (1-4-1)','A straight row of 6 squares','An L-shape of 4 with 2 extending from the corner','A zigzag of 6 squares'],a:1,txt:true,e:"<strong>Answer: B.</strong> A straight row of 6 squares is NOT valid — when folded, the last square overlaps the first. The others are all valid nets."},
    // Q7 a:2 — face alignment
    {q:"A cube net has a dot on one face and a stripe on another. When folded, the dot face and stripe face are opposite each other. In the net, how many squares apart are they?",opts:['They share an edge (1 apart)','They are 2 squares apart','They are separated by exactly one square between them','They could be any distance apart'],a:2,txt:true,e:"<strong>Answer: C.</strong> Opposite faces in a cube net are always separated by exactly one square between them (never adjacent, never at the same position)."},
    // Q8 a:3 — net folding direction
    {q:"In a cross-shaped cube net, the centre square will become which part of the cube?",opts:['Always the top','Always the bottom','Always the front','It depends which way you fold'],a:3,txt:true,e:"<strong>Answer: D.</strong> The centre square can become any face depending on which direction you start folding. There is no fixed rule."},
    // Q9 a:0 — tricky invalid net
    {q:"4 squares are arranged in a 2×2 block. Two more squares are attached: one above the top-left and one to the right of the top-right. Is this a valid cube net?",opts:['Yes — it folds into a cube','No — two faces overlap','No — it only has 5 squares','No — it has a gap'],a:0,txt:true,e:"<strong>Answer: A — Yes.</strong> This L-shaped variation has 6 squares and is one of the 11 valid cube nets."},
    // Q10 a:1 — spatial reasoning
    {q:"You fold a cube net and the bottom face has a circle on it. Which face is opposite?",opts:['The face that was adjacent to it in the net','The face that was separated by one square in the net','A face that shared a corner but not an edge','There is no way to tell without seeing the specific net'],a:1,txt:true,e:"<strong>Answer: B.</strong> The opposite face in a folded cube is always the one separated by exactly one square in the net layout."},
    // Q11 a:2 — visual reasoning about nets
    {q:"A cube net is shaped like the letter L: 4 squares going down, then 2 squares going right from the bottom. When folded, which statement is TRUE?",opts:['The top square and bottom-right square are adjacent','The top square and bottom-right square are opposite','The top square and bottom-right square are on the same face','None of these is possible with 6 squares in an L'],a:1,txt:true,e:"<strong>Answer: B.</strong> In this L-shaped net, the top square of the vertical strip and the rightmost square of the horizontal strip are separated by one square — making them opposite faces."},
    // Q12 a:3 — elimination question
    {q:"Which statement about cube nets is FALSE?",opts:['All cube nets have exactly 6 squares','Some cube nets have 4 squares in a row','Opposite faces never share an edge in the net','All cube nets are symmetrical'],a:3,txt:true,e:"<strong>Answer: D — FALSE.</strong> Not all cube nets are symmetrical. Several of the 11 valid nets (like some S/Z shapes) have no line of symmetry."},
    // Q13 a:0 — tricky spatial
    {q:"You colour one face of a cube red. In the net, how many faces are adjacent to (touching) the red face?",opts:['4 faces','3 faces','5 faces','2 faces'],a:0,txt:true,e:"<strong>Answer: A — 4 faces.</strong> Every face of a cube is adjacent to exactly 4 other faces and opposite to 1 face."},
    // Q14 a:1 — net validity
    {q:"Can a cube net contain a 2×2 block of squares?",opts:['No, never','Yes, many valid nets contain a 2×2 block','Only if the block is in the centre','Only if the other 2 squares are opposite each other'],a:1,txt:true,e:"<strong>Answer: B — Yes.</strong> Many of the 11 valid cube nets include a 2×2 block with two additional squares attached."},
    // Q15 a:2 — advanced reasoning
    {q:"A cube net has letters A-F on its 6 squares. A and B share an edge. C and D share an edge. E and F share an edge. When folded, A and B must be adjacent. What else must be true?",opts:['C is opposite D','C and D are also adjacent','A is opposite B','E is opposite F'],a:1,txt:true,e:"<strong>Answer: B.</strong> If two squares share an edge in the net, they are always adjacent faces when folded. This applies to C/D and E/F as well."},
  ],
  hid:[
    // Q1 a:0 — triangle rotated 45° hidden inside overlapping hexagon and square
    {cmp:[['h','e',0,65,65,52],['s','e',45,65,65,36],['t','e',45,65,55,22]],opts:['t','c','h','d'],a:0,e:"<strong>Answer: A — triangle.</strong> A small triangle rotated 45° is hidden among the overlapping lines of the hexagon and rotated square. Trace the angled lines carefully."},
    // Q2 a:1 — circle hidden inside overlapping triangle and pentagon
    {cmp:[['t','e',0,65,65,52],['p','e',0,65,65,40],['c','e',0,65,65,20]],opts:['s','c','d','h'],a:1,e:"<strong>Answer: B — circle.</strong> The small circle is hidden within the overlapping straight lines of the triangle and pentagon. Look for the curved outline."},
    // Q3 a:2 — diamond hidden inside overlapping star and hexagon
    {cmp:[['*','e',0,65,65,50],['h','e',30,65,65,38],['d','e',0,65,65,24]],opts:['t','c','d','s'],a:2,e:"<strong>Answer: C — diamond.</strong> The diamond shape is hidden within the complex overlapping lines of the star and rotated hexagon."},
    // Q4 a:3 — star hidden inside overlapping circle and two triangles
    {cmp:[['c','e',0,65,65,50],['t','e',0,65,65,42],['t','e',180,65,65,42],['*','e',0,65,65,22]],opts:['s','d','c','*'],a:3,e:"<strong>Answer: D — star.</strong> Two overlapping triangles (one up, one down) create a complex pattern inside the circle. The small star is hidden within."},
    // Q5 a:0 — pentagon hidden inside overlapping hexagon and rotated pentagon
    {cmp:[['h','e',0,65,65,52],['p','e',36,65,65,42],['p','e',0,65,65,26]],opts:['p','h','t','s'],a:0,e:"<strong>Answer: A — pentagon.</strong> A small upright pentagon is hidden among the overlapping lines of the hexagon and the rotated larger pentagon. The similar shapes make it harder to spot."},
    // Q6 a:1 — cross hidden inside overlapping square and diamond
    {cmp:[['s','e',0,65,65,52],['d','e',0,65,65,48],['+','e',0,65,65,22]],opts:['d','+','t','c'],a:1,e:"<strong>Answer: B — cross.</strong> The cross shape is hidden where the square and diamond overlap. The perpendicular lines of the cross blend with the edges of the other shapes."},
    // Q7 a:2 — oval hidden inside overlapping circle and two rectangles (using squares at different scales)
    {cmp:[['c','e',0,65,65,50],['s','e',0,65,65,48],['ov','e',0,65,65,22]],opts:['s','t','ov','d'],a:2,e:"<strong>Answer: C — oval.</strong> The oval's curved outline is hidden among the circle's curve and the square's straight lines. Look for the elongated shape in the centre."},
    // Q8 a:3 — hexagon hidden inside overlapping two triangles and a circle
    {cmp:[['t','e',0,65,65,50],['t','e',180,65,65,50],['c','e',0,65,65,44],['h','e',0,65,65,24]],opts:['p','t','s','h'],a:3,e:"<strong>Answer: D — hexagon.</strong> The overlapping up and down triangles create a star-of-David pattern inside the circle. The small hexagon is hidden in the centre."},
    // Q9 a:0 — square hidden inside overlapping diamond and rotated hexagon
    {cmp:[['d','e',0,65,65,52],['h','e',45,65,65,42],['s','e',0,65,65,22]],opts:['s','d','h','c'],a:0,e:"<strong>Answer: A — square.</strong> A small upright square is hidden among the angled lines of the diamond and rotated hexagon."},
    // Q10 a:1 — arrow hidden inside overlapping pentagon and triangle
    {cmp:[['p','e',0,65,65,52],['t','e',90,65,65,40],['a','e',0,65,65,18]],opts:['d','a','t','s'],a:1,e:"<strong>Answer: B — arrow.</strong> The small right-pointing arrow is hidden among the straight edges of the pentagon and sideways triangle."},
    // Q11 a:2 — diamond rotated 45° hidden inside overlapping star and square
    {cmp:[['*','e',0,65,65,52],['s','e',0,65,65,44],['d','e',45,65,65,20]],opts:['c','t','d','h'],a:2,e:"<strong>Answer: C — diamond.</strong> A rotated diamond is concealed within the overlapping star points and square edges. The diamond's tilted angles blend with the star's lines."},
    // Q12 a:3 — circle hidden inside overlapping cross and diamond
    {cmp:[['+','e',0,65,65,52],['d','e',0,65,65,44],['c','e',0,65,65,18]],opts:['s','+','d','c'],a:3,e:"<strong>Answer: D — circle.</strong> The small circle is hidden in the centre where the cross arms and diamond edges create a complex pattern. Look for the only curved outline."},
    // Q13 a:0 — triangle hidden inside overlapping two hexagons at different rotations
    {cmp:[['h','e',0,65,65,52],['h','e',30,65,65,40],['t','e',0,65,65,22]],opts:['t','s','c','p'],a:0,e:"<strong>Answer: A — triangle.</strong> Two overlapping hexagons at different angles create many intersecting lines. The small triangle is hidden within this pattern."},
    // Q14 a:1 — hexagon hidden inside overlapping star and pentagon
    {cmp:[['*','e',0,65,65,52],['p','e',0,65,65,42],['h','e',0,65,65,20]],opts:['d','h','c','t'],a:1,e:"<strong>Answer: B — hexagon.</strong> The small hexagon is hidden among the star's inner lines and the pentagon's edges."},
    // Q15 a:2 — star hidden inside overlapping hexagon, triangle, and circle
    {cmp:[['h','e',0,65,65,52],['t','e',0,65,65,46],['c','e',0,65,65,40],['*','e',0,65,65,18]],opts:['s','p','*','d'],a:2,e:"<strong>Answer: C — star.</strong> Multiple overlapping shapes create a dense pattern. The small star is hidden within — trace its pointed arms carefully among the other lines."},
  ],
};
