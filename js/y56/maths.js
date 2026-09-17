// ── YEAR 5 AND 6 MATHS ───────────────────────────────────────────────────────
// Jacob is Year 5, sitting the Bexley test at the start of Year 6, so this is
// the level he needs now. Every question is GENERATED, so the bank never runs
// out and he never sits the same paper twice.
//
// Each topic carries its own teaching: the rule, the points, and a worked
// example. Teach it before you test it.
//
// Question shape: { q, opts:[4 strings], ans:index, why }.
// The answer is always computed, never typed.
(function (root) {
  'use strict';

  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) {
    const c = [...a];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }
  const commas = (n) => Number(n).toLocaleString('en-GB');
  /** Money always prints with two decimals when it is not a whole pound. */
  const gbp = (n) => (Number.isInteger(n) ? '£' + n : '£' + Number(n).toFixed(2));

  function mc(q, answer, wrong, why, fmt) {
    const f = fmt || String;
    const ansText = f(answer);
    const opts = [ansText];
    for (const w of wrong) {
      const t = f(w);
      if (t !== ansText && !opts.includes(t)) opts.push(t);
      if (opts.length === 4) break;
    }
    let step = 1;
    while (opts.length < 4 && step < 500) {
      for (const cand of [Number(answer) + step, Number(answer) - step]) {
        if (!isFinite(cand)) continue;
        const t = f(cand);
        if (t !== ansText && !opts.includes(t)) opts.push(t);
        if (opts.length === 4) break;
      }
      step++;
    }
    // A generator that has not supplied enough DIFFERENT wrong answers must not
    // crash a quiz, and must never pad with a space, which renders as the same
    // option twice. Build a genuinely different one by nudging a number inside
    // the answer, and record it so the test suite can fail on it.
    let bump = 1;
    while (opts.length < 4 && bump < 40) {
      const t = ansText.replace(/\d+/, (d) => String(Number(d) + bump));
      if (t !== ansText && !opts.includes(t)) {
        opts.push(t);
        root.__Y56_SYNTH = (root.__Y56_SYNTH || 0) + 1;
        root.__Y56_SYNTH_Q = q;
      }
      bump++;
    }
    const sh = shuffle(opts);
    return { q, opts: sh, ans: sh.indexOf(ansText), why };
  }

  // ── 1. Place value and decimals ──────────────────────────────────────────
  function placeValue() {
    const kind = ri(1, 4);
    if (kind === 1) {
      const n = ri(100000, 9999999);
      const digits = String(n).split('');
      let idx = ri(0, digits.length - 1);
      const d = Number(digits[idx]);
      if (d === 0 || digits.filter((x) => Number(x) === d).length > 1) return placeValue();
      const value = d * Math.pow(10, digits.length - 1 - idx);
      return mc(
        `What is the value of the ${d} in ${commas(n)}?`,
        value,
        [d * Math.pow(10, digits.length - idx), d * Math.pow(10, Math.max(0, digits.length - 2 - idx)), d],
        `Counting from the right, that digit sits in the ${commas(Math.pow(10, digits.length - 1 - idx))} column, so it is worth ${commas(value)}.`,
        commas
      );
    }
    if (kind === 2) {
      const whole = ri(1, 99);
      const dec = ri(101, 999);
      // A trailing zero disappears when JavaScript prints the number, so
      // "68.910" shows as 68.91 and asking about its thousandths digit is
      // unanswerable. Reject those, and never ask about a zero digit.
      if (String(dec).endsWith('0')) return placeValue();
      const n = Number(whole + '.' + dec);
      const place = ri(1, 3);
      const d = Number(String(dec)[place - 1]);
      if (d === 0) return placeValue();
      const names = ['tenths', 'hundredths', 'thousandths'];
      const value = d / Math.pow(10, place);
      return mc(
        `In ${n}, what is the ${d} worth? (the ${names[place - 1]} digit)`,
        value.toFixed(place),
        [(d / Math.pow(10, place - 1)).toFixed(Math.max(1, place - 1)), String(d), (d / Math.pow(10, place + 1)).toFixed(place + 1)],
        `The ${names[place - 1]} column is worth ${(1 / Math.pow(10, place)).toFixed(place)}, so ${d} of them is ${value.toFixed(place)}.`
      );
    }
    if (kind === 3) {
      const n = ri(10000, 999999);
      const step = pick([1000, 10000, 100000]);
      const more = Math.random() < 0.5;
      const ans = more ? n + step : n - step;
      return mc(
        `What is ${commas(step)} ${more ? 'more' : 'less'} than ${commas(n)}?`,
        ans,
        [more ? n + step * 10 : n - step * 10, n + (more ? 1 : -1), more ? n + step / 10 : n - step / 10],
        `Only that one column changes: ${commas(n)} ${more ? '+' : '−'} ${commas(step)} = ${commas(ans)}.`,
        commas
      );
    }
    const nums = shuffle([
      Number((ri(1, 9) + '.' + ri(100, 999))),
      Number((ri(1, 9) + '.' + ri(10, 99))),
      Number((ri(1, 9) + '.' + ri(1, 9)))
    ]);
    const biggest = Math.random() < 0.5;
    const ans = biggest ? Math.max(...nums) : Math.min(...nums);
    return mc(
      `Which is ${biggest ? 'largest' : 'smallest'}?  ${nums.join(',  ')}`,
      ans,
      nums.filter((x) => x !== ans),
      `Compare the whole numbers first, then the tenths, then the hundredths. ${ans} is ${biggest ? 'largest' : 'smallest'}.`
    );
  }

  // ── 2. Rounding ──────────────────────────────────────────────────────────
  function rounding() {
    if (Math.random() < 0.5) {
      const n = ri(1001, 999999);
      const to = pick([10, 100, 1000, 10000]);
      const ans = Math.round(n / to) * to;
      if (n % to === 0) return rounding();
      return mc(
        `Round ${commas(n)} to the nearest ${commas(to)}.`,
        ans,
        [ans + to, ans - to, Math.floor(n / to) * to === ans ? ans + to * 2 : Math.floor(n / to) * to],
        `Look at the digit to the right of the ${commas(to)} column. 5 or more rounds up. ${commas(n)} becomes ${commas(ans)}.`,
        commas
      );
    }
    const n = Number(ri(1, 99) + '.' + ri(100, 999));
    const dp = ri(1, 2);
    const ans = n.toFixed(dp);
    return mc(
      `Round ${n} to ${dp} decimal place${dp === 1 ? '' : 's'}.`,
      ans,
      [(Math.floor(n * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp), n.toFixed(dp === 1 ? 2 : 1), Math.round(n).toFixed(0)],
      `Look at the next digit along. 5 or more rounds up, so ${n} to ${dp} d.p. is ${ans}.`
    );
  }

  // ── 3. Negative numbers ──────────────────────────────────────────────────
  function negatives() {
    const kind = ri(1, 4);
    if (kind === 1) {
      const a = ri(-30, -1), b = ri(1, 30);
      return mc(
        `What is the difference between ${a} and ${b}?`,
        b - a,
        [b + a, Math.abs(a) - b, b - a + 1],
        `Count from ${a} up to 0, which is ${Math.abs(a)}, then 0 up to ${b}, which is ${b}. ${Math.abs(a)} + ${b} = ${b - a}.`
      );
    }
    if (kind === 2) {
      const a = ri(-20, 20), b = ri(-20, 20);
      if (b === 0) return negatives();
      const ans = a - b;
      return mc(
        `What is ${a} − (${b})?`,
        ans,
        [a + b, b - a, ans + 1],
        b < 0
          ? `Two minus signs make a plus: ${a} + ${Math.abs(b)} = ${ans}.`
          : `${a} take away ${b} is ${ans}.`
      );
    }
    if (kind === 3) {
      const start = ri(-15, -1);
      const rise = ri(5, 30);
      return mc(
        `The temperature is ${start}°C and rises by ${rise} degrees. What is it now?`,
        `${start + rise}°C`,
        [`${start - rise}°C`, `${rise - start}°C`, `${start + rise + 1}°C`],
        `It takes ${Math.abs(start)} degrees just to reach 0, leaving ${rise - Math.abs(start)}. The answer is ${start + rise}°C.`
      );
    }
    const a = ri(-9, -2), b = ri(2, 9);
    const ans = a * b;
    return mc(
      `What is ${a} × ${b}?`,
      ans,
      [Math.abs(ans), ans + b, ans - b],
      `A negative times a positive gives a negative: ${Math.abs(a)} × ${b} = ${Math.abs(ans)}, so the answer is ${ans}.`
    );
  }

  // ── 4. Long multiplication ───────────────────────────────────────────────
  function longMult() {
    const a = ri(112, 4999);
    const b = ri(12, 89);
    const ans = a * b;
    const tens = Math.floor(b / 10) * 10, ones = b % 10;
    return mc(
      `${commas(a)} × ${b} = ?`,
      ans,
      [ans + a, ans - a, a * (b + 10), a * ones + a * tens * 10],
      `Split the ${b}: ${commas(a)} × ${tens} = ${commas(a * tens)} and ${commas(a)} × ${ones} = ${commas(a * ones)}. Add them: ${commas(ans)}.`,
      commas
    );
  }

  // ── 5. Division ──────────────────────────────────────────────────────────
  function division() {
    const kind = ri(1, 3);
    if (kind === 1) {
      const divisor = ri(3, 12);
      const quotient = ri(21, 499);
      const n = divisor * quotient;
      return mc(
        `${commas(n)} ÷ ${divisor} = ?`,
        quotient,
        [quotient + 1, quotient - 1, quotient + 10],
        `${divisor} × ${commas(quotient)} = ${commas(n)}, so the answer is ${commas(quotient)}.`,
        commas
      );
    }
    if (kind === 2) {
      const divisor = ri(3, 9);
      const quotient = ri(20, 200);
      const rem = ri(1, divisor - 1);
      const n = divisor * quotient + rem;
      return mc(
        `What is the remainder when ${commas(n)} is divided by ${divisor}?`,
        rem,
        [rem + 1, rem - 1 || divisor - 1, divisor - rem],
        `${divisor} × ${commas(quotient)} = ${commas(divisor * quotient)}, and ${commas(n)} − ${commas(divisor * quotient)} = ${rem}.`
      );
    }
    const divisor = ri(4, 9);
    const quotient = ri(15, 60);
    const rem = ri(1, divisor - 1);
    const n = divisor * quotient + rem;
    const needed = quotient + 1;
    return mc(
      `${commas(n)} people travel in minibuses holding ${divisor} each. How many minibuses are needed?`,
      needed,
      [quotient, needed + 1, divisor],
      `${commas(n)} ÷ ${divisor} = ${quotient} remainder ${rem}. Those last ${rem} still need a bus, so ${needed}.`
    );
  }

  // ── 6. Order of operations ───────────────────────────────────────────────
  function bodmas() {
    const kind = ri(1, 3);
    if (kind === 1) {
      const a = ri(2, 12), b = ri(2, 12), c = ri(2, 12);
      const ans = a + b * c;
      return mc(
        `${a} + ${b} × ${c} = ?`,
        ans,
        [(a + b) * c, a * b + c, ans + 1],
        `Multiply before you add: ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${ans}. Doing it left to right would give ${(a + b) * c}, which is the trap.`
      );
    }
    if (kind === 2) {
      const a = ri(2, 12), b = ri(2, 12), c = ri(2, 9);
      const ans = (a + b) * c;
      return mc(
        `(${a} + ${b}) × ${c} = ?`,
        ans,
        [a + b * c, a * c + b, ans + c],
        `Brackets first: ${a} + ${b} = ${a + b}, then × ${c} = ${ans}.`
      );
    }
    const a = ri(20, 60), b = ri(2, 9), c = ri(2, 9);
    const ans = a - b * c;
    return mc(
      `${a} − ${b} × ${c} = ?`,
      ans,
      [(a - b) * c, a - b - c, ans - 1],
      `Multiplying comes before subtracting: ${b} × ${c} = ${b * c}, then ${a} − ${b * c} = ${ans}.`
    );
  }

  // ── 7. Factors, multiples, primes, squares ───────────────────────────────
  function numberProps() {
    const kind = ri(1, 5);
    if (kind === 1) {
      const n = ri(4, 12);
      return mc(
        `What is ${n} squared?`,
        n * n,
        [n * 2, n * n + n, (n + 1) * (n + 1)],
        `${n}² means ${n} × ${n} = ${n * n}.`
      );
    }
    if (kind === 2) {
      const n = pick([8, 27, 64, 125, 216, 1000]);
      const root = Math.round(Math.cbrt(n));
      return mc(
        `What is the cube root of ${n}?`,
        root,
        [root + 1, root - 1, n / 3],
        `${root} × ${root} × ${root} = ${n}.`
      );
    }
    if (kind === 3) {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      const p = pick(primes);
      const wrong = [];
      while (wrong.length < 3) {
        const c = ri(4, 50);
        if (!isPrime(c) && !wrong.includes(c)) wrong.push(c);
      }
      return mc(
        'Which of these is a prime number?',
        p, wrong,
        `${p} has exactly two factors, 1 and itself. The others can be divided by something else.`
      );
    }
    if (kind === 4) {
      const a = pick([12, 16, 18, 20, 24, 30, 36, 40, 48, 60]);
      const b = pick([8, 12, 15, 16, 18, 20, 24, 30]);
      const ans = gcd(a, b);
      // "the HCF of 24 and 24" teaches nothing, and an HCF of 1 has no
      // sensible distractors
      if (ans === 1 || a === b) return numberProps();
      return mc(
        `What is the highest common factor of ${a} and ${b}?`,
        ans,
        [ans * 2, ans + 1, Math.min(a, b)],
        `${ans} is the biggest number that divides exactly into both ${a} and ${b}.`
      );
    }
    const a = pick([3, 4, 5, 6, 8]);
    const b = pick([4, 6, 7, 9, 10]);
    const lcm = (a * b) / gcd(a, b);
    if (a === b) return numberProps();
    return mc(
      `What is the lowest common multiple of ${a} and ${b}?`,
      lcm,
      [a * b === lcm ? lcm + a : a * b, lcm + 1, a + b],
      `Count up in ${a}s and in ${b}s. ${lcm} is the first number that appears in both lists.`
    );
  }

  // ── 8. Fractions ─────────────────────────────────────────────────────────
  function fractions() {
    const kind = ri(1, 5);
    if (kind === 1) {
      const d1 = pick([2, 3, 4, 5, 6]);
      const d2 = pick([3, 4, 6, 8, 10, 12]);
      if (d1 === d2) return fractions();
      const n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
      const den = (d1 * d2) / gcd(d1, d2);
      const num = n1 * (den / d1) + n2 * (den / d2);
      if (num >= den) return fractions();
      const g = gcd(num, den);
      const ans = `${num / g}/${den / g}`;
      return mc(
        `${n1}/${d1} + ${n2}/${d2} = ?`,
        ans,
        [`${n1 + n2}/${d1 + d2}`, `${num + 1}/${den}`, `${n1 + n2}/${den}`],
        `Make the bottoms the same: ${den}. That gives ${n1 * (den / d1)}/${den} + ${n2 * (den / d2)}/${den} = ${num}/${den}${g > 1 ? ', which simplifies to ' + ans : ''}.`
      );
    }
    if (kind === 2) {
      const g = ri(2, 9);
      const n = ri(1, 8), d = n + ri(1, 8);
      const ans = `${n / gcd(n, d)}/${d / gcd(n, d)}`;
      return mc(
        `Simplify ${n * g}/${d * g}.`,
        ans,
        [`${n * g}/${d}`, `${n}/${d * g}`, `${n + 1}/${d}`, `${n}/${d + 1}`,
          `${n * 2}/${d * 2}` === ans ? `${n * 3}/${d * 3}` : `${n * 2}/${d * 2}`,
          `${d / gcd(n, d)}/${n / gcd(n, d)}`, `${n + 1}/${d + 1}`],
        `Both numbers divide by ${g * gcd(n, d)}, which leaves ${ans}.`
      );
    }
    if (kind === 3) {
      const whole = ri(2, 6), num = ri(1, 7), den = num + ri(1, 5);
      const imp = whole * den + num;
      return mc(
        `Write ${whole} and ${num}/${den} as an improper fraction.`,
        `${imp}/${den}`,
        [`${whole * num}/${den}`, `${imp + den}/${den}`, `${whole + num}/${den}`,
          `${imp - den}/${den}`, `${imp + 1}/${den}`, `${imp}/${den + 1}`,
          `${den}/${imp}`, `${imp - 1}/${den}`],
        `${whole} wholes is ${whole} × ${den} = ${whole * den} ${den}ths. Add the ${num}: ${imp}/${den}.`
      );
    }
    if (kind === 4) {
      const d1 = pick([2, 3, 4, 5]), d2 = pick([3, 4, 5, 6, 7]);
      const n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
      const num = n1 * n2, den = d1 * d2;
      const g = gcd(num, den);
      const ans = `${num / g}/${den / g}`;
      return mc(
        `${n1}/${d1} × ${n2}/${d2} = ?`,
        ans,
        [`${n1 + n2}/${d1 + d2}`, `${num}/${d1 + d2}`, `${n1 * d2}/${n2 * d1}`,
          `${num}/${den}` === ans ? `${num + 1}/${den}` : `${num}/${den}`,
          `${n1 + n2}/${d1 * d2}`, `${n1 * n2 + 1}/${den}`, `${n1}/${den}`, `${num}/${d1}`],
        `Multiply the tops and the bottoms: ${n1} × ${n2} = ${num}, ${d1} × ${d2} = ${den}${g > 1 ? ', which simplifies to ' + ans : ''}.`
      );
    }
    const den = pick([3, 4, 5, 6, 8, 10, 12]);
    const num = ri(1, den - 1);
    const mult = ri(3, 25);
    const whole = den * mult;
    const ans = num * mult;
    return mc(
      `What is ${num}/${den} of ${whole}?`,
      ans,
      [mult, whole - ans, ans + mult],
      `${whole} ÷ ${den} = ${mult}, then × ${num} = ${ans}.`
    );
  }

  // ── 9. Fractions, decimals and percentages ───────────────────────────────
  const FDP = [
    ['1/2', '0.5', '50%'], ['1/4', '0.25', '25%'], ['3/4', '0.75', '75%'],
    ['1/5', '0.2', '20%'], ['2/5', '0.4', '40%'], ['3/5', '0.6', '60%'],
    ['4/5', '0.8', '80%'], ['1/10', '0.1', '10%'], ['3/10', '0.3', '30%'],
    ['7/10', '0.7', '70%'], ['1/100', '0.01', '1%'], ['1/8', '0.125', '12.5%'],
    ['1/3', '0.333…', '33.3%'], ['1/20', '0.05', '5%']
  ];
  function percentages() {
    const kind = ri(1, 4);
    if (kind === 1) {
      const row = pick(FDP);
      const from = ri(0, 2);
      let to = ri(0, 2);
      while (to === from) to = ri(0, 2);
      const names = ['fraction', 'decimal', 'percentage'];
      const wrong = FDP.filter((r) => r !== row).slice(0, 8).map((r) => r[to]);
      return mc(
        `Write ${row[from]} as a ${names[to]}.`,
        row[to],
        shuffle(wrong),
        `${row[0]} = ${row[1]} = ${row[2]}. These are worth learning by heart.`
      );
    }
    if (kind === 2) {
      const pct = pick([5, 10, 15, 20, 25, 40, 50, 60, 75, 80]);
      const amount = pick([20, 40, 60, 80, 120, 160, 200, 240, 300, 400]);
      const ans = (amount * pct) / 100;
      if (!Number.isInteger(ans)) return percentages();
      return mc(
        `What is ${pct}% of ${amount}?`,
        ans,
        [amount / 10 * (pct / 10) * 2, ans + 10, amount - ans, ans / 2, ans * 2,
          ans + 5, amount / 10, ans - 1],
        `10% of ${amount} is ${amount / 10}, so ${pct}% is ${amount / 10} × ${pct / 10} = ${ans}.`
      );
    }
    if (kind === 3) {
      const price = pick([20, 40, 50, 60, 80, 120, 200]);
      const off = pick([10, 20, 25, 50]);
      const ans = price - (price * off) / 100;
      return mc(
        `A coat costs £${price}. In a sale it is ${off}% off. What do you pay?`,
        gbp(ans),
        [gbp((price * off) / 100), gbp(price - off), gbp(ans + 5), gbp(ans - 5),
          gbp(price), gbp(ans + 10), gbp(Math.round(ans / 2))],
        `${off}% of £${price} is £${(price * off) / 100}. Take it off: £${price} − £${(price * off) / 100} = £${ans}.`
      );
    }
    const total = pick([20, 25, 40, 50, 80, 200]);
    const part = Math.round(total * pick([0.1, 0.2, 0.25, 0.5, 0.75]));
    const ans = Math.round((part / total) * 100);
    return mc(
      `${part} out of ${total} as a percentage is ___.`,
      `${ans}%`,
      [`${part}%`, `${ans + 10}%`, `${Math.round(100 - ans)}%`, `${ans - 10}%`,
        `${ans + 5}%`, `${total}%`, `${ans * 2}%`],
      `${part}/${total} = ${(part / total).toFixed(2)}, and × 100 gives ${ans}%.`
    );
  }

  // ── 10. Ratio and proportion ─────────────────────────────────────────────
  function ratio() {
    const kind = ri(1, 3);
    const a = ri(1, 6), b = ri(1, 6);
    if (a === b) return ratio();
    if (kind === 1) {
      const mult = ri(3, 15);
      const total = (a + b) * mult;
      return mc(
        `Share £${total} in the ratio ${a}:${b}. What is the LARGER share?`,
        gbp(Math.max(a, b) * mult),
        [gbp(Math.min(a, b) * mult), gbp(total / 2), gbp(Math.max(a, b) * mult + mult),
          gbp(total - Math.max(a, b) * mult - 1)],
        `There are ${a + b} parts altogether. £${total} ÷ ${a + b} = £${mult} per part, so the larger share is ${Math.max(a, b)} × £${mult} = £${Math.max(a, b) * mult}.`
      );
    }
    if (kind === 2) {
      const mult = ri(2, 9);
      return mc(
        `A recipe uses ${a} eggs for every ${b} cups of flour. How many eggs for ${b * mult} cups?`,
        a * mult,
        [a + mult, b * mult, a * mult + 1],
        `${b * mult} ÷ ${b} = ${mult}, so everything is ${mult} times bigger. ${a} × ${mult} = ${a * mult} eggs.`
      );
    }
    const items = ri(3, 9);
    const cost = items * ri(2, 9);
    const want = items * ri(2, 5);
    const ans = (cost / items) * want;
    return mc(
      `${items} pens cost £${cost}. What do ${want} pens cost?`,
      gbp(ans),
      [gbp(cost + want), gbp(ans + cost / items), gbp(want), gbp(ans + 1)],
      `One pen is £${cost} ÷ ${items} = £${cost / items}. ${want} pens cost £${cost / items} × ${want} = £${ans}.`
    );
  }

  // ── 11. Algebra ──────────────────────────────────────────────────────────
  function algebra() {
    const kind = ri(1, 4);
    if (kind === 1) {
      const m = ri(2, 12), c = ri(1, 30), x = ri(2, 15);
      const total = m * x + c;
      return mc(
        `${m}n + ${c} = ${total}.  What is n?`,
        x,
        [x + 1, x - 1, total - c],
        `Take ${c} off both sides: ${m}n = ${total - c}. Then divide by ${m}: n = ${x}.`
      );
    }
    if (kind === 2) {
      const a = ri(2, 9), b = ri(2, 9), x = ri(2, 12);
      return mc(
        `If n = ${x}, what is ${a}n − ${b}?`,
        a * x - b,
        [a * x + b, (a - b) * x, a + x - b],
        `${a} × ${x} = ${a * x}, then take away ${b}: ${a * x - b}.`
      );
    }
    if (kind === 3) {
      const start = ri(2, 12), step = ri(2, 9);
      const seq = [0, 1, 2, 3].map((i) => start + i * step);
      const nth = ri(8, 20);
      const ans = start + (nth - 1) * step;
      return mc(
        `A sequence goes ${seq.join(', ')}… What is the ${nth}th term?`,
        ans,
        [start + nth * step, ans + step, nth * step],
        `The rule is add ${step}. To reach the ${nth}th term you add ${step} a total of ${nth - 1} times: ${start} + ${nth - 1} × ${step} = ${ans}.`
      );
    }
    const a = ri(2, 9), b = ri(2, 9);
    const ans = a * b;
    return mc(
      `A rectangle has sides n and ${a}. Its area is ${ans}. What is n?`,
      b,
      [ans - a, b + 1, a + b],
      `Area is length × width, so n = ${ans} ÷ ${a} = ${b}.`
    );
  }

  // ── 12. Area, perimeter and volume ───────────────────────────────────────
  function areaVolume() {
    const kind = ri(1, 5);
    if (kind === 1) {
      const b = ri(4, 20), h = ri(3, 16);
      const ans = (b * h) / 2;
      return mc(
        `A triangle has a base of ${b} cm and a height of ${h} cm. What is its area?`,
        `${ans} cm²`,
        [`${b * h} cm²`, `${b + h} cm²`, `${ans + b} cm²`, `${ans - 1} cm²`,
          `${ans + 1} cm²`, `${2 * (b + h)} cm²`, `${ans * 2} cm²`],
        `Area of a triangle is base × height ÷ 2: ${b} × ${h} = ${b * h}, halved is ${ans} cm².`
      );
    }
    if (kind === 2) {
      const l = ri(3, 12), w = ri(2, 10), h = ri(2, 10);
      return mc(
        `A cuboid is ${l} cm by ${w} cm by ${h} cm. What is its volume?`,
        `${l * w * h} cm³`,
        [`${2 * (l * w + l * h + w * h)} cm³`, `${l + w + h} cm³`, `${l * w} cm³`,
          `${l * h} cm³`, `${w * h} cm³`, `${l * w * h + 10} cm³`, `${4 * (l + w + h)} cm³`],
        `Volume is length × width × height: ${l} × ${w} × ${h} = ${l * w * h} cm³.`
      );
    }
    if (kind === 3) {
      const a = ri(5, 15), b = ri(3, 10), c = ri(2, 6), d = ri(2, 6);
      const ans = a * b + c * d;
      return mc(
        `An L-shape is made of a ${a} cm by ${b} cm rectangle and a ${c} cm by ${d} cm rectangle. What is its area?`,
        `${ans} cm²`,
        [`${(a + c) * (b + d)} cm²`, `${a * b} cm²`, `${ans + 10} cm²`, `${ans - 10} cm²`,
          `${a * b - c * d} cm²`, `${ans + 1} cm²`, `${2 * (a + b + c + d)} cm²`],
        `Split it: ${a} × ${b} = ${a * b} and ${c} × ${d} = ${c * d}. Add them: ${ans} cm².`
      );
    }
    if (kind === 4) {
      const area = pick([36, 49, 64, 81, 100, 121, 144]);
      const side = Math.sqrt(area);
      return mc(
        `A square has an area of ${area} cm². What is its perimeter?`,
        `${side * 4} cm`,
        [`${side} cm`, `${area * 4} cm`, `${side * 2} cm`, `${side * 4 + 4} cm`,
          `${area} cm`, `${side * 3} cm`, `${side * 8} cm`],
        `The side is √${area} = ${side} cm, and the perimeter is 4 × ${side} = ${side * 4} cm.`
      );
    }
    const b = ri(4, 14), h = ri(3, 12);
    return mc(
      `A parallelogram has a base of ${b} cm and a height of ${h} cm. What is its area?`,
      `${b * h} cm²`,
      [`${(b * h) / 2} cm²`, `${2 * (b + h)} cm²`, `${b + h} cm²`, `${b * h + b} cm²`,
        `${b * h - h} cm²`, `${b * h * 2} cm²`, `${b * b} cm²`],
      `Area of a parallelogram is base × height: ${b} × ${h} = ${b * h} cm². No halving, that is the triangle rule.`
    );
  }

  // ── 13. Angles ───────────────────────────────────────────────────────────
  function angles() {
    const kind = ri(1, 5);
    if (kind === 1) {
      const a = ri(20, 160);
      return mc(
        `Two angles sit on a straight line. One is ${a}°. What is the other?`,
        `${180 - a}°`,
        [`${360 - a}°`, `${90 - a}°`, `${180 - a + 10}°`, `${180 - a - 10}°`,
          `${a}°`, `${180 + a}°`, `${Math.round((180 - a) / 2)}°`],
        `Angles on a straight line add to 180°, so 180 − ${a} = ${180 - a}°.`
      );
    }
    if (kind === 2) {
      const a = ri(30, 110), b = ri(20, 160 - a);
      return mc(
        `A triangle has angles of ${a}° and ${b}°. What is the third?`,
        `${180 - a - b}°`,
        [`${360 - a - b}°`, `${180 - a}°`, `${180 - a - b + 10}°`, `${180 - a - b - 10}°`,
          `${180 - b}°`, `${a + b}°`, `${90 - a}°`],
        `The angles in a triangle add to 180°. ${a} + ${b} = ${a + b}, so the third is ${180 - a - b}°.`
      );
    }
    if (kind === 3) {
      const a = ri(40, 120), b = ri(40, 120), c = ri(40, 120);
      const d = 360 - a - b - c;
      if (d < 20 || d > 200) return angles();
      return mc(
        `A quadrilateral has angles of ${a}°, ${b}° and ${c}°. What is the fourth?`,
        `${d}°`,
        [`${180 - a}°`, `${d + 10}°`, `${360 - a}°`, `${d - 10}°`, `${d + 5}°`,
          `${180 - d}°`, `${a + b}°`, `${d * 2}°`],
        `The angles in a quadrilateral add to 360°. ${a} + ${b} + ${c} = ${a + b + c}, so the fourth is ${d}°.`
      );
    }
    if (kind === 4) {
      const a = ri(30, 150);
      return mc(
        `Two straight lines cross. One angle is ${a}°. What is the angle opposite it?`,
        `${a}°`,
        [`${180 - a}°`, `${90 - a}°`, `${360 - a}°`, `${a + 10}°`, `${a - 10}°`,
          `${180 + a}°`, `${a * 2}°`],
        `Vertically opposite angles are equal, so it is also ${a}°.`
      );
    }
    const sides = pick([5, 6, 8, 9, 10, 12]);
    const ans = 360 / sides;
    return mc(
      `A regular polygon has ${sides} sides. What is each exterior angle?`,
      `${ans}°`,
      [`${180 - ans}°`, `${sides}°`, `${ans * 2}°`, `${Math.round(ans / 2)}°`,
        `${ans + 10}°`, `${360 - ans}°`, `${180 / sides}°`],
      `The exterior angles of any polygon add to 360°, so each one is 360 ÷ ${sides} = ${ans}°.`
    );
  }

  // ── 14. Coordinates and shape movement ───────────────────────────────────
  function coordinates() {
    const kind = ri(1, 3);
    const x = ri(-8, 8), y = ri(-8, 8);
    if (kind === 1) {
      const dx = ri(-6, 6), dy = ri(-6, 6);
      if (dx === 0 && dy === 0) return coordinates();
      return mc(
        `The point (${x}, ${y}) is translated ${Math.abs(dx)} ${dx >= 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy >= 0 ? 'up' : 'down'}. Where does it land?`,
        `(${x + dx}, ${y + dy})`,
        [`(${x - dx}, ${y - dy})`, `(${y + dy}, ${x + dx})`, `(${x + dx}, ${y - dy})`,
          `(${x - dx}, ${y + dy})`, `(${x + dx + 1}, ${y + dy})`, `(${x + dx}, ${y + dy + 1})`,
          `(${x + dx - 1}, ${y + dy})`, `(${x}, ${y})`],
        `Add to the x for right and to the y for up: (${x} ${dx >= 0 ? '+' : '−'} ${Math.abs(dx)}, ${y} ${dy >= 0 ? '+' : '−'} ${Math.abs(dy)}) = (${x + dx}, ${y + dy}).`
      );
    }
    if (kind === 2) {
      const axis = pick(['x', 'y']);
      // reflecting (0, 0) lands on itself, and a point on the axis you are
      // reflecting in does not move, so there is no real question there
      if ((axis === 'x' && y === 0) || (axis === 'y' && x === 0)) return coordinates();
      const ans = axis === 'x' ? `(${x}, ${-y})` : `(${-x}, ${y})`;
      return mc(
        `Reflect the point (${x}, ${y}) in the ${axis}-axis. Where does it go?`,
        ans,
        [`(${-x}, ${-y})`, `(${y}, ${x})`, `(${x}, ${y})`, `(${-y}, ${-x})`,
          `(${x + 1}, ${-y})`, `(${-x}, ${y + 1})`],
        axis === 'x'
          ? 'Reflecting in the x-axis flips it up or down, so the y changes sign and the x stays put.'
          : 'Reflecting in the y-axis flips it left or right, so the x changes sign and the y stays put.'
      );
    }
    const x2 = ri(-8, 8), y2 = ri(-8, 8);
    if (x === x2 && y === y2) return coordinates();
    const mx = (x + x2) / 2, my = (y + y2) / 2;
    if (!Number.isInteger(mx) || !Number.isInteger(my)) return coordinates();
    return mc(
      `What is the midpoint of (${x}, ${y}) and (${x2}, ${y2})?`,
      `(${mx}, ${my})`,
      [`(${x + x2}, ${y + y2})`, `(${mx + 1}, ${my})`, `(${my}, ${mx})`,
        `(${mx}, ${my + 1})`, `(${mx - 1}, ${my})`, `(${x2 - x}, ${y2 - y})`],
      `Average each one: (${x} + ${x2}) ÷ 2 = ${mx} and (${y} + ${y2}) ÷ 2 = ${my}.`
    );
  }

  // ── 15. Averages and data ────────────────────────────────────────────────
  function averages() {
    const kind = ri(1, 3);
    const n = ri(4, 6);
    const vals = Array.from({ length: n }, () => ri(2, 40));
    const total = vals.reduce((a, b) => a + b, 0);
    if (kind === 1) {
      if (total % n !== 0) return averages();
      return mc(
        `Find the mean of ${vals.join(', ')}.`,
        total / n,
        [total, Math.max(...vals) - Math.min(...vals), total / n + 1],
        `Add them: ${total}. Divide by how many there are: ${total} ÷ ${n} = ${total / n}.`
      );
    }
    if (kind === 2) {
      const mean = ri(5, 25);
      const known = Array.from({ length: n - 1 }, () => ri(2, 40));
      const missing = mean * n - known.reduce((a, b) => a + b, 0);
      if (missing < 1 || missing > 60) return averages();
      return mc(
        `The mean of ${n} numbers is ${mean}. ${n - 1} of them are ${known.join(', ')}. What is the last one?`,
        missing,
        [mean, missing + 5, missing - 5],
        `All ${n} must total ${mean} × ${n} = ${mean * n}. The known ones make ${known.reduce((a, b) => a + b, 0)}, so the last is ${missing}.`
      );
    }
    const range = Math.max(...vals) - Math.min(...vals);
    return mc(
      `What is the range of ${vals.join(', ')}?`,
      range,
      [total, Math.max(...vals), range + 1],
      `Range is largest minus smallest: ${Math.max(...vals)} − ${Math.min(...vals)} = ${range}.`
    );
  }

  // ── 16. Measures and time ────────────────────────────────────────────────
  function measures() {
    const kind = ri(1, 4);
    if (kind === 1) {
      const km = Number((ri(1, 90) / 10).toFixed(1));
      return mc(
        `How many metres are the same as ${km} km?`,
        `${Math.round(km * 1000)} m`,
        [`${Math.round(km * 100)} m`, `${Math.round(km * 10)} m`, `${Math.round(km * 10000)} m`],
        `1 km is 1000 m, so ${km} × 1000 = ${Math.round(km * 1000)} m.`
      );
    }
    if (kind === 2) {
      const miles = pick([5, 10, 15, 20, 25, 30, 40, 50]);
      const km = (miles / 5) * 8;
      return mc(
        `Roughly how many kilometres are ${miles} miles? (5 miles is about 8 km)`,
        `${km} km`,
        [`${miles * 8} km`, `${(miles / 8) * 5} km`, `${km + 5} km`],
        `${miles} ÷ 5 = ${miles / 5}, then × 8 = ${km} km.`
      );
    }
    if (kind === 3) {
      const h = ri(1, 9), m = pick([15, 20, 30, 40, 45, 50]);
      return mc(
        `How many minutes are there in ${h} hours and ${m} minutes?`,
        h * 60 + m,
        [h * 60, h + m, h * 100 + m],
        `${h} × 60 = ${h * 60} minutes, plus ${m} is ${h * 60 + m}.`
      );
    }
    const dep = ri(6, 20), depM = pick([5, 12, 25, 37, 48]);
    const mins = pick([35, 47, 55, 68, 95, 110]);
    const total = dep * 60 + depM + mins;
    const ah = Math.floor(total / 60) % 24, am = total % 60;
    const f = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return mc(
      `A train leaves at ${f(dep, depM)} and the journey takes ${mins} minutes. When does it arrive?`,
      f(ah, am),
      [f(ah + 1, am), f(ah, (am + 10) % 60), f(dep, (depM + mins) % 60),
        f(ah, (am + 5) % 60), f(ah, (am + 55) % 60), f(ah - 1 < 0 ? 23 : ah - 1, am),
        f(ah, (am + 30) % 60), f(dep, depM)],
      `${mins} minutes is ${Math.floor(mins / 60)} h ${mins % 60} min. From ${f(dep, depM)} that reaches ${f(ah, am)}.`
    );
  }

  const TOPICS = [
    { id: 'place', name: 'Place Value and Decimals', icon: '\u{1F522}', gen: placeValue,
      rule: 'Each column is ten times the one to its right, and that carries on past the decimal point into tenths, hundredths and thousandths.',
      points: [
        'Read big numbers in groups of three from the right: 3,472,918 is 3 million, 472 thousand, 918.',
        'After the point: the first digit is tenths, the second hundredths, the third thousandths.',
        'To compare decimals, line up the points and compare column by column. 0.4 is bigger than 0.39.',
        'Adding a zero on the END of a decimal changes nothing: 0.4 and 0.40 are the same.'
      ],
      example: { q: 'What is the value of the 6 in 4.062?', steps: ['After the point: 0 is tenths, 6 is hundredths, 2 is thousandths.', 'The 6 sits in the hundredths column.', 'One hundredth is 0.01, so six of them is 0.06.'], a: '0.06' } },

    { id: 'rounding', name: 'Rounding', icon: '\u{1F3AF}', gen: rounding,
      rule: 'Look at the digit to the RIGHT of the place you are rounding to. 5 or more rounds up, less than 5 rounds down.',
      points: [
        'Underline the column you are rounding to, then look at the digit next to it. That one digit decides it.',
        'Everything after the rounding column becomes zero, or disappears for decimals.',
        '2 decimal places means two digits after the point, so 3.847 becomes 3.85.',
        'Watch the knock-on: 3.98 to 1 d.p. is 4.0, not 3.10.'
      ],
      example: { q: 'Round 47,382 to the nearest thousand.', steps: ['The thousands digit is 7.', 'Look at the digit to its right, which is 3.', '3 is less than 5, so round down and the rest become zeros.'], a: '47,000' } },

    { id: 'negatives', name: 'Negative Numbers', icon: '\u{1F321}️', gen: negatives,
      rule: 'Negative numbers carry on left of zero. Moving right always makes a number bigger, even past zero.',
      points: [
        'To find the difference across zero, count up to zero first, then carry on. From −7 to 4 is 7 then 4, so 11.',
        'Two minus signs together become a plus: 5 − (−3) is the same as 5 + 3.',
        'The bigger the digit after the minus sign, the SMALLER the number. −20 is less than −2.',
        'A negative times a positive gives a negative. A negative times a negative gives a positive.'
      ],
      example: { q: 'What is −6 − (−9)?', steps: ['The two minus signs together become a plus.', 'So it is −6 + 9.', 'It takes 6 to get back to zero, leaving 3.'], a: '3' } },

    { id: 'longmult', name: 'Long Multiplication', icon: '✖️', gen: longMult,
      rule: 'Split the smaller number into tens and ones, multiply by each part, then add the two answers.',
      points: [
        'Multiply by the ones first, then by the tens. Remember the tens row ends in a zero.',
        'Line the two rows up carefully in their columns before you add them.',
        'Estimate first so you can spot a silly answer: 342 × 28 is roughly 340 × 30 = 10,200.',
        'Check the size of the answer. Three digits times two digits gives four or five digits, never three.'
      ],
      example: { q: '342 × 28', steps: ['342 × 8 = 2,736.', '342 × 20 = 6,840.', '2,736 + 6,840 = 9,576.'], a: '9,576' } },

    { id: 'division', name: 'Division', icon: '➗', gen: division,
      rule: 'Divide from the left, carrying any remainder into the next digit.',
      points: [
        'Short division: how many times does it go into each digit, and what is left over?',
        'Carry the remainder to the front of the next digit, so a leftover 2 before a 7 makes 27.',
        'Check by multiplying back: your answer times the divisor should give the number you started with.',
        'In a word problem, decide what the remainder MEANS. Leftover people still need a bus, so you round up.'
      ],
      example: { q: '852 ÷ 6', steps: ['8 ÷ 6 = 1 remainder 2. Write 1, carry the 2.', 'The 2 makes the next digit 25. 25 ÷ 6 = 4 remainder 1. Write 4, carry the 1.', 'The 1 makes the last digit 12. 12 ÷ 6 = 2.'], a: '142' } },

    { id: 'bodmas', name: 'Order of Operations', icon: '\u{1F9EE}', gen: bodmas,
      rule: 'Brackets first, then multiply and divide, then add and subtract. Never simply left to right.',
      points: [
        'BODMAS: Brackets, Orders (powers), Division and Multiplication, Addition and Subtraction.',
        'Divide and multiply rank equally, so do those left to right. Same for add and subtract.',
        '3 + 4 × 5 is 23, not 35. The multiplying happens first.',
        'Brackets beat everything, so they are how you force a different order.'
      ],
      example: { q: '20 − 3 × 4', steps: ['Multiplying comes before subtracting.', '3 × 4 = 12.', '20 − 12 = 8. Doing it left to right would wrongly give 68.'], a: '8' } },

    { id: 'numberprops', name: 'Factors, Primes and Squares', icon: '\u{1F531}', gen: numberProps,
      rule: 'A factor divides into a number exactly. A multiple is what you get counting up in it. A prime has exactly two factors.',
      points: [
        'Find factors in PAIRS: for 24, 1 and 24, 2 and 12, 3 and 8, 4 and 6.',
        'A prime has exactly two factors, 1 and itself. 1 is not prime, and 2 is the only even prime.',
        'Learn the squares to 12: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.',
        'The highest common factor is the biggest number that goes into both. The lowest common multiple is the first number in both times tables.'
      ],
      example: { q: 'What is the highest common factor of 24 and 36?', steps: ['Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24.', 'Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.', 'The biggest one in both lists is 12.'], a: '12' } },

    { id: 'fractions', name: 'Fractions', icon: '\u{1F355}', gen: fractions,
      rule: 'To add or subtract, the bottoms must match. To multiply, they do not.',
      points: [
        'To add or subtract, find a common denominator first, then add the tops only.',
        'To multiply, multiply the tops together and the bottoms together. Simplify at the end.',
        'To find a fraction of an amount, divide by the bottom and multiply by the top.',
        'An improper fraction has a top bigger than its bottom. To make one from a mixed number: whole × bottom, then add the top.'
      ],
      example: { q: '2/3 + 1/4', steps: ['The lowest number both 3 and 4 go into is 12.', '2/3 becomes 8/12 and 1/4 becomes 3/12.', '8/12 + 3/12 = 11/12.'], a: '11/12' } },

    { id: 'percentages', name: 'Decimals and Percentages', icon: '\u{1F4C8}', gen: percentages,
      rule: 'A percentage is just a fraction out of 100. Learn the common ones by heart and most questions become quick.',
      points: [
        'Know these cold: 1/2 = 0.5 = 50%, 1/4 = 0.25 = 25%, 1/5 = 0.2 = 20%, 1/10 = 0.1 = 10%, 1/8 = 0.125 = 12.5%.',
        'To find 10%, divide by 10. To find 1%, divide by 100. Build the rest from those.',
        '15% is 10% plus half of the 10%. 30% is 10% times three.',
        'In a sale, work out the discount then TAKE IT OFF. The question usually asks what you pay, not what you save.'
      ],
      example: { q: 'What is 15% of 240?', steps: ['10% of 240 is 24.', '5% is half of that, so 12.', '24 + 12 = 36.'], a: '36' } },

    { id: 'ratio', name: 'Ratio and Proportion', icon: '⚖️', gen: ratio,
      rule: 'For a ratio, add the parts, divide to find ONE part, then multiply back up.',
      points: [
        'In the ratio 3:2 there are 5 parts altogether, not 2 and not 3.',
        'Divide the total by the number of parts to find what one part is worth.',
        'Then multiply by each side of the ratio to get each share.',
        'Check at the end: your two shares must add back up to the total you started with.'
      ],
      example: { q: 'Share £60 in the ratio 3:2.', steps: ['3 + 2 = 5 parts.', '£60 ÷ 5 = £12 for one part.', '3 × £12 = £36 and 2 × £12 = £24. They add back to £60.'], a: '£36 and £24' } },

    { id: 'algebra', name: 'Algebra', icon: '\u{1F520}', gen: algebra,
      rule: 'A letter just stands for a number you do not know yet. Undo what has been done to it, in reverse order.',
      points: [
        'To solve, do the SAME thing to both sides to keep it balanced.',
        'Undo in reverse: take away before you divide, because that is the opposite order to how it was built.',
        '3n means 3 × n. There is no multiply sign but it is still there.',
        'Always check by putting your answer back into the original.'
      ],
      example: { q: '4n + 7 = 31. What is n?', steps: ['Take 7 off both sides: 4n = 24.', 'Divide both sides by 4: n = 6.', 'Check: 4 × 6 + 7 = 31. Correct.'], a: '6' } },

    { id: 'areavolume', name: 'Area, Perimeter and Volume', icon: '\u{1F4D0}', gen: areaVolume,
      rule: 'Perimeter is the distance round the edge. Area is the flat space inside. Volume is the space filled.',
      points: [
        'Rectangle area is length × width. Triangle area is base × height ÷ 2.',
        'Parallelogram area is base × height, with NO halving. That halving is the triangle rule.',
        'Volume of a cuboid is length × width × height.',
        'Units give it away: perimeter in cm, area in cm², volume in cm³.'
      ],
      example: { q: 'A triangle has a base of 12 cm and a height of 7 cm. What is its area?', steps: ['Multiply base by height: 12 × 7 = 84.', 'A triangle is half a rectangle, so halve it.', '84 ÷ 2 = 42 cm².'], a: '42 cm²' } },

    { id: 'angles', name: 'Angles', icon: '\u{1F4CF}', gen: angles,
      rule: 'Learn the four totals and most angle questions become a subtraction.',
      points: [
        'Angles on a straight line add to 180°. Angles around a point add to 360°.',
        'The angles in a triangle add to 180°. In a quadrilateral they add to 360°.',
        'When two lines cross, the angles opposite each other are equal.',
        'The exterior angles of any polygon add to 360°, however many sides it has.'
      ],
      example: { q: 'A triangle has angles of 63° and 49°. What is the third?', steps: ['The three angles must total 180°.', '63 + 49 = 112.', '180 − 112 = 68°.'], a: '68°' } },

    { id: 'coordinates', name: 'Coordinates and Shapes', icon: '\u{1F4CC}', gen: coordinates,
      rule: 'Along the corridor, then up the stairs. The x comes first, and it can be negative.',
      points: [
        'Four quadrants means x and y can each be positive or negative.',
        'Translation slides a shape. Add to x to go right, add to y to go up.',
        'Reflecting in the x-axis flips it up or down, so the y changes sign.',
        'Reflecting in the y-axis flips it left or right, so the x changes sign.'
      ],
      example: { q: 'Reflect the point (3, −5) in the x-axis.', steps: ['Reflecting in the x-axis flips it up or down.', 'The x stays as it is: 3.', 'The y changes sign: −5 becomes 5.'], a: '(3, 5)' } },

    { id: 'averages', name: 'Mean, Range and Data', icon: '\u{1F4CA}', gen: averages,
      rule: 'The mean is the total shared out equally. The range is how spread out the numbers are.',
      points: [
        'Mean: add them all up, then divide by how many there are.',
        'Range: biggest minus smallest. It is one number, not two.',
        'To find a missing value from a mean, work out what they must ALL total first.',
        'Always check how many numbers there are. Getting the count wrong is the usual mistake.'
      ],
      example: { q: 'The mean of 4 numbers is 12. Three are 8, 15 and 11. What is the fourth?', steps: ['All four must total 12 × 4 = 48.', 'The three known ones make 8 + 15 + 11 = 34.', '48 − 34 = 14.'], a: '14' } },

    { id: 'measures', name: 'Measures and Timetables', icon: '⏱️', gen: measures,
      rule: 'Convert to the same unit before you compare or calculate.',
      points: [
        '10 mm in a cm, 100 cm in a metre, 1000 m in a kilometre, 1000 g in a kg, 1000 ml in a litre.',
        'Rough imperial: 5 miles is about 8 km, 1 kg is about 2.2 lb, 1 litre is about 1.75 pints.',
        'For durations, count on to the next whole hour first, then count the rest.',
        'On timetables everything is 24-hour. After 12:00, take 12 away to get the afternoon time.'
      ],
      example: { q: 'A train leaves at 14:35 and takes 50 minutes. When does it arrive?', steps: ['From 14:35, count 25 minutes to reach 15:00.', 'You have used 25 of the 50, so 25 are left.', '25 minutes past 15:00 is 15:25.'], a: '15:25' } }
  ];

  function makeSet(topicId, n) {
    const topic = TOPICS.find((t) => t.id === topicId) || pick(TOPICS);
    const out = [], seen = new Set();
    let guard = 0;
    while (out.length < n && guard++ < n * 80) {
      const q = topic.gen();
      if (seen.has(q.q)) continue;
      seen.add(q.q);
      out.push(q);
    }
    return out;
  }

  function makeMixed(n) {
    const out = [], seen = new Set();
    let guard = 0;
    while (out.length < n && guard++ < n * 80) {
      const q = pick(TOPICS).gen();
      if (seen.has(q.q)) continue;
      seen.add(q.q);
      out.push(q);
    }
    return out;
  }

  root.Y56_MATHS = { TOPICS, makeSet, makeMixed };
})(typeof window !== 'undefined' ? window : globalThis);
