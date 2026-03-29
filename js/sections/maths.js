// ── MATHS SECTION ────────────────────────────────────────────────────────────
// GL Assessment Maths - Year 5/6 level MCQ problem solving

import { Store } from '../store.js';
import { renderQuizProgress, renderScore as renderScoreUI } from '../ui.js';
import { calculateQuizXP } from '../xp.js';
import { playSound } from '../audio.js';

const SECTION_ID = 'maths';
const QUIZ_LENGTH = 10;

const ALL_QUESTIONS = [
  // ── Number and place value ──
  { id: 1, topic: 'Place value', question: "What is the value of the digit 7 in the number 374,256?", options: ["7,000", "70,000", "700", "700,000"], answer: 1, explanation: "The 7 is in the ten thousands column, so its value is 70,000." },
  { id: 2, topic: 'Place value', question: "Which number is 10,000 more than 456,789?", options: ["457,789", "466,789", "556,789", "456,889"], answer: 1, explanation: "456,789 + 10,000 = 466,789." },
  { id: 3, topic: 'Place value', question: "Round 67,482 to the nearest 1,000.", options: ["67,000", "67,500", "68,000", "67,400"], answer: 0, explanation: "The hundreds digit is 4 (less than 5), so round down to 67,000." },
  { id: 4, topic: 'Place value', question: "What is 3.7 million written in figures?", options: ["370,000", "3,700,000", "37,000,000", "3,070,000"], answer: 1, explanation: "3.7 million = 3,700,000." },
  { id: 5, topic: 'Place value', question: "Which of these is the largest? 0.45, 0.504, 0.54, 0.405", options: ["0.45", "0.504", "0.54", "0.405"], answer: 2, explanation: "0.54 = 540 thousandths, which is the largest." },
  { id: 6, topic: 'Ordering', question: "Put these in order from smallest to largest: -3, 5, -7, 2, 0. Which is in the middle?", options: ["-3", "0", "2", "-7"], answer: 1, explanation: "In order: -7, -3, 0, 2, 5. The middle number is 0." },

  // ── Four operations (word problems) ──
  { id: 7, topic: 'Multiplication', question: "A school orders 36 boxes of pencils. Each box contains 24 pencils. How many pencils in total?", options: ["864", "764", "684", "924"], answer: 0, explanation: "36 \u00d7 24 = 864 pencils." },
  { id: 8, topic: 'Division', question: "A farmer has 756 eggs to pack into boxes of 12. How many full boxes can he fill?", options: ["62", "63", "64", "60"], answer: 1, explanation: "756 \u00f7 12 = 63 boxes." },
  { id: 9, topic: 'Addition', question: "A family drove 287 miles on Saturday and 345 miles on Sunday. How far did they drive altogether?", options: ["622 miles", "632 miles", "532 miles", "642 miles"], answer: 1, explanation: "287 + 345 = 632 miles." },
  { id: 10, topic: 'Subtraction', question: "A shop had 5,000 footballs. They sold 2,847. How many are left?", options: ["2,153", "2,253", "2,163", "3,153"], answer: 0, explanation: "5,000 - 2,847 = 2,153." },
  { id: 11, topic: 'Multi-step', question: "Tickets cost \u00a34.50 each. A family buys 3 adult and 2 child tickets. Child tickets are half price. What is the total cost?", options: ["\u00a318.00", "\u00a318.50", "\u00a317.50", "\u00a318.25"], answer: 0, explanation: "Adults: 3 \u00d7 \u00a34.50 = \u00a313.50. Children: 2 \u00d7 \u00a32.25 = \u00a34.50. Total: \u00a318.00." },
  { id: 12, topic: 'Multi-step', question: "Sam has \u00a320. He buys 3 notebooks at \u00a32.75 each. How much change does he get?", options: ["\u00a311.75", "\u00a311.25", "\u00a312.75", "\u00a311.50"], answer: 0, explanation: "3 \u00d7 \u00a32.75 = \u00a38.25. Change: \u00a320 - \u00a38.25 = \u00a311.75." },
  { id: 13, topic: 'Division', question: "468 children are split equally into 9 teams. How many children in each team?", options: ["52", "54", "48", "56"], answer: 0, explanation: "468 \u00f7 9 = 52." },
  { id: 14, topic: 'Multi-step', question: "A bakery makes 240 cakes each day for 5 days. They sell 80% of them. How many cakes are left unsold?", options: ["240", "960", "200", "1,200"], answer: 0, explanation: "Total: 240 \u00d7 5 = 1,200. Sold: 80% of 1,200 = 960. Left: 1,200 - 960 = 240." },

  // ── Fractions, decimals, percentages ──
  { id: 15, topic: 'Fractions', question: "What is 3/4 of 120?", options: ["80", "90", "100", "60"], answer: 1, explanation: "120 \u00f7 4 = 30. 30 \u00d7 3 = 90." },
  { id: 16, topic: 'Fractions', question: "Which fraction is equivalent to 4/6?", options: ["2/4", "2/3", "3/4", "6/8"], answer: 1, explanation: "4/6 simplified (divide both by 2) = 2/3." },
  { id: 17, topic: 'Fractions', question: "What is 2/5 + 1/10?", options: ["3/10", "1/2", "3/5", "7/10"], answer: 1, explanation: "2/5 = 4/10. 4/10 + 1/10 = 5/10 = 1/2." },
  { id: 18, topic: 'Decimals', question: "What is 0.6 \u00d7 0.3?", options: ["1.8", "0.18", "0.018", "18"], answer: 1, explanation: "0.6 \u00d7 0.3 = 0.18." },
  { id: 19, topic: 'Percentages', question: "What is 15% of 200?", options: ["15", "20", "30", "35"], answer: 2, explanation: "10% of 200 = 20. 5% = 10. 15% = 30." },
  { id: 20, topic: 'Percentages', question: "A coat costs \u00a380. It is reduced by 25%. What is the sale price?", options: ["\u00a355", "\u00a360", "\u00a365", "\u00a370"], answer: 1, explanation: "25% of \u00a380 = \u00a320. Sale price: \u00a380 - \u00a320 = \u00a360." },
  { id: 21, topic: 'FDP', question: "Put these in order from smallest to largest: 0.35, 1/4, 30%, 2/5", options: ["1/4, 30%, 0.35, 2/5", "30%, 1/4, 0.35, 2/5", "1/4, 0.35, 30%, 2/5", "2/5, 0.35, 30%, 1/4"], answer: 0, explanation: "1/4 = 0.25, 30% = 0.30, 0.35 = 0.35, 2/5 = 0.40. Order: 0.25, 0.30, 0.35, 0.40." },
  { id: 22, topic: 'Fractions', question: "What is 3/8 \u00d7 4?", options: ["3/2", "12/8", "1 1/2", "All of these"], answer: 3, explanation: "3/8 \u00d7 4 = 12/8 = 3/2 = 1 1/2. All three are the same value." },

  // ── Ratio and proportion ──
  { id: 23, topic: 'Ratio', question: "Red and blue beads are in the ratio 2:3. If there are 30 beads, how many are red?", options: ["10", "12", "15", "18"], answer: 1, explanation: "2 + 3 = 5 parts. Each part = 30 \u00f7 5 = 6. Red = 2 \u00d7 6 = 12." },
  { id: 24, topic: 'Ratio', question: "A recipe for 4 people uses 300g of flour. How much flour is needed for 6 people?", options: ["400g", "450g", "500g", "350g"], answer: 1, explanation: "For 1 person: 300 \u00f7 4 = 75g. For 6: 75 \u00d7 6 = 450g." },
  { id: 25, topic: 'Proportion', question: "3 books cost \u00a312.60. How much do 5 books cost at the same price?", options: ["\u00a319.00", "\u00a320.00", "\u00a321.00", "\u00a322.00"], answer: 2, explanation: "One book: \u00a312.60 \u00f7 3 = \u00a34.20. Five books: \u00a34.20 \u00d7 5 = \u00a321.00." },
  { id: 26, topic: 'Ratio', question: "Orange juice and lemonade are mixed in the ratio 1:4. How much lemonade is needed for 200ml of orange juice?", options: ["400ml", "600ml", "800ml", "1000ml"], answer: 2, explanation: "For every 1 part orange, you need 4 parts lemonade. 200 \u00d7 4 = 800ml." },

  // ── Measurement ──
  { id: 27, topic: 'Converting', question: "How many metres are in 3.5 kilometres?", options: ["350", "3,500", "35,000", "35"], answer: 1, explanation: "1 km = 1,000m. 3.5 \u00d7 1,000 = 3,500m." },
  { id: 28, topic: 'Converting', question: "Convert 4,200 grams to kilograms.", options: ["42 kg", "4.2 kg", "0.42 kg", "420 kg"], answer: 1, explanation: "1 kg = 1,000g. 4,200 \u00f7 1,000 = 4.2 kg." },
  { id: 29, topic: 'Perimeter', question: "A rectangle is 12 cm long and 5 cm wide. What is its perimeter?", options: ["17 cm", "34 cm", "60 cm", "24 cm"], answer: 1, explanation: "Perimeter = 2 \u00d7 (12 + 5) = 2 \u00d7 17 = 34 cm." },
  { id: 30, topic: 'Area', question: "What is the area of a rectangle 8 cm by 6 cm?", options: ["28 cm\u00b2", "48 cm\u00b2", "14 cm\u00b2", "96 cm\u00b2"], answer: 1, explanation: "Area = 8 \u00d7 6 = 48 cm\u00b2." },
  { id: 31, topic: 'Area', question: "What is the area of a triangle with base 10 cm and height 7 cm?", options: ["70 cm\u00b2", "35 cm\u00b2", "17 cm\u00b2", "45 cm\u00b2"], answer: 1, explanation: "Area = (10 \u00d7 7) \u00f7 2 = 35 cm\u00b2." },
  { id: 32, topic: 'Volume', question: "A cuboid has length 5 cm, width 4 cm and height 3 cm. What is its volume?", options: ["12 cm\u00b3", "60 cm\u00b3", "24 cm\u00b3", "48 cm\u00b3"], answer: 1, explanation: "Volume = 5 \u00d7 4 \u00d7 3 = 60 cm\u00b3." },
  { id: 33, topic: 'Time', question: "A film starts at 14:45 and lasts 1 hour 35 minutes. What time does it end?", options: ["16:10", "16:20", "15:80", "16:15"], answer: 1, explanation: "14:45 + 1 hour = 15:45. 15:45 + 35 minutes = 16:20." },
  { id: 34, topic: 'Converting', question: "How many millilitres are in 2.4 litres?", options: ["24 ml", "240 ml", "2,400 ml", "24,000 ml"], answer: 2, explanation: "1 litre = 1,000 ml. 2.4 \u00d7 1,000 = 2,400 ml." },

  // ── Geometry ──
  { id: 35, topic: 'Angles', question: "What is the size of each angle in an equilateral triangle?", options: ["90\u00b0", "45\u00b0", "60\u00b0", "120\u00b0"], answer: 2, explanation: "All angles in an equilateral triangle are equal: 180 \u00f7 3 = 60\u00b0." },
  { id: 36, topic: 'Angles', question: "Two angles of a triangle are 65\u00b0 and 50\u00b0. What is the third angle?", options: ["55\u00b0", "65\u00b0", "75\u00b0", "45\u00b0"], answer: 1, explanation: "Angles in a triangle add up to 180\u00b0. 180 - 65 - 50 = 65\u00b0." },
  { id: 37, topic: 'Angles', question: "An angle of 135\u00b0 is:", options: ["acute", "right", "obtuse", "reflex"], answer: 2, explanation: "An obtuse angle is between 90\u00b0 and 180\u00b0." },
  { id: 38, topic: 'Shapes', question: "How many faces does a triangular prism have?", options: ["3", "4", "5", "6"], answer: 2, explanation: "A triangular prism has 2 triangular faces and 3 rectangular faces = 5 faces." },
  { id: 39, topic: 'Shapes', question: "A regular hexagon has how many lines of symmetry?", options: ["3", "4", "6", "8"], answer: 2, explanation: "A regular hexagon has 6 lines of symmetry." },
  { id: 40, topic: 'Coordinates', question: "What are the coordinates of the point that is 3 right and 5 up from the origin?", options: ["(5, 3)", "(3, 5)", "(3, -5)", "(-3, 5)"], answer: 1, explanation: "Right = positive x, Up = positive y. The point is (3, 5)." },
  { id: 41, topic: 'Coordinates', question: "Point A is at (2, 4) and Point B is at (6, 4). What is the distance between them?", options: ["2 units", "4 units", "6 units", "8 units"], answer: 1, explanation: "Same y-coordinate, so distance = 6 - 2 = 4 units." },
  { id: 42, topic: 'Angles', question: "Angles on a straight line add up to:", options: ["90\u00b0", "180\u00b0", "270\u00b0", "360\u00b0"], answer: 1, explanation: "Angles on a straight line always sum to 180\u00b0." },
  { id: 43, topic: 'Angles', question: "The angles around a point add up to:", options: ["90\u00b0", "180\u00b0", "270\u00b0", "360\u00b0"], answer: 3, explanation: "Angles around a full turn = 360\u00b0." },

  // ── Statistics ──
  { id: 44, topic: 'Mean', question: "Find the mean of: 4, 7, 9, 12, 8", options: ["7", "8", "9", "10"], answer: 1, explanation: "Sum = 4+7+9+12+8 = 40. Mean = 40 \u00f7 5 = 8." },
  { id: 45, topic: 'Median', question: "Find the median of: 3, 8, 1, 6, 5", options: ["5", "6", "4", "3"], answer: 0, explanation: "In order: 1, 3, 5, 6, 8. The middle value is 5." },
  { id: 46, topic: 'Mode', question: "Find the mode of: 2, 5, 3, 5, 8, 5, 1", options: ["3", "5", "8", "2"], answer: 1, explanation: "5 appears three times, more than any other number." },
  { id: 47, topic: 'Range', question: "Find the range of: 14, 7, 23, 3, 19", options: ["16", "20", "19", "23"], answer: 1, explanation: "Range = highest - lowest = 23 - 3 = 20." },
  { id: 48, topic: 'Statistics', question: "In a survey, 15 children chose football, 10 chose netball, 5 chose tennis, and 20 chose swimming. What fraction chose swimming?", options: ["1/5", "2/5", "1/4", "3/10"], answer: 1, explanation: "Total: 15+10+5+20 = 50. Swimming: 20/50 = 2/5." },
  { id: 49, topic: 'Statistics', question: "A pictogram uses one symbol to represent 4 children. How many symbols are needed to show 22 children?", options: ["4", "5", "5.5", "6"], answer: 2, explanation: "22 \u00f7 4 = 5.5 symbols (the half symbol represents 2 children)." },

  // ── Algebra ──
  { id: 50, topic: 'Algebra', question: "If n + 7 = 15, what is n?", options: ["7", "8", "9", "22"], answer: 1, explanation: "n = 15 - 7 = 8." },
  { id: 51, topic: 'Algebra', question: "If 3x = 21, what is x?", options: ["6", "7", "8", "18"], answer: 1, explanation: "x = 21 \u00f7 3 = 7." },
  { id: 52, topic: 'Sequences', question: "What is the next number in the sequence? 2, 6, 18, 54, ___", options: ["108", "162", "72", "96"], answer: 1, explanation: "Each number is multiplied by 3. 54 \u00d7 3 = 162." },
  { id: 53, topic: 'Sequences', question: "What is the next number? 3, 7, 11, 15, ___", options: ["17", "18", "19", "20"], answer: 2, explanation: "Add 4 each time. 15 + 4 = 19." },
  { id: 54, topic: 'Algebra', question: "What is the value of 2a + 3 when a = 5?", options: ["10", "13", "16", "25"], answer: 1, explanation: "2(5) + 3 = 10 + 3 = 13." },
  { id: 55, topic: 'Algebra', question: "The perimeter of a square is 4s. If s = 9 cm, what is the perimeter?", options: ["13 cm", "18 cm", "27 cm", "36 cm"], answer: 3, explanation: "4 \u00d7 9 = 36 cm." },
  { id: 56, topic: 'Missing number', question: "What goes in the box? ___ \u00d7 8 = 96", options: ["11", "12", "13", "14"], answer: 1, explanation: "96 \u00f7 8 = 12." },
  { id: 57, topic: 'Sequences', question: "The rule is: multiply by 2 then subtract 1. Starting from 3, what is the 4th term?", options: ["17", "19", "21", "23"], answer: 2, explanation: "3 \u2192 5 \u2192 9 \u2192 17 \u2192 33. Wait: 3\u00d72-1=5, 5\u00d72-1=9, 9\u00d72-1=17, 17\u00d72-1=33. The 4th term (starting from term 1 = 3) is 17. Actually if 3 is term 1: T1=3, T2=5, T3=9, T4=17." },

  // ── More four operations / multi-step ──
  { id: 58, topic: 'Multi-step', question: "A school trip costs \u00a35 per child. There are 156 children. The school has a budget of \u00a3700. How much more money do they need?", options: ["\u00a370", "\u00a380", "\u00a374", "\u00a376"], answer: 1, explanation: "156 \u00d7 \u00a35 = \u00a3780. Need: \u00a3780 - \u00a3700 = \u00a380 more." },
  { id: 59, topic: 'Multi-step', question: "A shop sells apples in bags of 6 for \u00a31.80. Mrs Shah needs 30 apples. How much will she pay?", options: ["\u00a37.20", "\u00a39.00", "\u00a36.00", "\u00a310.80"], answer: 1, explanation: "30 \u00f7 6 = 5 bags. 5 \u00d7 \u00a31.80 = \u00a39.00." },
  { id: 60, topic: 'Multi-step', question: "Tom saves \u00a32.50 each week. How many weeks will it take him to save \u00a340?", options: ["14", "15", "16", "18"], answer: 2, explanation: "\u00a340 \u00f7 \u00a32.50 = 16 weeks." },

  // ── More fractions ──
  { id: 61, topic: 'Fractions', question: "What is 5/6 - 1/3?", options: ["4/6", "1/2", "2/3", "1/3"], answer: 1, explanation: "1/3 = 2/6. So 5/6 - 2/6 = 3/6 = 1/2." },
  { id: 62, topic: 'Fractions', question: "What is 2 1/4 as an improper fraction?", options: ["5/4", "7/4", "9/4", "8/4"], answer: 2, explanation: "2 \u00d7 4 = 8, plus 1 = 9. So 9/4." },
  { id: 63, topic: 'Fractions', question: "Which is greater: 3/5 or 7/10?", options: ["3/5", "7/10", "They are equal", "Cannot tell"], answer: 1, explanation: "3/5 = 6/10. 7/10 > 6/10, so 7/10 is greater." },

  // ── More geometry ──
  { id: 64, topic: 'Shapes', question: "A parallelogram has:", options: ["All sides equal", "Two pairs of parallel sides", "Four right angles", "No parallel sides"], answer: 1, explanation: "A parallelogram has two pairs of parallel sides." },
  { id: 65, topic: 'Circles', question: "The diameter of a circle is 14 cm. What is the radius?", options: ["28 cm", "7 cm", "14 cm", "3.5 cm"], answer: 1, explanation: "Radius = diameter \u00f7 2 = 14 \u00f7 2 = 7 cm." },
  { id: 66, topic: 'Shapes', question: "How many edges does a cube have?", options: ["6", "8", "12", "10"], answer: 2, explanation: "A cube has 12 edges." },
  { id: 67, topic: 'Shapes', question: "A shape has 4 sides, only one pair of parallel sides, and no sides are equal. It is a:", options: ["rectangle", "rhombus", "trapezium", "kite"], answer: 2, explanation: "A trapezium has exactly one pair of parallel sides." },

  // ── More percentages ──
  { id: 68, topic: 'Percentages', question: "In a class of 30, 40% are boys. How many girls are there?", options: ["12", "15", "18", "20"], answer: 2, explanation: "Boys: 40% of 30 = 12. Girls: 30 - 12 = 18." },
  { id: 69, topic: 'Percentages', question: "A book normally costs \u00a312. In a sale it is 1/3 off. What is the sale price?", options: ["\u00a34", "\u00a36", "\u00a38", "\u00a39"], answer: 2, explanation: "1/3 of \u00a312 = \u00a34. Sale price: \u00a312 - \u00a34 = \u00a38." },
  { id: 70, topic: 'Percentages', question: "20 out of 80 pupils walk to school. What percentage is this?", options: ["20%", "25%", "30%", "40%"], answer: 1, explanation: "20/80 = 1/4 = 25%." },

  // ── More measurement ──
  { id: 71, topic: 'Area', question: "A square has an area of 64 cm\u00b2. What is the length of one side?", options: ["6 cm", "7 cm", "8 cm", "16 cm"], answer: 2, explanation: "Side = \u221a64 = 8 cm." },
  { id: 72, topic: 'Volume', question: "A fish tank is 50 cm long, 30 cm wide and 40 cm tall. What is its volume in litres? (1 litre = 1,000 cm\u00b3)", options: ["60 litres", "50 litres", "120 litres", "6 litres"], answer: 0, explanation: "Volume = 50 \u00d7 30 \u00d7 40 = 60,000 cm\u00b3 = 60 litres." },
  { id: 73, topic: 'Perimeter', question: "A regular pentagon has a perimeter of 45 cm. What is the length of one side?", options: ["5 cm", "7 cm", "9 cm", "15 cm"], answer: 2, explanation: "45 \u00f7 5 sides = 9 cm per side." },

  // ── More algebra ──
  { id: 74, topic: 'Algebra', question: "If y = 2x + 1, and x = 4, what is y?", options: ["7", "8", "9", "10"], answer: 2, explanation: "y = 2(4) + 1 = 8 + 1 = 9." },
  { id: 75, topic: 'Sequences', question: "The nth term of a sequence is 3n + 2. What is the 10th term?", options: ["30", "32", "35", "50"], answer: 1, explanation: "3(10) + 2 = 32." },

  // ── Problem solving ──
  { id: 76, topic: 'Problem solving', question: "A train leaves at 09:35 and arrives at 11:12. How long is the journey?", options: ["1 hour 37 minutes", "1 hour 47 minutes", "2 hours 37 minutes", "1 hour 27 minutes"], answer: 0, explanation: "09:35 to 10:35 = 1 hour. 10:35 to 11:12 = 37 minutes. Total: 1 hour 37 minutes." },
  { id: 77, topic: 'Problem solving', question: "A room is 6 m by 4 m. Carpet tiles are 50 cm \u00d7 50 cm. How many tiles are needed?", options: ["48", "96", "192", "24"], answer: 1, explanation: "Room: 600 cm \u00d7 400 cm. Tiles along length: 600/50 = 12. Tiles along width: 400/50 = 8. Total: 12 \u00d7 8 = 96." },
  { id: 78, topic: 'Problem solving', question: "A bus can carry 52 passengers. How many buses are needed for 320 passengers?", options: ["6", "7", "6.15", "5"], answer: 1, explanation: "320 \u00f7 52 = 6.15... You cannot have 0.15 of a bus, so round up to 7 buses." },
  { id: 79, topic: 'Problem solving', question: "Two identical squares overlap. The overlap is a rectangle of area 6 cm\u00b2. The total shaded area is 42 cm\u00b2. What is the area of one square?", options: ["21 cm\u00b2", "24 cm\u00b2", "18 cm\u00b2", "48 cm\u00b2"], answer: 1, explanation: "Total visible = 42. That is 2 squares minus the overlap: 2s - 6 = 42, so 2s = 48, s = 24 cm\u00b2." },
  { id: 80, topic: 'Problem solving', question: "I think of a number, double it, then add 5. The answer is 23. What was my number?", options: ["7", "8", "9", "14"], answer: 2, explanation: "Working backwards: 23 - 5 = 18. 18 \u00f7 2 = 9." },
];

// Fix question 57 explanation
ALL_QUESTIONS.find(q => q.id === 57).explanation = "T1=3, T2=3\u00d72-1=5, T3=5\u00d72-1=9, T4=9\u00d72-1=17. The 4th term is 17.";
ALL_QUESTIONS.find(q => q.id === 57).answer = 0;

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ ENGINE
   ═══════════════════════════════════════════════════════════════════════════ */

let questions = [];
let currentIndex = 0;
let results = [];
let answered = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  return shuffle(ALL_QUESTIONS).slice(0, QUIZ_LENGTH);
}

// ── Render ──

export function renderHome(app) {
  const state = Store.get();
  const data = state.sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Maths</span>
    </div>
    <div class="section-home">
      <p class="section-desc">Year 5/6 maths problems in GL Assessment style. Read each question carefully and pick the correct answer.</p>
      <div class="score-stats" style="margin-bottom:24px;">
        <div class="stat-card">
          <div class="stat-value">${data.completed || 0}</div>
          <div class="stat-label">Quizzes done</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
      </div>
      <button class="btn btn-primary" data-action="start-quiz">Start Quiz (${QUIZ_LENGTH} questions)</button>
    </div>`;
}

export function renderPractice(app) {
  if (currentIndex >= questions.length) {
    renderScoreScreen(app);
    return;
  }

  const q = questions[currentIndex];
  answered = false;

  const optionBtns = q.options.map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/${SECTION_ID}">\u2190</a>
      <span class="quiz-title">Maths</span>
      <span class="quiz-count">${currentIndex + 1}/${questions.length}</span>
    </div>
    ${renderQuizProgress(currentIndex, questions.length, results)}
    <div class="question-area">
      <p class="question-text">${q.question}</p>
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

function renderScoreScreen(app) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);

  const sectionData = Store.get().sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };
  Store.updateSection(SECTION_ID, {
    completed: (sectionData.completed || 0) + 1,
    correct: (sectionData.correct || 0) + xpData.correct,
    total: (sectionData.total || 0) + xpData.total
  });

  app.innerHTML = renderScoreUI(results, 'Maths', xpData.totalXP);
  if (window.__showXPToast) window.__showXPToast(`+${xpData.totalXP} XP`);
}

export function renderScore(app) {
  renderScoreScreen(app);
}

function handleAnswer(index) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const isCorrect = index === q.answer;
  results.push(isCorrect);

  const state = Store.get();
  if (state.settings.soundOn !== false) {
    playSound(isCorrect);
  }

  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  if (q.explanation) {
    const tip = document.createElement('div');
    tip.style.cssText = 'margin-top:16px; padding:12px 16px; background:var(--white); border-radius:var(--radius); font-size:0.9rem; color:var(--text-muted);';
    tip.textContent = q.explanation;
    document.querySelector('.options-grid').after(tip);
  }

  setTimeout(() => {
    currentIndex++;
    renderPractice(document.getElementById('app'));
  }, 2200);
}

// ── Init ──

export function init(app) {
  questions = pickQuestions();
  currentIndex = 0;
  results = [];
  renderHome(app);
}

export default function(app) {
  init(app);

  if (app._mathsHandler) app.removeEventListener('click', app._mathsHandler);

  const handler = (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'start-quiz') {
      questions = pickQuestions();
      currentIndex = 0;
      results = [];
      renderPractice(app);
    }

    if (action === 'answer') {
      handleAnswer(parseInt(actionEl.dataset.index, 10));
    }

    if (action === 'retry') {
      questions = pickQuestions();
      currentIndex = 0;
      results = [];
      renderHome(app);
    }
  };

  app._mathsHandler = handler;
  app.addEventListener('click', handler);
}
