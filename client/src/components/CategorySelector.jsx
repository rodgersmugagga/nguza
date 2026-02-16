import { useState } from 'react';
import PropTypes from 'prop-types';

const AGRICULTURE_CATEGORIES = [
  {
    key: 'Crops',
    label: 'Crops & Produce',
    icon: '🌾',
    description: 'Grains, vegetables, fruits, and more',
    subcategories: [
      { key: 'Grains & Cereals', label: 'Grains & Cereals', icon: '🌽' },
      { key: 'Legumes & Pulses', label: 'Legumes & Pulses', icon: '🫘' },
      { key: 'Vegetables', label: 'Vegetables', icon: '🥬' },
      { key: 'Fruits', label: 'Fruits', icon: '🍌' },
      { key: 'Root Crops', label: 'Root Crops', icon: '🥔' },
      { key: 'Cash Crops', label: 'Cash Crops', icon: '☕' }
    ]
  },
  {
    key: 'Livestock',
    label: 'Livestock & Animals',
    icon: '🐄',
    description: 'Cattle, goats, poultry, fish, and more',
    subcategories: [
      { key: 'Cattle', label: 'Cattle', icon: '🐄' },
      { key: 'Goats & Sheep', label: 'Goats & Sheep', icon: '🐐' },
      { key: 'Poultry', label: 'Poultry', icon: '🐔' },
      { key: 'Pigs', label: 'Pigs', icon: '🐷' },
      { key: 'Fish & Aquaculture', label: 'Fish & Aquaculture', icon: '🐟' },
      { key: 'Other Livestock', label: 'Other Livestock', icon: '🦆' }
    ]
  },
  {
    key: 'Agricultural Inputs',
    label: 'Agricultural Inputs',
    icon: '🌱',
    description: 'Seeds, fertilizers, pesticides, feed',
    subcategories: [
      { key: 'Seeds & Seedlings', label: 'Seeds & Seedlings', icon: '🌱' },
      { key: 'Fertilizers', label: 'Fertilizers', icon: '💊' },
      { key: 'Pesticides & Chemicals', label: 'Pesticides & Chemicals', icon: '🧪' },
      { key: 'Animal Feed', label: 'Animal Feed', icon: '🌾' },
      { key: 'Veterinary Products', label: 'Veterinary Products', icon: '💉' }
    ]
  },
  {
    key: 'Equipment & Tools',
    label: 'Equipment & Tools',
    icon: '🚜',
    description: 'Tractors, tools, irrigation, processing',
    subcategories: [
      { key: 'Tractors & Machinery', label: 'Tractors & Machinery', icon: '🚜' },
      { key: 'Hand Tools', label: 'Hand Tools', icon: '🔨' },
      { key: 'Irrigation Equipment', label: 'Irrigation Equipment', icon: '💧' },
      { key: 'Processing Equipment', label: 'Processing Equipment', icon: '⚙️' },
      { key: 'Transport Equipment', label: 'Transport Equipment', icon: '🚛' }
    ]
  },
  {
    key: 'Agricultural Services',
    label: 'Agricultural Services',
    icon: '🤝',
    description: 'Land prep, planting, harvesting, transport',
    subcategories: [
      { key: 'Land Preparation', label: 'Land Preparation', icon: '🚜' },
      { key: 'Planting Services', label: 'Planting Services', icon: '🌱' },
      { key: 'Harvesting Services', label: 'Harvesting Services', icon: '🌾' },
      { key: 'Transport & Logistics', label: 'Transport & Logistics', icon: '🚛' },
      { key: 'Veterinary Services', label: 'Veterinary Services', icon: '🏥' },
      { key: 'Agronomy Services', label: 'Agronomy Services', icon: '👨‍🌾' }
    ]
  }
];

export default function CategorySelector({ selectedCategory, selectedSubCategory, onChange }) {
  const [step, setStep] = useState(selectedCategory ? 2 : 1);

  const handleCategorySelect = (category) => {
    onChange({ category: category.key, subCategory: '' });
    setStep(2);
  };

  const handleSubCategorySelect = (subCategory) => {
    onChange({ category: selectedCategory, subCategory: subCategory.key });
  };

  const handleBack = () => {
    setStep(1);
    onChange({ category: '', subCategory: '' });
  };

  const currentCategory = AGRICULTURE_CATEGORIES.find(c => c.key === selectedCategory);

  return (
    <div className="w-full">
      {/* Step 1: Select Main Category */}
      {step === 1 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-ui-primary mb-4">
            Select Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGRICULTURE_CATEGORIES.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className="flex items-start gap-3 p-4 border-2 border-ui rounded-lg hover:border-ui hover:bg-secondary transition-all text-left min-h-[80px] active:scale-95"
              >
                <span className="text-3xl flex-shrink-0">{category.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ui-primary text-base">
                    {category.label}
                  </div>
                  <div className="text-sm text-ui-muted mt-1">
                    {category.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Subcategory */}
      {step === 2 && currentCategory && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <button type="button" onClick={handleBack} className="text-ui-primary hover:opacity-90 font-medium">← Back</button>
            <h3 className="text-lg font-semibold text-ui-primary">Select {currentCategory.label} Type</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub.key}
                type="button"
                onClick={() => handleSubCategorySelect(sub)}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all min-h-[100px] active:scale-95 ${selectedSubCategory === sub.key
                      ? 'border-ui bg-secondary'
                      : 'border-ui hover:border-ui hover:bg-secondary'
                    }`}
              >
                <span className="text-3xl">{sub.icon}</span>
                  <span className="text-sm font-medium text-ui-primary text-center">
                  {sub.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Summary (Mobile-friendly) */}
      {selectedCategory && selectedSubCategory && (
        <div className="mt-4 p-3 bg-secondary border border-ui rounded-lg">
          <div className="text-sm text-ui-muted">
            <span className="font-medium">Selected:</span> {selectedCategory} → {selectedSubCategory}
          </div>
        </div>
      )}
    </div>
  );
}

CategorySelector.propTypes = {
  selectedCategory: PropTypes.string,
  selectedSubCategory: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

// AGRICULTURE_CATEGORIES is intentionally local to this file to avoid fast-refresh warnings.
