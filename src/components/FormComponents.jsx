// src/components/FormInput.jsx
export const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  min,
  step,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        min={min}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500 
                    text-gray-900 bg-white py-2 px-3 ${
                      error ? 'border-red-300' : ''
                    }`}
      />
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

// src/components/SectionHeading.jsx
export const SectionHeading = ({ title }) => (
  <h3 className='text-lg font-medium text-gray-700 mb-3'>{title}</h3>
);

// src/components/Subtotal.jsx
export const Subtotal = ({ label, amount, isNegative = false }) => (
  <div className='mt-3 flex justify-end'>
    <div className='flex items-center'>
      <span className='text-sm font-medium text-gray-700 mr-2'>{label}:</span>
      <span
        className={`font-medium ${
          isNegative ? 'text-red-600' : 'text-gray-900'
        }`}
      >
        {isNegative ? '-' : ''}${Math.abs(amount).toFixed(2)}
      </span>
    </div>
  </div>
);
