/**
 * generateKeywords.js
 *
 * Helper to create searchable keyword variations from a listing title.
 * - Normalizes text
 * - Generates n-grams and concatenations
 * - Adds local/informal variants and common marketplace abbreviations
 * - Produces deduplicated list ordered from more specific -> broader
 *
 * Usage:
 *   import { generateSearchKeywords } from '../utils/generateKeywords';
 *   const keywords = generateSearchKeywords('100 kg Maize in Masaka');
 */

const ABBREVIATIONS = {
  kilogram: ['kg'],
  kilograms: ['kg'],
  bag: ['bag'],
  bags: ['bags'],
  tonne: ['t', 'tonne'],
  tonnes: ['t', 'tonnes'],
  'for sale': ['sale'],
  organic: ['org', 'organic'],
  'grade a': ['gradeA', 'grade-a'],
  'grade b': ['gradeB', 'grade-b']
};

// Small set of local/informal spellings or marketplace misspellings common in local listings
const LOCAL_VARIANTS = {
  apartment: ['apartment', 'appartment', 'apartmnt'],
  kiosk: ['kiosk', 'kiosks', 'kisok'],
  salon: ['salon', 'saloon'],
  shop: ['shop', 'shope'],
  toilet: ['toilet', 'latrine'],
};

const uniq = (arr) => Array.from(new Set(arr));

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[^a-z0-9\s-]/g, ' ') // remove punctuation except hyphen/space
    .replace(/\s+/g, ' ')
    .trim();
}

function tokensFromTitle(title) {
  const n = normalize(title);
  if (!n) return [];
  return n.split(' ');
}


export function generateSearchKeywords(title, opts = {}) {
  // opts: { maxNgram: 4 }
  const maxN = opts.maxNgram || 4;
  const out = [];

  const normalized = normalize(title);
  if (!normalized) return [];

  // exact normalized title
  out.push(normalized);

  const tokens = tokensFromTitle(title);
  const tlen = tokens.length;

  // include each token and local variants & abbreviations
  for (let i = 0; i < tlen; i++) {
    const w = tokens[i];
    out.push(w);

    // add abbreviation expansions if available
    Object.keys(ABBREVIATIONS).forEach((key) => {
      if (w === key || key.includes(w)) {
        ABBREVIATIONS[key].forEach((a) => out.push(a));
      }
    });

    // local variants map
    Object.keys(LOCAL_VARIANTS).forEach((k) => {
      if (w === k) {
        LOCAL_VARIANTS[k].forEach((v) => out.push(v));
      }
    });
  }

  // Generate n-grams (contiguous word ranges) up to maxN
  for (let size = 2; size <= Math.min(maxN, tlen); size++) {
    for (let i = 0; i + size <= tlen; i++) {
      const slice = tokens.slice(i, i + size).join(' ');
      out.push(slice);
      out.push(slice.replace(/\s+/g, '')); // concatenated
      out.push(slice.replace(/\s+/g, '-')); // dashed
    }
  }

  // Numeric + unit shorthand (e.g., '100 kg' -> '100kg', '100-kg')
  for (let i = 0; i < tlen; i++) {
    const w = tokens[i];
    const next = tokens[i + 1];
    if (/^\d+(?:\.\d+)?$/.test(w) && next) {
      // units: kg, bags, tonne, t
      if (/^(kg|kilogram|kilograms|bags?|tonne|tonnes|t)$/i.test(next)) {
        out.push(`${w}${next}`);
        out.push(`${w}-${next}`);
        out.push(`${w} ${next}`);
      }
    }
  }

  // Per-token combos with abbreviations for agriculture e.g., '100 kg maize' -> '100kg maize'
  const hasNumber = tokens.find((t) => /^\d+(?:\.\d+)?$/.test(t));
  if (hasNumber) {
    const num = hasNumber.match(/^\d+(?:\.\d+)?$/)[0];
    const unitIdx = tokens.indexOf(hasNumber) + 1;
    const unitToken = tokens[unitIdx];
    const nextToken = tokens[unitIdx + 1];
    if (unitToken && /^(kg|kilogram|kilograms|bags?|tonne|tonnes|t)$/i.test(unitToken) && nextToken) {
      out.push(`${num}${unitToken} ${nextToken}`);
      out.push(`${num}-${unitToken} ${nextToken}`);
    }
  }

  // Include individual word abbreviations in context (e.g., '1br', 'br')
  tokens.forEach((w) => {
    Object.keys(ABBREVIATIONS).forEach((key) => {
      if (w.includes(key) || key.includes(w)) {
        ABBREVIATIONS[key].forEach((a) => out.push(a));
      }
    });
  });

  // Add title with removed short words (common stopwords removal for broader matches)
  const stopWords = new Set(['in', 'near', 'at', 'the', 'for', 'of', 'and', 'a']);
  const withoutStops = tokens.filter((t) => !stopWords.has(t)).join(' ');
  if (withoutStops && withoutStops !== normalized) out.push(withoutStops);

  // Add some fuzzy misspelling variants from LOCAL_VARIANTS across the title
  Object.keys(LOCAL_VARIANTS).forEach((k) => {
    if (normalized.includes(k)) {
      LOCAL_VARIANTS[k].forEach((variant) => {
        out.push(normalized.replace(k, variant));
      });
    }
  });

  // final cleanup, dedupe and order
  const cleaned = out
    .map((s) => normalize(s))
    .filter(Boolean);

  return uniq(cleaned);
}

export default generateSearchKeywords;
