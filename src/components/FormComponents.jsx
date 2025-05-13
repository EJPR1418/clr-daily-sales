// src/components/FormInput.jsx
import { useState } from 'react';

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
  const [focused, setFocused] = useState(false);

  // Determine if we should show an icon based on the input type
  const showIcon = type === 'date';

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div className={`relative rounded-md shadow-sm mt-1`}>
        <input
          type={type}
          id={id}
          name={name}
          min={min}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`block w-full rounded-md border border-gray-300
                    focus:border-indigo-500 focus:ring-indigo-500 
                    text-gray-900 bg-white py-2 px-3 ${
                      error ? 'border-red-300' : ''
                    }${showIcon ? ' pr-10' : ''}`}
        />

        {showIcon && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <svg
              className={`h-5 w-5 ${
                focused ? 'text-indigo-500' : 'text-gray-400'
              }`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
      </div>
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
