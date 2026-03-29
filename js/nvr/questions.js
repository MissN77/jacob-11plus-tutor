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
export const Q={
  ooo:[
    // a:0 — curved circle among angular polygons
    {s:[['c','e'],['t','e'],['s','e'],['d','e']],a:0,e:"<strong>A is the odd one out!</strong> It's a circle — it has no straight sides. All the others are polygons with straight edges."},
    // a:1 — one EMPTY shape among three FILLED shapes
    {s:[['h','b'],['h','e'],['h','b'],['h','b']],a:1,e:"<strong>B is the odd one out!</strong> It is empty/white. All the others are filled black."},
    // a:2 — one triangle pointing DOWN among up-pointing triangles
    {s:[['t','b',0],['t','b',0],['t','b',180],['t','b',0]],a:2,e:"<strong>C is the odd one out!</strong> The triangle points DOWN. All the others point upward."},
    // a:3 — one SMALL shape among normal-sized (using scale)
    {s:[['s','g'],['s','g'],['s','g'],['s','g',0,0.5]],a:3,e:"<strong>D is the odd one out!</strong> It is much smaller than the others. All shapes are the same type but D is half-sized."},
    // a:0 — square (4 sides) among pentagons/hexagons (5-6 sides)
    {s:[['s','e'],['p','e'],['h','e'],['p','e']],a:0,e:"<strong>A is the odd one out!</strong> It's a square — it has only 4 sides. All the others have 5 or 6 sides."},
    // a:1 — one arrow pointing LEFT among arrows pointing RIGHT
    {s:[['a','b',0],['a','b',180],['a','b',0],['a','b',0]],a:1,e:"<strong>B is the odd one out!</strong> The arrow points LEFT (180°). All the others point right."},
    // a:2 — one GREY shape among black shapes
    {s:[['+','b'],['+','b'],['+','g'],['+','b']],a:2,e:"<strong>C is the odd one out!</strong> It is grey. All the others are filled black."},
    // a:3 — one shape that is light-grey among dark-grey shapes
    {s:[['d','g'],['d','g'],['d','g'],['d','l']],a:3,e:"<strong>D is the odd one out!</strong> It is light grey — noticeably lighter than the others, which are mid-grey."},
    // a:0 — one LARGE shape among normal-sized (uses scale)
    {s:[['c','b',0,1.5],['c','b'],['c','b'],['c','b']],a:0,e:"<strong>A is the odd one out!</strong> It is larger than the others. All the circles are the same fill but A is bigger."},
    // a:1 — 5-pointed star among pentagons
    {s:[['p','g'],['*','g'],['p','g'],['p','g']],a:1,e:"<strong>B is the odd one out!</strong> It's a star. All the others are regular pentagons with 5 straight sides."},
    // a:2 — empty oval among filled ovals
    {s:[['ov','b'],['ov','b'],['ov','e'],['ov','b']],a:2,e:"<strong>C is the odd one out!</strong> It is empty/white. All the others are filled black."},
    // a:3 — one hexagon among diamonds
    {s:[['d','g'],['d','g'],['d','g'],['h','g']],a:3,e:"<strong>D is the odd one out!</strong> It's a hexagon (6 sides). All the others are diamonds (4 sides)."},
  ],
  sim:[
    // a:1
    {src:['c','b'],opts:[['c','e'],['c','b'],['s','b'],['t','b']],a:1,e:"<strong>B matches!</strong> It's a filled black circle — same shape AND same fill as the original."},
    // a:2
    {src:['t','e'],opts:[['t','b'],['t','g'],['t','e'],['s','e']],a:2,e:"<strong>C matches!</strong> It's an empty triangle — same shape and fill."},
    // a:0 (moved h,g to front)
    {src:['h','g'],opts:[['h','g'],['p','g'],['h','b'],['h','e']],a:0,e:"<strong>A matches!</strong> It's a grey hexagon — same shape and fill as the original."},
    // a:3 (moved *,e to end)
    {src:['*','e'],opts:[['*','b'],['*','g'],['c','e'],['*','e']],a:3,e:"<strong>D matches!</strong> It's an empty star — same shape and fill as the original."},
    // a:3 (keep)
    {src:['d','b'],opts:[['d','e'],['s','b'],['d','g'],['d','b']],a:3,e:"<strong>D matches!</strong> It's a filled black diamond — same shape and fill."},
    // a:2 (moved p,l to position 2)
    {src:['p','l'],opts:[['p','e'],['h','l'],['p','l'],['p','b']],a:2,e:"<strong>C matches!</strong> It's a light grey pentagon — same shape and fill."},
    // a:0 (keep)
    {src:['+','b'],opts:[['+','b'],['+','g'],['*','b'],['h','b']],a:0,e:"<strong>A matches!</strong> It's a filled black cross — same as the original."},
    // a:3 (moved a,b,90 to end)
    {src:['a','b',90],opts:[['a','b',0],['a','g',90],['a','b',180],['a','b',90]],a:3,e:"<strong>D matches!</strong> It's a filled arrow pointing DOWN — same shape, fill and rotation as the original."},
    // a:1 (keep)
    {src:['t','g',180],opts:[['t','g',0],['t','g',180],['t','b',180],['d','g',180]],a:1,e:"<strong>B matches!</strong> Grey triangle pointing DOWN — same shape, fill and rotation."},
    // a:2 (moved ov,e to position 2)
    {src:['ov','e'],opts:[['c','e'],['ov','b'],['ov','e'],['ov','g']],a:2,e:"<strong>C matches!</strong> It's an empty oval — same shape and fill as the original."},
  ],
  seq:[
    // a:0 — 2-variable: sides increase (3→4→5) AND fill darkens (e→g→b); next = hexagon+back to empty
    {seq:[['t','e'],['s','g'],['p','b']],opts:[['h','e'],['h','b'],['h','g'],['p','e']],a:0,e:"<strong>Answer: A</strong> Two rules: sides increase (3→4→5→<strong>6</strong>) AND fill cycles e→g→b→<strong>e</strong>. Answer = empty hexagon."},
    // a:1 — rotation 45° each step AND fill alternates b/e; next = 135° + empty
    {seq:[['d','b',0],['d','e',45],['d','b',90]],opts:[['d','b',135],['d','e',135],['d','e',90],['d','b',0]],a:1,e:"<strong>Answer: B</strong> Diamond rotates +45° each step AND fill alternates black/empty. At step 4: 135° + <strong>empty</strong>."},
    // a:2 — shape cycles (t→s→t…) AND fill cycles (e→g→b→e…); next = square + empty
    {seq:[['t','e'],['s','g'],['t','b']],opts:[['t','g'],['s','b'],['s','e'],['t','e']],a:2,e:"<strong>Answer: C</strong> Two rules: shape alternates t/s AND fill cycles e→g→b→<strong>e</strong>. Step 4 = <strong>square + empty</strong>."},
    // a:3 — arrow rotates 90° CW AND fill alternates b/g; next = 270° + grey
    {seq:[['a','b',0],['a','g',90],['a','b',180]],opts:[['a','b',270],['a','g',0],['a','b',90],['a','g',270]],a:3,e:"<strong>Answer: D</strong> Arrow rotates 90° clockwise each step AND fill alternates black/grey. At step 4: 270° + <strong>grey</strong>."},
    // a:0 — 2-variable: sides increase (3→4→5) AND all stay black; next = hexagon black
    {seq:[['t','b'],['s','b'],['p','b']],opts:[['h','b'],['h','e'],['*','b'],['p','b']],a:0,e:"<strong>Answer: A</strong> Each shape gains one more side: 3→4→5→<strong>6 (hexagon)</strong>. All stay filled black."},
    // a:1 — fill darkens (e→l→g) AND shape stays circle; next = b
    {seq:[['c','e'],['c','l'],['c','g']],opts:[['c','l'],['c','b'],['c','e'],['s','b']],a:1,e:"<strong>Answer: B</strong> The circle gets progressively darker: empty→light grey→mid grey→<strong>black</strong>."},
    // a:2 — star rotates +45° each step; next = 135°
    {seq:[['*','b',0],['*','b',45],['*','b',90]],opts:[['*','b',0],['*','b',45],['*','b',135],['*','b',90]],a:2,e:"<strong>Answer: C</strong> The star rotates 45° clockwise each step: 0°→45°→90°→<strong>135°</strong>. Fill stays black throughout."},
    // a:3 — triangle rotates 90° AND fill alternates e/b; next = 270° + black
    {seq:[['t','e',0],['t','b',90],['t','e',180]],opts:[['t','e',270],['t','b',0],['t','e',90],['t','b',270]],a:3,e:"<strong>Answer: D</strong> Triangle rotates 90° CW each step AND fill alternates empty/black. Step 4: 270° + <strong>black</strong>."},
    // a:0 — pentagon fill cycles g→b→e→g (period 3); next = grey pentagon
    {seq:[['p','g'],['p','b'],['p','e']],opts:[['p','g'],['p','b'],['h','g'],['p','e']],a:0,e:"<strong>Answer: A</strong> Pentagon fill cycles grey→black→empty→<strong>grey</strong>. The shape and size never change."},
    // a:1 — star size decreases (1.5→1.0→0.5) AND fill stays black; next = star tiny → but then medium again
    {seq:[['*','b',0,1.5],['*','b',0,1.0],['*','b',0,0.5]],opts:[['*','b',0,0.5],['*','b',0,1.5],['*','b',0,1.0],['*','e',0,1.5]],a:1,e:"<strong>Answer: B</strong> Star shrinks each step: large→medium→small, then back to <strong>large</strong>. Fill stays black throughout."},
  ],
  ana:[
    // a:0 — fill: empty→black (same to C)
    {pa:['t','e'],pb:['t','b'],pc:['c','e'],opts:[['c','b'],['c','e'],['t','b'],['c','g']],a:0,e:"<strong>Answer: A</strong> A→B: empty becomes filled black. Same rule on C: the empty circle becomes filled black."},
    // a:1 — fill: empty→grey
    {pa:['s','e'],pb:['s','g'],pc:['d','e'],opts:[['d','b'],['d','g'],['d','e'],['s','g']],a:1,e:"<strong>Answer: B</strong> A→B: empty becomes grey. Same rule on C: the empty diamond becomes grey."},
    // a:2 — rotation: +180°
    {pa:['a','b',0],pb:['a','b',180],pc:['t','b',0],opts:[['t','b',90],['t','g',180],['t','b',180],['t','b',0]],a:2,e:"<strong>Answer: C</strong> A→B: rotated 180°. Same rule on C: the upward triangle rotates 180° and now points down."},
    // a:3 — rotation: +90° CW
    {pa:['t','b',0],pb:['t','b',90],pc:['a','g',0],opts:[['a','g',180],['a','b',90],['a','g',0],['a','g',90]],a:3,e:"<strong>Answer: D</strong> A→B: rotated 90° clockwise. Same rule on C: the grey arrow pointing right rotates 90° → now points down."},
    // a:0 — fill: black→empty (reversal)
    {pa:['c','b'],pb:['c','e'],pc:['h','b'],opts:[['h','e'],['h','g'],['h','b'],['c','e']],a:0,e:"<strong>Answer: A</strong> A→B: filled black becomes empty. Same rule on C: the filled hexagon becomes empty."},
    // a:1 — size: normal→small (scale 1.0→0.5)
    {pa:['s','b',0,1.0],pb:['s','b',0,0.5],pc:['p','g',0,1.0],opts:[['p','b',0,0.5],['p','g',0,0.5],['p','g',0,1.0],['p','g',0,1.5]],a:1,e:"<strong>Answer: B</strong> A→B: shape shrinks to half size. Same rule on C: the normal pentagon shrinks to half size (same grey fill)."},
    // a:2 — fill: grey→light-grey AND rotation: +90°
    {pa:['a','g',0],pb:['a','l',90],pc:['t','g',0],opts:[['t','g',90],['t','b',90],['t','l',90],['t','l',0]],a:2,e:"<strong>Answer: C</strong> A→B: TWO changes — fill lightens (grey→light grey) AND rotates 90°. Same two changes on C: triangle becomes light grey AND rotates 90°."},
    // a:3 — fill: empty→light-grey
    {pa:['p','e'],pb:['p','l'],pc:['h','e'],opts:[['h','b'],['h','g'],['h','e'],['h','l']],a:3,e:"<strong>Answer: D</strong> A→B: empty becomes light grey. Same rule on C: the empty hexagon becomes light grey."},
    // a:0 — rotation: +90° AND fill: empty→black (two rules)
    {pa:['a','e',0],pb:['a','b',90],pc:['d','e',0],opts:[['d','b',90],['d','e',90],['d','b',0],['d','g',90]],a:0,e:"<strong>Answer: A</strong> A→B: TWO changes — rotates 90° AND fill goes empty→black. Same two rules on C: diamond rotates 90° AND becomes filled black."},
    // a:1 — fill: black→grey
    {pa:['h','b'],pb:['h','g'],pc:['*','b'],opts:[['*','b'],['*','g'],['*','e'],['h','g']],a:1,e:"<strong>Answer: B</strong> A→B: filled black becomes grey. Same rule on C: the black star becomes grey."},
  ],
  mat:[
    // a:0 — rows get darker, columns same shape; missing = black triangle
    {g:[[['c','e'],['c','g'],['c','b']],[['s','e'],['s','g'],['s','b']],[['t','e'],['t','g'],null]],opts:[['t','b'],['t','g'],['s','b'],['c','b']],a:0,e:"<strong>Answer: A</strong> Each row gets darker (empty→grey→black). Each column has one shape. Column 3 = triangles, row 3 = black. Missing = <strong>filled black triangle</strong>."},
    // a:1 — columns same shape, rows same fill; missing = grey pentagon
    {g:[[['t','e'],['s','e'],['p','e']],[['t','g'],['s','g'],null],[['t','b'],['s','b'],['p','b']]],opts:[['s','g'],['p','g'],['p','e'],['t','g']],a:1,e:"<strong>Answer: B</strong> Each row uses the same fill. Row 2 = grey. Column 3 = pentagons. Missing = <strong>grey pentagon</strong>."},
    // a:2 — rows get lighter; missing = empty diamond
    {g:[[['h','b'],['h','g'],['h','e']],[['p','b'],['p','g'],['p','e']],[['d','b'],['d','g'],null]],opts:[['d','b'],['d','g'],['d','e'],['p','e']],a:2,e:"<strong>Answer: C</strong> Each row goes black→grey→empty (lighter). Column 3 = empty shapes. Missing = <strong>empty diamond</strong>."},
    // a:3 — rotation increases across row; missing = star rotated 60°
    {g:[[['t','b',0],['t','b',60],['t','b',120]],[['a','g',0],['a','g',90],['a','g',180]],[['*','e',0],['*','e',30],null]],opts:[['*','b',60],['*','g',60],['a','e',60],['*','e',60]],a:3,e:"<strong>Answer: D</strong> Each row, rotation increases by a fixed step. Row 3 column 3 = star at 60° rotation, empty fill. Missing = <strong>empty star rotated 60°</strong>."},
    // a:0 — all shapes in column are same; row 3 = black; missing = black circle
    {g:[[['d','e'],['s','e'],['c','e']],[['d','g'],['s','g'],['c','g']],[null,['s','b'],['c','b']]],opts:[['d','b'],['d','g'],['d','e'],['s','b']],a:0,e:"<strong>Answer: A</strong> Each column uses the same shape. Row 3 = all black. Column 1 = diamonds. Missing = <strong>filled black diamond</strong>."},
    // a:1 — rows: same shape, same fill; middle row missing one; missing = grey hexagon
    {g:[[['h','e'],['h','e'],['h','e']],[['h','g'],null,['h','g']],[['h','b'],['h','b'],['h','b']]],opts:[['h','e'],['h','g'],['h','b'],['p','g']],a:1,e:"<strong>Answer: B</strong> Each row is the same shape and fill throughout. Row 2 = all grey hexagons. Missing = <strong>grey hexagon</strong>."},
    // a:0 — column fill rule; missing = black cross
    {g:[[['c','e'],['s','g'],['t','b']],[['s','e'],['t','g'],null],[['t','e'],['c','g'],['s','b']]],opts:[['+','b'],['+','e'],['t','b'],['c','b']],a:0,e:"<strong>Answer: A</strong> Rows: each row uses a different shape. Columns: each column uses the same fill. Column 3 = black. Row 2 = cross/plus at position (2,3). Missing = <strong>black cross</strong>."},
    // a:3 — size increases across row; missing = large pentagon
    {g:[[['c','b',0,0.5],['c','b',0,1.0],['c','b',0,1.5]],[['s','g',0,0.5],['s','g',0,1.0],['s','g',0,1.5]],[['p','e',0,0.5],['p','e',0,1.0],null]],opts:[['p','e',0,0.5],['p','g',0,1.5],['p','b',0,1.5],['p','e',0,1.5]],a:3,e:"<strong>Answer: D</strong> Each row gets larger left to right (small→medium→large). Row 3 = empty pentagons. Missing = <strong>large empty pentagon</strong>."},
    // a:0 — columns same shape, rows same fill; missing = black circle
    {g:[[['t','e'],['s','e'],['c','e']],[['t','g'],['s','g'],['c','g']],[['t','b'],['s','b'],null]],opts:[['c','b'],['c','g'],['s','b'],['t','b']],a:0,e:"<strong>Answer: A</strong> Each column uses the same shape. Each row uses the same fill. Row 3 = black, column 3 = circles. Missing = <strong>filled black circle</strong>."},
    // a:1 — all rows same shape (diamonds), fill varies; missing = grey diamond
    {g:[[['d','b'],['d','b'],['d','b']],[null,['d','g'],['d','g']],[['d','e'],['d','e'],['d','e']]],opts:[['d','e'],['d','g'],['d','b'],['s','g']],a:1,e:"<strong>Answer: B</strong> Each row = same shape AND same fill. Row 2 = all grey diamonds. Missing = <strong>grey diamond</strong>."},
  ],
  cod:[
    // a:0
    {ex:[{s:['c','e'],c:'CE'},{s:['s','b'],c:'SB'},{s:['t','g'],c:'TG'}],tgt:['c','b'],opts:['CB','CE','SB','TB'],a:0,e:"<strong>Answer: A (CB)</strong> C=Circle, B=Black. A filled black circle = CB."},
    // a:1
    {ex:[{s:['t','e'],c:'TE'},{s:['c','g'],c:'CG'},{s:['s','b'],c:'SB'}],tgt:['d','g'],opts:['TB','DG','DE','SG'],a:1,e:"<strong>Answer: B (DG)</strong> D=Diamond, G=Grey. A grey diamond = DG."},
    // a:2
    {ex:[{s:['h','e'],c:'HE'},{s:['p','g'],c:'PG'},{s:['c','b'],c:'CB'}],tgt:['h','g'],opts:['HE','HB','HG','PG'],a:2,e:"<strong>Answer: C (HG)</strong> H=Hexagon, G=Grey. Grey hexagon = HG."},
    // a:3
    {ex:[{s:['d','b'],c:'DB'},{s:['c','e'],c:'CE'},{s:['t','g'],c:'TG'}],tgt:['c','g'],opts:['DE','DB','CG','CE'],a:2,e:"<strong>Answer: C (CG)</strong> C=Circle, G=Grey. A grey circle = CG."},
    // a:0 — K=Cross (not P, which = Pentagon)
    {ex:[{s:['+','b'],c:'KB'},{s:['s','e'],c:'SE'},{s:['h','g'],c:'HG'}],tgt:['+','e'],opts:['KE','SE','KB','HE'],a:0,e:"<strong>Answer: A (KE)</strong> K=Cross/Plus, E=Empty. An empty cross = KE. (K is used so it doesn't clash with P=Pentagon.)"},
    // a:1
    {ex:[{s:['p','e'],c:'PE'},{s:['c','b'],c:'CB'},{s:['t','g'],c:'TG'}],tgt:['p','b'],opts:['TB','PB','PE','CB'],a:1,e:"<strong>Answer: B (PB)</strong> P=Pentagon, B=Black. Filled pentagon = PB."},
    // a:2
    {ex:[{s:['c','g'],c:'CG'},{s:['s','g'],c:'SG'},{s:['t','g'],c:'TG'}],tgt:['h','b'],opts:['HG','SB','HB','HE'],a:2,e:"<strong>Answer: C (HB)</strong> H=Hexagon, B=Black. Filled black hexagon = HB."},
    // a:3
    {ex:[{s:['t','b'],c:'TB'},{s:['t','e'],c:'TE'},{s:['t','g'],c:'TG'}],tgt:['s','b'],opts:['SE','TE','TG','SB'],a:3,e:"<strong>Answer: D (SB)</strong> S=Square, B=Black. Filled black square = SB."},
    // a:0
    {ex:[{s:['*','b'],c:'XB'},{s:['*','e'],c:'XE'},{s:['*','g'],c:'XG'}],tgt:['*','l'],opts:['XL','XE','XB','XG'],a:0,e:"<strong>Answer: A (XL)</strong> X=Star, L=Light grey. A light-grey star = XL."},
    // a:1
    {ex:[{s:['d','g'],c:'DG'},{s:['*','g'],c:'XG'},{s:['c','g'],c:'CG'}],tgt:['d','b'],opts:['DG','DB','DE','XB'],a:1,e:"<strong>Answer: B (DB)</strong> D=Diamond, B=Black. Filled black diamond = DB."},
  ],
  ref:[
    // a:0 — arrow right → vertical mirror → arrow left
    {orig:['a','b',0],axis:'v',opts:[['a','b',180],['a','b',0],['a','b',90],['a','b',270]],a:0,e:"<strong>Answer: A</strong> Vertical mirror flips left↔right. Arrow pointing right → reflection points <strong>LEFT</strong> (180°)."},
    // a:1 — triangle pointing right → horizontal mirror → still points right (horiz mirror doesn't affect left/right)
    {orig:['t','b',90],axis:'h',opts:[['t','b',180],['t','b',90],['t','b',0],['t','b',270]],a:1,e:"<strong>Answer: B</strong> Horizontal mirror flips up↔down only. A rightward triangle reflected horizontally still points <strong>RIGHT</strong> — no left/right change."},
    // a:2 — arrow down → vertical mirror → still points down (vertical mirror doesn't affect up/down)
    {orig:['a','b',90],axis:'v',opts:[['a','b',270],['a','b',0],['a','b',90],['a','b',180]],a:2,e:"<strong>Answer: C</strong> Vertical mirror flips left↔right only. A downward arrow reflected vertically still points <strong>DOWN</strong> — no up/down change."},
    // a:3 — grey arrow left → horizontal mirror → still points left
    {orig:['a','g',180],axis:'h',opts:[['a','g',0],['a','g',90],['a','b',180],['a','g',180]],a:3,e:"<strong>Answer: D</strong> Horizontal mirror flips up↔down. Arrow pointing left reflected horizontally still points <strong>LEFT</strong> — left/right is unchanged by a horizontal mirror."},
    // a:0 — triangle up → horizontal mirror → triangle down
    {orig:['t','g',0],axis:'h',opts:[['t','g',180],['t','g',0],['t','b',180],['t','g',90]],a:0,e:"<strong>Answer: A</strong> Horizontal mirror flips up↔down. Upward triangle → now points <strong>DOWN</strong> (180°)."},
    // a:1 — arrow up (270°) → vertical mirror → still points up (vertical doesn't change up/down)
    {orig:['a','b',270],axis:'v',opts:[['a','b',90],['a','b',270],['a','b',0],['a','b',180]],a:1,e:"<strong>Answer: B</strong> Vertical mirror flips left↔right. Arrow pointing UP reflected in a vertical mirror still points <strong>UP</strong> — no up/down change."},
    // a:2 — diamond → vertical mirror → diamond (symmetric, same)
    {orig:['d','e',0],axis:'v',opts:[['d','e',90],['d','b',0],['d','e',0],['s','e',0]],a:2,e:"<strong>Answer: C</strong> A diamond is left-right symmetric. Its vertical reflection looks <strong>identical</strong>."},
    // a:3 — triangle pointing left (270°) → vertical mirror → triangle pointing right (90°)
    {orig:['t','b',270],axis:'v',opts:[['t','b',180],['t','b',270],['t','b',0],['t','b',90]],a:3,e:"<strong>Answer: D</strong> Vertical mirror flips left↔right. Triangle pointing left → reflected → now points <strong>RIGHT</strong> (90°)."},
    // a:0 — arrow right → vertical mirror → arrow left
    {orig:['a','g',0],axis:'v',opts:[['a','g',180],['a','g',0],['a','b',180],['a','g',90]],a:0,e:"<strong>Answer: A</strong> Grey arrow pointing right → vertical mirror → now points <strong>LEFT</strong> (180°)."},
    // a:1 — pentagon → vertical mirror → same (has vertical symmetry)
    {orig:['p','b',0],axis:'v',opts:[['p','e',0],['p','b',0],['h','b',0],['p','b',90]],a:1,e:"<strong>Answer: B</strong> A regular pentagon has a vertical axis of symmetry. Its reflection looks <strong>identical</strong>."},
  ],
  // ── PAPER FOLDING ─────────────────────────────────────────────────────────
  // New format: {fold, holePos, opts:[[quadrant list],...], a, e}
  // fold: 'v'=vertical fold line | 'h'=horizontal fold line
  // holePos: position of punched hole on the folded half
  //   for fold='v' (right half shown): 'tr'=top-right, 'br'=bottom-right, 'mr'=mid-right
  //   for fold='h' (bottom half shown): 'bl'=bot-left, 'br'=bot-right, 'mb'=mid-bottom
  // opts: each option is array of [x,y] fractions of full paper (0..1)
  // a: correct option index
  fol:[
    // fold='v', hole on right half, top area → unfolded: TL+TR holes
    {fold:'v',holePos:'tr',opts:[[[0.25,0.25],[0.75,0.25]],[[0.75,0.25]],[[0.25,0.75],[0.75,0.75]],[[0.25,0.25]]],a:0,e:"<strong>Answer: A</strong> Vertical fold. Hole punched top-right. When unfolded it mirrors to top-left → two holes, both at the top."},
    // fold='h', hole on bottom half, left area → unfolded: BL+TL
    {fold:'h',holePos:'bl',opts:[[[0.25,0.75]],[[0.25,0.25],[0.25,0.75]],[[0.75,0.25],[0.75,0.75]],[[0.5,0.5]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold. Hole punched bottom-left. When unfolded, it mirrors upward → holes at <strong>bottom-left AND top-left</strong>."},
    // fold='v', hole on right-bottom → unfolded: BR+BL holes
    {fold:'v',holePos:'br',opts:[[[0.75,0.75]],[[0.25,0.25],[0.75,0.25]],[[0.25,0.75],[0.75,0.75]],[[0.25,0.75]]],a:2,e:"<strong>Answer: C</strong> Vertical fold. Hole bottom-right. Mirror left → holes at <strong>bottom-right AND bottom-left</strong>."},
    // fold='h', hole on bottom-right → unfolded: BR+TR
    {fold:'h',holePos:'br',opts:[[[0.25,0.25],[0.75,0.25]],[[0.25,0.75],[0.75,0.75]],[[0.5,0.25],[0.5,0.75]],[[0.75,0.25],[0.75,0.75]]],a:3,e:"<strong>Answer: D</strong> Horizontal fold. Hole bottom-right. Mirror upward → holes at <strong>bottom-right AND top-right</strong>."},
    // fold='v', hole on right-centre → unfolded: left-centre + right-centre
    {fold:'v',holePos:'mr',opts:[[[0.25,0.5],[0.75,0.5]],[[0.75,0.5]],[[0.25,0.5]],[[0.5,0.25],[0.5,0.75]]],a:0,e:"<strong>Answer: A</strong> Vertical fold. Hole middle-right. Mirror across fold → holes at <strong>middle-left AND middle-right</strong>."},
    // fold='h', hole on bottom-centre → unfolded: bottom-centre + top-centre
    {fold:'h',holePos:'mb',opts:[[[0.5,0.25]],[[0.5,0.25],[0.5,0.75]],[[0.25,0.5],[0.75,0.5]],[[0.5,0.5]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold. Hole mid-bottom. Mirror upward → holes at <strong>top-centre AND bottom-centre</strong>."},
    // fold='v', hole on right side top → unfolded: TL + TR
    {fold:'v',holePos:'tr',opts:[[[0.25,0.75],[0.75,0.75]],[[0.75,0.25]],[[0.25,0.25]],[[0.25,0.25],[0.75,0.25]]],a:3,e:"<strong>Answer: D</strong> Vertical fold. Hole top-right. Unfold → mirror to top-left: two holes both near the <strong>top</strong>."},
    // fold='h', hole on bottom-left → unfolded: TL + BL
    {fold:'h',holePos:'bl',opts:[[[0.75,0.25],[0.75,0.75]],[[0.25,0.5]],[[0.25,0.25],[0.25,0.75]],[[0.5,0.25],[0.5,0.75]]],a:2,e:"<strong>Answer: C</strong> Horizontal fold. Hole bottom-left. Mirror upward → holes at <strong>bottom-left AND top-left</strong>."},
    // fold='v', hole on bottom-right → unfolded: BL + BR
    {fold:'v',holePos:'br',opts:[[[0.25,0.75]],[[0.75,0.75]],[[0.75,0.25],[0.25,0.25]],[[0.25,0.75],[0.75,0.75]]],a:3,e:"<strong>Answer: D</strong> Vertical fold. Hole bottom-right. Mirror left → holes at <strong>bottom-left AND bottom-right</strong>."},
    // fold='h', hole on bottom-right → unfolded: TR + BR
    {fold:'h',holePos:'br',opts:[[[0.75,0.75]],[[0.75,0.25],[0.75,0.75]],[[0.25,0.25],[0.25,0.75]],[[0.5,0.25],[0.5,0.75]]],a:1,e:"<strong>Answer: B</strong> Horizontal fold. Hole bottom-right. Mirror upward → holes at <strong>top-right AND bottom-right</strong>."},
  ],
  net:[
    {q:"A cube has how many faces?",opts:['4 faces','5 faces','6 faces','8 faces'],a:2,txt:true,e:"<strong>Answer: C — 6 faces.</strong> A cube has 6 equal square faces: top, bottom, front, back, left, right."},
    {q:"A cross-shaped net of 6 squares — what shape does it fold into?",opts:['Cube','Pyramid','Cylinder','Cone'],a:0,txt:true,e:"<strong>Answer: A — Cube.</strong> A cross of 6 connected squares folds perfectly into a cube."},
    {q:"How many squares must a cube net have?",opts:['4 squares','5 squares','6 squares','7 squares'],a:2,txt:true,e:"<strong>Answer: C — 6 squares</strong>, one for each face of the cube."},
    {q:"A straight row of 6 squares — can it fold into a cube?",opts:['Yes, always','Only sometimes','Depends on size','No, never'],a:3,txt:true,e:"<strong>Answer: D — No.</strong> A straight row of 6 squares overlaps when folded. It is not a valid cube net."},
    {q:"Which of these COULD be a valid cube net?",opts:['A cross of 6 squares','A T-shape of 4 squares','A row of 3 squares','An L-shape of 5 squares'],a:0,txt:true,e:"<strong>Answer: A.</strong> A cross of 6 squares is a classic cube net. T-shapes with only 4 squares can never make a 6-faced cube."},
    {q:"When you unfold a cube flat, you get a...",opts:['Circle with 4 segments','Triangle of 6 parts','Net of 6 squares','Pentagon'],a:2,txt:true,e:"<strong>Answer: C — a net of 6 squares</strong>, arranged in one of 11 possible valid patterns."},
    {q:"Opposite faces of a cube are always...",opts:['The same colour','At right angles','Adjacent and touching','Parallel to each other'],a:3,txt:true,e:"<strong>Answer: D — parallel.</strong> Top/bottom, front/back, left/right are the 3 pairs of parallel opposite faces."},
    {q:"How many valid (different) nets can a cube have?",opts:['6 nets','11 nets','8 nets','24 nets'],a:1,txt:true,e:"<strong>Answer: B — 11 nets.</strong> Mathematicians have proven there are exactly 11 distinct nets for a cube."},
    {q:"Which is TRUE about all valid cube nets?",opts:['They must be cross-shaped','They must have exactly 6 squares','They must be T-shaped','They must be symmetric'],a:1,txt:true,e:"<strong>Answer: B.</strong> Every valid cube net has exactly 6 squares — one for each of the cube's faces."},
    {q:"A cube net is folded. Two squares share an edge in the net. In the cube, those squares are...",opts:['Adjacent faces','The same face','Parallel faces','Opposite faces'],a:0,txt:true,e:"<strong>Answer: A — adjacent faces.</strong> Squares that share an edge in a net fold to meet at an edge of the cube, making them adjacent."},
  ],
  hid:[
    // a:0 — triangle hidden in square+triangle composite
    {cmp:[['s','e',0,65,65,50],['t','e',0,65,50,30]],opts:['t','c','h','*'],a:0,e:"<strong>Answer: A — triangle.</strong> The upper portion of the figure contains a triangle shape. Trace the diagonal lines to find it."},
    // a:1 — circle hidden in hexagon
    {cmp:[['h','e',0,65,65,52],['c','e',0,65,65,30]],opts:['t','c','s','d'],a:1,e:"<strong>Answer: B — circle.</strong> Inside the hexagon, look for a smaller curved outline — a circle is hidden within it."},
    // a:2 — diamond hidden in square
    {cmp:[['s','e',0,65,65,50],['d','e',45,65,65,32]],opts:['c','s','d','p'],a:2,e:"<strong>Answer: C — diamond.</strong> Inside the square, a diamond is hidden — rotated 45° it fits neatly inside the square's corner area."},
    // a:3 — star hidden in circle
    {cmp:[['c','e',0,65,65,52],['*','e',0,65,65,30]],opts:['t','d','c','*'],a:3,e:"<strong>Answer: D — star.</strong> Inside the large circle you can trace the pointed arms of a star."},
    // a:0 — pentagon hidden in hexagon
    {cmp:[['h','e',0,65,65,52],['p','e',0,65,65,32]],opts:['p','c','s','d'],a:0,e:"<strong>Answer: A — pentagon.</strong> Inside the hexagon, five connected line segments form a pentagon."},
    // a:1 — cross hidden in large square
    {cmp:[['s','e',0,65,65,52],['+','e',0,65,65,28]],opts:['s','+','t','d'],a:1,e:"<strong>Answer: B — cross.</strong> Look in the centre of the square — a plus/cross shape is formed by the lines inside it."},
    // a:2 — oval hidden inside a rectangle/square
    {cmp:[['s','e',0,65,65,52],['ov','e',0,65,65,28]],opts:['c','t','ov','*'],a:2,e:"<strong>Answer: C — oval.</strong> Inside the square, an elongated oval shape is hidden. Its curved edges are visible if you trace them."},
    // a:3 — triangle hidden in circle
    {cmp:[['c','e',0,65,65,52],['t','e',0,65,65,32]],opts:['d','c','s','t'],a:3,e:"<strong>Answer: D — triangle.</strong> Inside the circle, three lines form a triangle. Trace the straight edges to find it."},
    // a:0 — cross hidden in large circle
    {cmp:[['c','e',0,65,65,52],['+','e',0,65,65,30]],opts:['+','t','d','p'],a:0,e:"<strong>Answer: A — cross.</strong> Inside the circle, a plus/cross shape is formed by two perpendicular lines."},
    // a:1 — hexagon hidden in star
    {cmp:[['*','e',0,65,65,52],['h','e',0,65,65,28]],opts:['c','h','t','s'],a:1,e:"<strong>Answer: B — hexagon.</strong> Inside the star, the inner connections between the points form a hexagon shape."},
  ],
};
