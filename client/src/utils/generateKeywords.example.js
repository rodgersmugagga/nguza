// Example usage of generateKeywords helper
import { generateSearchKeywords } from './generateKeywords';

// Basic usage with a simple agricultural listing title
const basicExample = generateSearchKeywords('100 kg Maize in Masaka');
console.log('Basic keywords:', basicExample);
// Output includes: ['100kg maize', '100-kg maize', 'maize', 'maize masaka', '100 kg', ...]

// Usage with inputs (fertilizer) example
const inputsExample = generateSearchKeywords('50 bags NPK Fertilizer in Kampala');
console.log('Fertilizer keywords:', inputsExample);
// Output includes: ['50bags npk', 'npk fertilizer', 'fertilizer Kampala', '50 bags', ...]

// Usage with livestock example
const livestockExample = generateSearchKeywords('10 Friesian Cattle for Sale in Mbarara');
console.log('Livestock keywords:', livestockExample);
// Output includes: ['10friesian cattle', 'friesian cattle', 'cattle for sale', 'mbarara', ...]