import District from '../models/location.model.js';
import CropType from '../models/cropType.model.js';
import LivestockBreed from '../models/livestockBreed.model.js';

// Uganda districts seed data (sample - add all 134 districts in production)
const DISTRICTS_DATA = [
  {
    name: 'Kampala',
    region: 'Central',
    code: 'KLA',
    subcounties: [
      {
        name: 'Central Division',
        parishes: [
          { name: 'Nakasero', villages: ['Nakasero Hill', 'Kisozi', 'Kampala Road'] },
          { name: 'Kololo', villages: ['Kololo North', 'Kololo Central', 'Kololo South'] },
          { name: 'Kampala Central', villages: ['Market Area', 'City Centre'] }
        ]
      },
      {
        name: 'Kawempe Division',
        parishes: [
          { name: 'Kawempe', villages: ['Kawempe North', 'Kawempe South'] },
          { name: 'Kazo', villages: ['Kazo A', 'Kazo B'] },
          { name: 'Makerere', villages: ['Makerere 1', 'Makerere 2'] }
        ]
      },
      {
        name: 'Makindye Division',
        parishes: [
          { name: 'Makindye', villages: ['Makindye Central', 'Luzira Road'] },
          { name: 'Kibuye', villages: ['Kibuye East', 'Kibuye West'] },
          { name: 'Nsambya', villages: ['Nsambya Lower', 'Nsambya Upper'] }
        ]
      },
      {
        name: 'Nakawa Division',
        parishes: [
          { name: 'Nakawa', villages: ['Nakawa Industrial', 'Nakawa Estate'] },
          { name: 'Ntinda', villages: ['Ntinda Central', 'Ntinda West'] },
          { name: 'Naguru', villages: ['Naguru South', 'Naguru Hill'] }
        ]
      },
      {
        name: 'Rubaga Division',
        parishes: [
          { name: 'Rubaga', villages: ['Rubaga North', 'Rubaga Market'] },
          { name: 'Namirembe', villages: ['Namirembe Hill'] },
          { name: 'Lungujja', villages: ['Lungujja A', 'Lungujja B'] }
        ]
      }
    ]
  },
  {
    name: 'Wakiso',
    region: 'Central',
    code: 'WAK',
    subcounties: [
      {
        name: 'Kira',
        parishes: [
          { name: 'Kira', villages: ['Kira Town', 'Bweyogerere'] },
          { name: 'Kimwaanyi', villages: ['Kimwaanyi A', 'Kimwaanyi B'] },
          { name: 'Kasokoso', villages: ['Kasokoso 1'] }
        ]
      },
      {
        name: 'Entebbe',
        parishes: [
          { name: 'Entebbe', villages: ['Entebbe Town', 'Lubiri'] },
          { name: 'Katabi', villages: ['Katabi Central'] },
          { name: 'Nakiwogo', villages: ['Nakiwogo A'] }
        ]
      },
      {
        name: 'Nangabo',
        parishes: [
          { name: 'Nangabo', villages: ['Nangabo Centre'] },
          { name: 'Busukuma', villages: ['Busukuma East'] }
        ]
      },
      { name: 'Kakiri', parishes: ['Kakiri', 'Gombe'] }
    ]
  },
  {
    name: 'Mukono',
    region: 'Central',
    code: 'MUK',
    subcounties: [
      {
        name: 'Mukono Town Council',
        parishes: [
          { name: 'Mukono', villages: ['Mukono Central', 'Mukono East'] },
          { name: 'Namilyango', villages: ['Namilyango Hill'] }
        ]
      },
      {
        name: 'Goma',
        parishes: [
          { name: 'Goma', villages: ['Goma A'] },
          { name: 'Seeta', villages: ['Seeta Central'] }
        ]
      },
      {
        name: 'Ntenjeru',
        parishes: [
          { name: 'Ntenjeru', villages: ['Ntenjeru A'] },
          { name: 'Kimenyedde', villages: ['Kimenyedde Village'] }
        ]
      }
    ]
  },
  {
    name: 'Masaka',
    region: 'Central',
    code: 'MSK',
    subcounties: [
      { name: 'Masaka Municipality', parishes: ['Masaka', 'Katwe', 'Nyendo'] },
      { name: 'Kyesiiga', parishes: ['Kyesiiga'] },
      { name: 'Mukungwe', parishes: ['Mukungwe'] }
    ]
  },
  {
    name: 'Lwengo',
    region: 'Central',
    code: 'LWE',
    subcounties: [
      { name: 'Kyazanga', parishes: ['Kyazanga', 'Lwengo', 'Kkingo'] },
      { name: 'Ndagwe', parishes: ['Ndagwe', 'Kalamba'] },
      { name: 'Malongo', parishes: ['Malongo'] }
    ]
  },
  {
    name: 'Mbarara',
    region: 'Western',
    code: 'MBA',
    subcounties: [
      {
        name: 'Mbarara Municipality',
        parishes: [
          { name: 'Mbarara', villages: ['Mbarara Central', 'Mbarara West'] },
          { name: 'Kamukuzi', villages: ['Kamukuzi East'] },
          { name: 'Kakoba', villages: ['Kakoba North'] }
        ]
      },
      { name: 'Rubaya', parishes: ['Rubaya'] },
      { name: 'Nyamitanga', parishes: ['Nyamitanga'] }
    ]
  },
  {
    name: 'Jinja',
    region: 'Eastern',
    code: 'JIN',
    subcounties: [
      {
        name: 'Jinja Municipality',
        parishes: [
          { name: 'Jinja', villages: ['Jinja Town', 'Walukuba Road'] },
          { name: 'Walukuba', villages: ['Walukuba North'] },
          { name: 'Mpumudde', villages: ['Mpumudde Central'] }
        ]
      },
      { name: 'Butembe', parishes: ['Butembe'] },
      { name: 'Budondo', parishes: ['Budondo'] }
    ]
  },
  {
    name: 'Gulu',
    region: 'Northern',
    code: 'GUL',
    subcounties: [
      { name: 'Gulu Municipality', parishes: ['Gulu', 'Layibi', 'Bardege'] },
      { name: 'Bungatira', parishes: ['Bungatira'] },
      { name: 'Awach', parishes: ['Awach'] }
    ]
  },
  {
    name: 'Mbale',
    region: 'Eastern',
    code: 'MBL',
    subcounties: [
      {
        name: 'Mbale Municipality',
        parishes: [
          { name: 'Mbale', villages: ['Mbale Central', 'Mbale North'] },
          { name: 'Industrial Area', villages: ['Industrial Zone'] },
          { name: 'Namabasa', villages: ['Namabasa A'] }
        ]
      },
      { name: 'Bungokho', parishes: ['Bungokho'] },
      { name: 'Bubulo', parishes: ['Bubulo'] }
    ]
  },
  {
    name: 'Lira',
    region: 'Northern',
    code: 'LIR',
    subcounties: [
      { name: 'Lira Municipality', parishes: ['Lira', 'Adyel', 'Ojwina'] },
      { name: 'Aromo', parishes: ['Aromo'] },
      { name: 'Barr', parishes: ['Barr'] }
    ]
  }
];

// Crop types seed data
const CROP_TYPES_DATA = [
  // Grains & Cereals
  {
    name: 'Maize',
    category: 'Grains & Cereals',
    commonVarieties: ['Longe 10H', 'Longe 5', 'NARO Hybrid 2', 'PAN 691', 'DK 8031'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10, 11],
      yearRound: false
    },
    averageYield: { value: 2.5, unit: 'tonnes/acre' },
    description: 'Staple cereal crop widely grown across Uganda',
    icon: '🌽'
  },
  {
    name: 'Rice',
    category: 'Grains & Cereals',
    commonVarieties: ['NERICA 4', 'NERICA 1', 'WITA 9', 'K85'],
    seasonality: {
      firstSeason: [3, 4, 5, 6],
      secondSeason: [9, 10, 11],
      yearRound: false
    },
    averageYield: { value: 1.5, unit: 'tonnes/acre' },
    description: 'Paddy rice grown in wetlands and irrigated areas',
    icon: '🌾'
  },
  {
    name: 'Millet',
    category: 'Grains & Cereals',
    commonVarieties: ['Finger Millet', 'Pearl Millet', 'SEREMI 1', 'SEREMI 2'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'Drought-resistant cereal crop',
    icon: '🌾'
  },

  // Legumes & Pulses
  {
    name: 'Beans',
    category: 'Legumes & Pulses',
    commonVarieties: ['NABE 15', 'NABE 16', 'K132', 'K131', 'Masindi Yellow'],
    seasonality: {
      firstSeason: [2, 3, 4],
      secondSeason: [8, 9, 10],
      yearRound: false
    },
    averageYield: { value: 0.8, unit: 'tonnes/acre' },
    description: 'Common beans - major protein source',
    icon: '🫘'
  },
  {
    name: 'Groundnuts',
    category: 'Legumes & Pulses',
    commonVarieties: ['Red Beauty', 'Serenut 1', 'Serenut 2', 'Serenut 3'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'Peanuts for oil and consumption',
    icon: '🥜'
  },
  {
    name: 'Soybeans',
    category: 'Legumes & Pulses',
    commonVarieties: ['Maksoy 1N', 'Maksoy 2N', 'Maksoy 3N'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'High-protein legume crop',
    icon: '🫛'
  },

  // Vegetables
  {
    name: 'Tomatoes',
    category: 'Vegetables',
    commonVarieties: ['MT56', 'Moneymaker', 'Roma VF', 'Marglobe'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Fresh market and processing tomatoes',
    icon: '🍅'
  },
  {
    name: 'Cabbage',
    category: 'Vegetables',
    commonVarieties: ['Gloria', 'Copenhagen Market', 'Drumhead'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Fresh vegetable for salads and cooking',
    icon: '🥬'
  },
  {
    name: 'Onions',
    category: 'Vegetables',
    commonVarieties: ['Red Creole', 'Bombay Red', 'Texas Grano'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Bulb onions for cooking',
    icon: '🧅'
  },

  // Fruits
  {
    name: 'Bananas',
    category: 'Fruits',
    commonVarieties: ['Matooke', 'Bogoya', 'Sukali Ndiizi', 'Gonja'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Cooking and dessert bananas',
    icon: '🍌'
  },
  {
    name: 'Pineapples',
    category: 'Fruits',
    commonVarieties: ['Smooth Cayenne', 'Queen Victoria'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Fresh fruit and juice production',
    icon: '🍍'
  },
  {
    name: 'Mangoes',
    category: 'Fruits',
    commonVarieties: ['Apple Mango', 'Tommy Atkins', 'Kent', 'Ngowe'],
    seasonality: {
      firstSeason: [11, 12, 1, 2],
      secondSeason: [5, 6, 7],
      yearRound: false
    },
    description: 'Fresh fruit for local and export markets',
    icon: '🥭'
  },

  // Root Crops
  {
    name: 'Cassava',
    category: 'Root Crops',
    commonVarieties: ['NASE 14', 'NASE 19', 'TME 14', 'Magana'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Starchy root crop for food and processing',
    icon: '🥔'
  },
  {
    name: 'Sweet Potatoes',
    category: 'Root Crops',
    commonVarieties: ['NASPOT 1', 'NASPOT 10', 'NASPOT 11', 'Ejumula'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'Orange and white-fleshed varieties',
    icon: '🍠'
  },

  // Cash Crops
  {
    name: 'Coffee',
    category: 'Cash Crops',
    commonVarieties: ['Robusta', 'Arabica', 'Erecta'],
    seasonality: {
      firstSeason: [10, 11, 12, 1],
      secondSeason: [5, 6, 7],
      yearRound: false
    },
    description: 'Major export crop - Robusta and Arabica',
    icon: '☕'
  },
  {
    name: 'Tea',
    category: 'Cash Crops',
    commonVarieties: ['Clone 6/8', 'Clone 301', 'Clone 303'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Export tea for processing',
    icon: '🍵'
  },
  {
    name: 'Cotton',
    category: 'Cash Crops',
    commonVarieties: ['BPA', 'Albar', 'NACO'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [],
      yearRound: false
    },
    description: 'Fiber crop for textile industry',
    icon: '🌿'
  }
];

// Livestock breeds seed data
const LIVESTOCK_BREEDS_DATA = [
  // Cattle
  {
    name: 'Friesian',
    animalType: 'Cattle',
    purpose: ['Dairy'],
    characteristics: {
      averageWeight: { value: 600, unit: 'kg' },
      maturityAge: '2 years',
      productionRate: '20-30 litres/day'
    },
    description: 'High milk-producing dairy cattle',
    icon: '🐄'
  },
  {
    name: 'Ankole',
    animalType: 'Cattle',
    purpose: ['Meat', 'Dual Purpose'],
    characteristics: {
      averageWeight: { value: 400, unit: 'kg' },
      maturityAge: '3 years',
      productionRate: '5-10 litres/day'
    },
    description: 'Indigenous long-horned cattle',
    icon: '🐄'
  },
  {
    name: 'Jersey',
    animalType: 'Cattle',
    purpose: ['Dairy'],
    characteristics: {
      averageWeight: { value: 450, unit: 'kg' },
      maturityAge: '2 years',
      productionRate: '15-25 litres/day'
    },
    description: 'Dairy cattle with high butterfat content',
    icon: '🐄'
  },

  // Goats
  {
    name: 'Boer Goat',
    animalType: 'Goats',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 80, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: 'Fast growth rate'
    },
    description: 'Meat goat breed from South Africa',
    icon: '🐐'
  },
  {
    name: 'Toggenburg',
    animalType: 'Goats',
    purpose: ['Dairy'],
    characteristics: {
      averageWeight: { value: 60, unit: 'kg' },
      maturityAge: '8 months',
      productionRate: '3-5 litres/day'
    },
    description: 'Dairy goat breed',
    icon: '🐐'
  },
  {
    name: 'Mubende Goat',
    animalType: 'Goats',
    purpose: ['Meat', 'Dual Purpose'],
    characteristics: {
      averageWeight: { value: 30, unit: 'kg' },
      maturityAge: '6 months'
    },
    description: 'Indigenous Ugandan goat breed',
    icon: '🐐'
  },

  // Poultry
  {
    name: 'Kuroiler',
    animalType: 'Poultry',
    purpose: ['Meat', 'Layers'],
    characteristics: {
      averageWeight: { value: 3, unit: 'kg' },
      maturityAge: '5 months',
      productionRate: '150-200 eggs/year'
    },
    description: 'Dual-purpose chicken breed',
    icon: '🐔'
  },
  {
    name: 'Layers (ISA Brown)',
    animalType: 'Poultry',
    purpose: ['Layers'],
    characteristics: {
      averageWeight: { value: 2, unit: 'kg' },
      maturityAge: '4.5 months',
      productionRate: '300+ eggs/year'
    },
    description: 'High egg-producing chicken',
    icon: '🐔'
  },
  {
    name: 'Broilers (Cobb 500)',
    animalType: 'Poultry',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 2.5, unit: 'kg' },
      maturityAge: '6 weeks',
      productionRate: 'Fast growth'
    },
    description: 'Meat chicken breed',
    icon: '🐔'
  },
  {
    name: 'Local Chicken',
    animalType: 'Poultry',
    purpose: ['Meat', 'Layers'],
    characteristics: {
      averageWeight: { value: 1.5, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: '60-100 eggs/year'
    },
    description: 'Indigenous village chicken',
    icon: '🐔'
  },

  // Pigs
  {
    name: 'Large White',
    animalType: 'Pigs',
    purpose: ['Meat', 'Breeding'],
    characteristics: {
      averageWeight: { value: 250, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: '10-12 piglets/litter'
    },
    description: 'Popular pig breed for pork production',
    icon: '🐷'
  },
  {
    name: 'Landrace',
    animalType: 'Pigs',
    purpose: ['Meat', 'Breeding'],
    characteristics: {
      averageWeight: { value: 280, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: '11-13 piglets/litter'
    },
    description: 'Long-bodied pig breed',
    icon: '🐷'
  },

  // Fish
  {
    name: 'Tilapia',
    animalType: 'Fish',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 0.5, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: 'Fast growth in ponds'
    },
    description: 'Common fish for aquaculture',
    icon: '🐟'
  },
  {
    name: 'Catfish',
    animalType: 'Fish',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 1, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: 'Hardy and fast-growing'
    },
    description: 'African catfish for fish farming',
    icon: '🐟'
  }
];

// Seed function
export async function seedReferenceData() {
  try {
    console.log('🌱 Starting reference data seeding...');

    // Seed districts
    console.log('📍 Seeding districts...');
    await District.deleteMany({});
    const districts = await District.insertMany(DISTRICTS_DATA);
    console.log(`✅ Seeded ${districts.length} districts`);

    // Seed crop types
    console.log('🌾 Seeding crop types...');
    await CropType.deleteMany({});
    const cropTypes = await CropType.insertMany(CROP_TYPES_DATA);
    console.log(`✅ Seeded ${cropTypes.length} crop types`);

    // Seed livestock breeds
    console.log('🐄 Seeding livestock breeds...');
    await LivestockBreed.deleteMany({});
    const breeds = await LivestockBreed.insertMany(LIVESTOCK_BREEDS_DATA);
    console.log(`✅ Seeded ${breeds.length} livestock breeds`);

    console.log('🎉 Reference data seeding completed successfully!');

    return {
      districts: districts.length,
      cropTypes: cropTypes.length,
      breeds: breeds.length
    };
  } catch (error) {
    console.error('❌ Error seeding reference data:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('../index.js').then(() => {
    seedReferenceData()
      .then(() => {
        console.log('✅ Seeding complete');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
      });
  });
}
