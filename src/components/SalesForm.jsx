import { useState, useEffect } from 'react';

export const SalesForm = () => {
  const [formData, setFormData] = useState({
    saleDate: new Date().toISOString().split('T')[0],
    // Bills
    bill20: 0,
    bill10: 0,
    bill5: 0,
    bill1: 0,
    // Coins
    coin25: 0,
    coin10: 0,
    coin5: 0,
    coin1: 0,
    // Pay Outs
    payOuts: [
      { description: '', amount: 0 },
      { description: '', amount: 0 },
      { description: '', amount: 0 },
    ],
    // ATH
    athAmount: 0,
    athReference: '',
    // Lecture Total
    lectureTotal: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [billsSubtotal, setBillsSubtotal] = useState(0);
  const [coinsSubtotal, setCoinsSubtotal] = useState(0);
  const [payOutSubtotal, setPayOutSubtotal] = useState(0);
  const [athSubtotal, setAthSubtotal] = useState(0);
  const [lectureSubtotal, setLectureSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateSubtotals();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert to number for bills, coins, and amounts
    let numValue = value;
    if (
      name !== 'saleDate' &&
      name !== 'athReference' &&
      !name.startsWith('payOutDesc')
    ) {
      numValue = parseFloat(value) || 0;
    }

    // Handle regular form fields
    if (!name.includes('[')) {
      setFormData({
        ...formData,
        [name]: numValue,
      });
    }
    // Handle pay out fields with array notation: payOutDesc[0], payOutAmount[0], etc.
    else {
      const matches = name.match(/([^[]+)\[(\d+)\]/);
      if (matches && matches.length === 3) {
        const fieldName = matches[1];
        const index = parseInt(matches[2], 10);
        const field = fieldName === 'payOutDesc' ? 'description' : 'amount';

        const updatedPayOuts = [...formData.payOuts];
        updatedPayOuts[index] = {
          ...updatedPayOuts[index],
          [field]: numValue,
        };

        setFormData({
          ...formData,
          payOuts: updatedPayOuts,
        });
      }
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.saleDate) {
      newErrors.saleDate = 'Date is required';
    }

    // Check if at least one bill, coin, or ATH is entered
    const hasValue =
      formData.bill20 > 0 ||
      formData.bill10 > 0 ||
      formData.bill5 > 0 ||
      formData.bill1 > 0 ||
      formData.coin25 > 0 ||
      formData.coin10 > 0 ||
      formData.coin5 > 0 ||
      formData.coin1 > 0 ||
      formData.athAmount > 0;

    if (!hasValue) {
      newErrors.general =
        'At least one bill, coin, or ATH amount must be entered';
    }

    // Validate pay out fields
    formData.payOuts.forEach((payOut, index) => {
      if (payOut.amount > 0 && !payOut.description.trim()) {
        newErrors[`payOutDesc[${index}]`] =
          'Description is required when amount is entered';
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log('Form submitted:', {
      ...formData,
      billsSubtotal,
      coinsSubtotal,
      payOutSubtotal,
      athSubtotal,
      lectureSubtotal,
      total,
    });

    setIsSubmitted(true);
  };

  const calculateSubtotals = () => {
    // Calculate bills subtotal
    const billsTotal =
      formData.bill20 * 20 +
      formData.bill10 * 10 +
      formData.bill5 * 5 +
      formData.bill1 * 1;

    // Calculate coins subtotal
    const coinsTotal =
      formData.coin25 * 0.25 +
      formData.coin10 * 0.1 +
      formData.coin5 * 0.05 +
      formData.coin1 * 0.01;

    // Calculate pay out subtotal
    const payOutTotal = formData.payOuts.reduce(
      (sum, payOut) => sum + (payOut.amount || 0),
      0
    );

    // ATH amount
    const athTotal = formData.athAmount || 0;

    // Lecture total (for display only, not included in grand total)
    const lectureTotal = formData.lectureTotal || 0;

    // Round to 2 decimal places to avoid floating point issues
    const roundedBillsTotal = Math.round(billsTotal * 100) / 100;
    const roundedCoinsTotal = Math.round(coinsTotal * 100) / 100;
    const roundedPayOutTotal = Math.round(payOutTotal * 100) / 100;
    const roundedAthTotal = Math.round(athTotal * 100) / 100;
    const roundedLectureTotal = Math.round(lectureTotal * 100) / 100;

    // Calculate grand total (income - payout) - not including lecture total
    const grandTotal =
      roundedBillsTotal +
      roundedCoinsTotal +
      roundedAthTotal -
      roundedPayOutTotal;
    const roundedGrandTotal = Math.round(grandTotal * 100) / 100;

    setBillsSubtotal(roundedBillsTotal);
    setCoinsSubtotal(roundedCoinsTotal);
    setPayOutSubtotal(roundedPayOutTotal);
    setAthSubtotal(roundedAthTotal);
    setLectureSubtotal(roundedLectureTotal);
    setTotal(roundedGrandTotal);

    return {
      billsSubtotal: roundedBillsTotal,
      coinsSubtotal: roundedCoinsTotal,
      payOutSubtotal: roundedPayOutTotal,
      athSubtotal: roundedAthTotal,
      lectureSubtotal: roundedLectureTotal,
      total: roundedGrandTotal,
    };
  };

  if (isSubmitted) {
    return (
      <div className='max-w-md mx-auto p-6 bg-green-50 rounded-lg shadow-md'>
        <div className='text-center mb-6'>
          <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-green-700'>
            Transaction Completed!
          </h2>
          <p className='text-green-600 mt-2'>
            Your cash transaction has been successfully recorded.
          </p>
        </div>

        <div className='bg-white p-4 rounded-md shadow-sm'>
          <div className='mb-4'>
            <p className='text-gray-500 text-sm'>Date</p>
            <p className='font-medium'>{formData.saleDate}</p>
          </div>

          <div className='space-y-4'>
            <div>
              <h3 className='font-medium text-gray-700 mb-2'>Bills</h3>
              <div className='space-y-1'>
                {formData.bill20 > 0 && (
                  <p className='text-sm'>
                    $20 × {formData.bill20} = $
                    {(formData.bill20 * 20).toFixed(2)}
                  </p>
                )}
                {formData.bill10 > 0 && (
                  <p className='text-sm'>
                    $10 × {formData.bill10} = $
                    {(formData.bill10 * 10).toFixed(2)}
                  </p>
                )}
                {formData.bill5 > 0 && (
                  <p className='text-sm'>
                    $5 × {formData.bill5} = ${(formData.bill5 * 5).toFixed(2)}
                  </p>
                )}
                {formData.bill1 > 0 && (
                  <p className='text-sm'>
                    $1 × {formData.bill1} = ${(formData.bill1 * 1).toFixed(2)}
                  </p>
                )}
                {formData.bill20 === 0 &&
                  formData.bill10 === 0 &&
                  formData.bill5 === 0 &&
                  formData.bill1 === 0 && (
                    <p className='text-sm text-gray-400'>No bills</p>
                  )}
              </div>
              <p className='text-sm font-medium text-gray-700 mt-2'>
                Subtotal: ${billsSubtotal.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className='font-medium text-gray-700 mb-2'>Coins</h3>
              <div className='space-y-1'>
                {formData.coin25 > 0 && (
                  <p className='text-sm'>
                    25¢ × {formData.coin25} = $
                    {(formData.coin25 * 0.25).toFixed(2)}
                  </p>
                )}
                {formData.coin10 > 0 && (
                  <p className='text-sm'>
                    10¢ × {formData.coin10} = $
                    {(formData.coin10 * 0.1).toFixed(2)}
                  </p>
                )}
                {formData.coin5 > 0 && (
                  <p className='text-sm'>
                    5¢ × {formData.coin5} = $
                    {(formData.coin5 * 0.05).toFixed(2)}
                  </p>
                )}
                {formData.coin1 > 0 && (
                  <p className='text-sm'>
                    1¢ × {formData.coin1} = $
                    {(formData.coin1 * 0.01).toFixed(2)}
                  </p>
                )}
                {formData.coin25 === 0 &&
                  formData.coin10 === 0 &&
                  formData.coin5 === 0 &&
                  formData.coin1 === 0 && (
                    <p className='text-sm text-gray-400'>No coins</p>
                  )}
              </div>
              <p className='text-sm font-medium text-gray-700 mt-2'>
                Subtotal: ${coinsSubtotal.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className='font-medium text-gray-700 mb-2'>Pay Outs</h3>
              {formData.payOuts.some((p) => p.amount > 0) ? (
                <div className='space-y-1'>
                  {formData.payOuts.map(
                    (payOut, index) =>
                      payOut.amount > 0 && (
                        <p key={index} className='text-sm'>
                          {payOut.description}: -${payOut.amount.toFixed(2)}
                        </p>
                      )
                  )}
                </div>
              ) : (
                <p className='text-sm text-gray-400'>No pay outs</p>
              )}
              <p className='text-sm font-medium text-gray-700 mt-2'>
                Subtotal: -${payOutSubtotal.toFixed(2)}
              </p>
            </div>

            {/* ATH Payment */}
            {formData.athAmount > 0 && (
              <div>
                <h3 className='font-medium text-gray-700 mb-2'>ATH Payment</h3>
                <p className='text-sm'>
                  Amount: ${formData.athAmount.toFixed(2)}
                </p>
                {formData.athReference && (
                  <p className='text-sm'>Reference: {formData.athReference}</p>
                )}
                <p className='text-sm font-medium text-gray-700 mt-2'>
                  Subtotal: ${athSubtotal.toFixed(2)}
                </p>
              </div>
            )}

            {/* Lecture Total */}
            {formData.lectureTotal > 0 && (
              <div>
                <h3 className='font-medium text-gray-700 mb-2'>
                  Lecture Total
                </h3>
                <p className='text-sm'>
                  Amount: ${formData.lectureTotal.toFixed(2)}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  (For information only, not included in Net Total)
                </p>
              </div>
            )}
          </div>

          <div className='pt-4 mt-4 border-t border-gray-200'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-medium text-gray-700'>
                Net Total:
              </span>
              <span className='text-xl font-bold text-green-600'>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({
              saleDate: new Date().toISOString().split('T')[0],
              bill20: 0,
              bill10: 0,
              bill5: 0,
              bill1: 0,
              coin25: 0,
              coin10: 0,
              coin5: 0,
              coin1: 0,
              payOuts: [
                { description: '', amount: 0 },
                { description: '', amount: 0 },
                { description: '', amount: 0 },
              ],
              athAmount: 0,
              athReference: '',
              lectureTotal: 0,
            });
            setBillsSubtotal(0);
            setCoinsSubtotal(0);
            setPayOutSubtotal(0);
            setAthSubtotal(0);
            setLectureSubtotal(0);
            setTotal(0);
            setIsSubmitted(false);
          }}
          className='mt-6 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors'
        >
          New Transaction
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Cash Transaction
      </h2>

      <div className='space-y-4'>
        {/* Date */}
        <div>
          <label
            htmlFor='saleDate'
            className='block text-sm font-medium text-gray-700'
          >
            Date <span className='text-red-500'>*</span>
          </label>
          <input
            type='date'
            id='saleDate'
            name='saleDate'
            value={formData.saleDate}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              errors.saleDate ? 'border-red-300' : ''
            }`}
          />
          {errors.saleDate && (
            <p className='mt-1 text-sm text-red-600'>{errors.saleDate}</p>
          )}
        </div>

        {errors.general && (
          <p className='text-sm text-red-600 font-medium'>{errors.general}</p>
        )}

        {/* Bills */}
        <div className='pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>Bills</h3>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='bill20'
                className='block text-sm font-medium text-gray-700'
              >
                $20 Bills
              </label>
              <input
                type='number'
                id='bill20'
                name='bill20'
                min='0'
                value={formData.bill20}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='bill10'
                className='block text-sm font-medium text-gray-700'
              >
                $10 Bills
              </label>
              <input
                type='number'
                id='bill10'
                name='bill10'
                min='0'
                value={formData.bill10}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='bill5'
                className='block text-sm font-medium text-gray-700'
              >
                $5 Bills
              </label>
              <input
                type='number'
                id='bill5'
                name='bill5'
                min='0'
                value={formData.bill5}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='bill1'
                className='block text-sm font-medium text-gray-700'
              >
                $1 Bills
              </label>
              <input
                type='number'
                id='bill1'
                name='bill1'
                min='0'
                value={formData.bill1}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
          </div>

          <div className='mt-3 flex justify-end'>
            <div className='flex items-center'>
              <span className='text-sm font-medium text-gray-700 mr-2'>
                Subtotal:
              </span>
              <span className='font-medium text-gray-900'>
                ${billsSubtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Coins */}
        <div className='pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>Coins</h3>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='coin25'
                className='block text-sm font-medium text-gray-700'
              >
                Quarters (25¢)
              </label>
              <input
                type='number'
                id='coin25'
                name='coin25'
                min='0'
                value={formData.coin25}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='coin10'
                className='block text-sm font-medium text-gray-700'
              >
                Dimes (10¢)
              </label>
              <input
                type='number'
                id='coin10'
                name='coin10'
                min='0'
                value={formData.coin10}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='coin5'
                className='block text-sm font-medium text-gray-700'
              >
                Nickels (5¢)
              </label>
              <input
                type='number'
                id='coin5'
                name='coin5'
                min='0'
                value={formData.coin5}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='coin1'
                className='block text-sm font-medium text-gray-700'
              >
                Pennies (1¢)
              </label>
              <input
                type='number'
                id='coin1'
                name='coin1'
                min='0'
                value={formData.coin1}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
          </div>

          <div className='mt-3 flex justify-end'>
            <div className='flex items-center'>
              <span className='text-sm font-medium text-gray-700 mr-2'>
                Subtotal:
              </span>
              <span className='font-medium text-gray-900'>
                ${coinsSubtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Pay Outs */}
        <div className='pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>Pay Outs</h3>

          {formData.payOuts.map((payOut, index) => (
            <div key={index} className='mb-4 pb-3 border-b border-gray-100'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Pay Out #{index + 1}
              </h4>
              <div className='space-y-3'>
                <div>
                  <label
                    htmlFor={`payOutDesc[${index}]`}
                    className='block text-sm font-medium text-gray-700'
                  >
                    Description
                  </label>
                  <input
                    type='text'
                    id={`payOutDesc[${index}]`}
                    name={`payOutDesc[${index}]`}
                    placeholder='e.g., Vendor payment, Refund, etc.'
                    value={payOut.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors[`payOutDesc[${index}]`] ? 'border-red-300' : ''
                    }`}
                  />
                  {errors[`payOutDesc[${index}]`] && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors[`payOutDesc[${index}]`]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`payOutAmount[${index}]`}
                    className='block text-sm font-medium text-gray-700'
                  >
                    Amount ($)
                  </label>
                  <input
                    type='number'
                    id={`payOutAmount[${index}]`}
                    name={`payOutAmount[${index}]`}
                    min='0'
                    step='0.01'
                    value={payOut.amount}
                    onChange={handleChange}
                    className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  />
                </div>
              </div>
            </div>
          ))}

          <div className='mt-3 flex justify-end'>
            <div className='flex items-center'>
              <span className='text-sm font-medium text-gray-700 mr-2'>
                Subtotal:
              </span>
              <span className='font-medium text-red-600'>
                -${payOutSubtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ATH Payment */}
        <div className='pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            ATH Payment
          </h3>

          <div className='space-y-3'>
            <div>
              <label
                htmlFor='athAmount'
                className='block text-sm font-medium text-gray-700'
              >
                Amount ($)
              </label>
              <input
                type='number'
                id='athAmount'
                name='athAmount'
                min='0'
                step='0.01'
                value={formData.athAmount}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label
                htmlFor='athReference'
                className='block text-sm font-medium text-gray-700'
              >
                Reference Number
              </label>
              <input
                type='text'
                id='athReference'
                name='athReference'
                placeholder='e.g., Transaction ID, Receipt Number, etc.'
                value={formData.athReference}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
          </div>

          <div className='mt-3 flex justify-end'>
            <div className='flex items-center'>
              <span className='text-sm font-medium text-gray-700 mr-2'>
                Subtotal:
              </span>
              <span className='font-medium text-green-600'>
                ${athSubtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Lecture Total */}
        <div className='pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            Lecture Total
          </h3>

          <div className='space-y-3'>
            <div>
              <label
                htmlFor='lectureTotal'
                className='block text-sm font-medium text-gray-700'
              >
                Amount ($)
              </label>
              <input
                type='number'
                id='lectureTotal'
                name='lectureTotal'
                min='0'
                step='0.01'
                value={formData.lectureTotal}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
          </div>

          <div className='mt-3 flex justify-between'>
            <div className='flex items-center'>
              <span className='text-xs text-gray-500'>
                (For information only, not included in Net Total)
              </span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-medium text-gray-700 mr-2'>
                Amount:
              </span>
              <span className='font-medium text-gray-600'>
                ${lectureSubtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className='pt-4 border-t border-gray-200'>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-medium text-gray-700'>
              Net Total:
            </span>
            <span className='text-xl font-bold text-green-600'>
              ${total.toFixed(2)}
            </span>
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            (Income from bills, coins, and ATH minus pay outs)
          </p>
        </div>

        {/* Submit Button */}
        <div className='pt-6'>
          <button
            onClick={handleSubmit}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Complete Transaction
          </button>
        </div>
      </div>
    </div>
  );
};
