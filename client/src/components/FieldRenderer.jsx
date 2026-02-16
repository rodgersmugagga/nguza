import { FIELD_METADATA, isFieldRequired } from '../utils/subcategoryFields';

/**
 * Responsive, accessible form field renderer
 * Auto-adjusts styles for mobile and desktop
 *
 * Maps generic field keys (for example, 'brand' or 'condition') to
 * category-specific metadata keys. This component is focused on
 * agricultural categories (Crops, Livestock, Agricultural Inputs,
 * Equipment & Tools, Agricultural Services).
 */
export default function FieldRenderer({
  fieldName,
  value,
  onChange,
  category,
  subCategory,
  error,
}) {
  // Resolve metadata: allow generic field names (e.g., 'brand') to map to
  // category-specific metadata like 'brand_vehicle' or 'brand_electronic'.
  let meta = FIELD_METADATA[fieldName];
  if (!meta) {
    // Map agriculture categories to specific suffixes used in FIELD_METADATA keys
    const suffixMap = {
      'Equipment & Tools': 'equipment',
      'Agricultural Inputs': 'input',
      'Crops': 'crop',
      'Livestock': 'livestock',
      'Agricultural Services': 'service'
    };
    const suffix = suffixMap[category] || '';
    if (suffix) {
      meta = FIELD_METADATA[`${fieldName}_${suffix}`];
    }
  }
  const isRequired = isFieldRequired(category, subCategory, fieldName);

  if (!meta) return null;

  const labelClasses = 'block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-ui-muted';
  const inputBase = 'rounded-lg w-full p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none transition appearance-auto z-50';
  const errorClass = error ? 'border-red-500 ring-red-300' : 'border-ui';

  const commonProps = {
    id: fieldName,
    onChange,
    value: value || '',
    required: isRequired,
    title: `${meta.label}${isRequired ? ' (required)' : ''}`,
    className: `${inputBase} ${errorClass}`,
  };

  switch (meta.type) {
    case 'number':
      return (
        <div className="flex flex-col w-full">
          <label htmlFor={fieldName} className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...commonProps}
            type="number"
            min={meta.min}
            max={meta.max}
            step={meta.step || 1}
            placeholder={meta.placeholder || ''}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    case 'text':
      return (
        <div className="flex flex-col w-full">
          <label htmlFor={fieldName} className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...commonProps}
            type="text"
            placeholder={meta.placeholder || ''}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="flex flex-col w-full">
          <label htmlFor={fieldName} className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <select {...commonProps}>
            <option value="">Select {meta.label.toLowerCase()}</option>
            {meta.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    case 'radio':
      return (
        <div className="flex flex-col w-full">
          <label className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {meta.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-ui-muted"
              >
                <input
                  type="radio"
                  name={fieldName}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={onChange}
                  required={isRequired}
                    className="w-4 h-4 accent-ui-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
