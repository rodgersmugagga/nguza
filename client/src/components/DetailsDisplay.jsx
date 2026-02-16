import { FIELD_METADATA, getFieldsForSubcategory } from '../utils/subcategoryFields';
import {
  FaSeedling, FaTag, FaBalanceScale, FaCalendarAlt, FaShieldAlt,
  FaStar, FaBox, FaMoneyBillWave, FaClock, FaClipboardCheck, FaTools
} from 'react-icons/fa';

const getFieldIcon = (field) => {
  const f = field.toLowerCase();
  if (f.includes('type')) return <FaSeedling className="text-green-500" />;
  if (f.includes('variety') || f.includes('breed') || f.includes('model')) return <FaTag className="text-blue-500" />;
  if (f.includes('quantity') || f.includes('weight') || f.includes('coverage')) return <FaBalanceScale className="text-amber-500" />;
  if (f.includes('date') || f.includes('season') || f.includes('availability')) return <FaCalendarAlt className="text-indigo-500" />;
  if (f.includes('organic') || f.includes('certification') || f.includes('warranty') || f.includes('health')) return <FaShieldAlt className="text-emerald-500" />;
  if (f.includes('grade') || f.includes('condition') || f.includes('experience')) return <FaStar className="text-yellow-500" />;
  if (f.includes('brand')) return <FaBox className="text-orange-500" />;
  if (f.includes('price')) return <FaMoneyBillWave className="text-green-600" />;
  if (f.includes('harvest') || f.includes('expiry')) return <FaClock className="text-red-400" />;
  return <FaClipboardCheck className="text-gray-400" />;
};

export default function DetailsDisplay({ category, subCategory, details = {} }) {
  if (!category || !subCategory) return null;

  const fields = getFieldsForSubcategory(category, subCategory);

  if (!fields || fields.length === 0) return null;

  const displayItems = fields
    .filter((field) => details?.[field] !== undefined && details?.[field] !== null && details?.[field] !== '')
    .map((field) => ({
      key: field,
      label: FIELD_METADATA[field]?.label || capitalize(field),
      value: formatValue(details[field]),
    }));

  if (displayItems.length === 0) return null;

  return (
    <section className="space-y-6">
      <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
        <div className="w-1 h-6 bg-color-primary rounded-full shadow-lg" />
        Technical Specifications
      </h4>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {displayItems.map(({ key, label, value }) => (
          <div key={key} className="flex flex-col items-center justify-center text-center p-2 sm:p-4 rounded-2xl sm:rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:border-color-primary transition-all group overflow-hidden relative min-h-[90px] sm:min-h-[120px]">
            {/* Soft decorative background element */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/40 rotate-12 -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-xs sm:text-xl flex-shrink-0 z-10 transition-transform group-hover:scale-110 group-hover:rotate-3">
              {getFieldIcon(key)}
            </div>

            <div className="flex flex-col mt-1.5 sm:mt-3 z-10 w-full overflow-hidden">
              <span className="text-[7px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest truncate leading-tight mb-0.5 sm:mb-1">
                {label}
              </span>
              <span className="text-gray-900 font-black text-[9px] sm:text-sm truncate leading-tight px-0.5">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatValue(v) {
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') return v.toLocaleString();
  return String(v);
}

