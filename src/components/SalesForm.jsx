// src/components/SalesForm.jsx
import { useState, useEffect } from 'react';
import { FormInput, SectionHeading, Subtotal } from './FormComponents';

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
    // Handle pay out fields with array notation
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

    // Round to 2 decimal places
    const roundedBillsTotal = Math.round(billsTotal * 100) / 100;
    const roundedCoinsTotal = Math.round(coinsTotal * 100) / 100;
    const roundedPayOutTotal = Math.round(payOutTotal * 100) / 100;
    const roundedAthTotal = Math.round(athTotal * 100) / 100;
    const roundedLectureTotal = Math.round(lectureTotal * 100) / 100;

    // Calculate grand total (not including lecture)
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
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

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

  const resetForm = () => {
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
  };

  // Render the success screen
  if (isSubmitted) {
    return (
      <SuccessScreen
        formData={formData}
        billsSubtotal={billsSubtotal}
        coinsSubtotal={coinsSubtotal}
        payOutSubtotal={payOutSubtotal}
        athSubtotal={athSubtotal}
        lectureSubtotal={lectureSubtotal}
        total={total}
        onNewTransaction={resetForm}
      />
    );
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Cash Transaction
      </h2>

      <div className='space-y-4'>
        {/* Date */}
        <FormInput
          id='saleDate'
          name='saleDate'
          label='Date'
          type='date'
          value={formData.saleDate}
          onChange={handleChange}
          error={errors.saleDate}
          required
        />

        {errors.general && (
          <p className='text-sm text-red-600 font-medium'>{errors.general}</p>
        )}

        {/* Bills Section */}
        <BillsSection
          formData={formData}
          handleChange={handleChange}
          billsSubtotal={billsSubtotal}
        />

        {/* Coins Section */}
        <CoinsSection
          formData={formData}
          handleChange={handleChange}
          coinsSubtotal={coinsSubtotal}
        />

        {/* Pay Outs Section */}
        <PayOutsSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          payOutSubtotal={payOutSubtotal}
        />

        {/* ATH Payment Section */}
        <AthSection
          formData={formData}
          handleChange={handleChange}
          athSubtotal={athSubtotal}
        />

        {/* Lecture Total Section */}
        <LectureSection
          formData={formData}
          handleChange={handleChange}
          lectureSubtotal={lectureSubtotal}
        />

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

// Helper section components
const BillsSection = ({ formData, handleChange, billsSubtotal }) => (
  <div className='pt-4 border-t border-gray-200'>
    <SectionHeading title='Bills' />

    <div className='grid grid-cols-2 gap-4'>
      <FormInput
        id='bill20'
        name='bill20'
        label='$20 Bills'
        type='number'
        min='0'
        value={formData.bill20}
        onChange={handleChange}
      />

      <FormInput
        id='bill10'
        name='bill10'
        label='$10 Bills'
        type='number'
        min='0'
        value={formData.bill10}
        onChange={handleChange}
      />

      <FormInput
        id='bill5'
        name='bill5'
        label='$5 Bills'
        type='number'
        min='0'
        value={formData.bill5}
        onChange={handleChange}
      />

      <FormInput
        id='bill1'
        name='bill1'
        label='$1 Bills'
        type='number'
        min='0'
        value={formData.bill1}
        onChange={handleChange}
      />
    </div>

    <Subtotal label='Subtotal' amount={billsSubtotal} />
  </div>
);

const CoinsSection = ({ formData, handleChange, coinsSubtotal }) => (
  <div className='pt-4 border-t border-gray-200'>
    <SectionHeading title='Coins' />

    <div className='grid grid-cols-2 gap-4'>
      <FormInput
        id='coin25'
        name='coin25'
        label='Quarters (25¢)'
        type='number'
        min='0'
        value={formData.coin25}
        onChange={handleChange}
      />

      <FormInput
        id='coin10'
        name='coin10'
        label='Dimes (10¢)'
        type='number'
        min='0'
        value={formData.coin10}
        onChange={handleChange}
      />

      <FormInput
        id='coin5'
        name='coin5'
        label='Nickels (5¢)'
        type='number'
        min='0'
        value={formData.coin5}
        onChange={handleChange}
      />

      <FormInput
        id='coin1'
        name='coin1'
        label='Pennies (1¢)'
        type='number'
        min='0'
        value={formData.coin1}
        onChange={handleChange}
      />
    </div>

    <Subtotal label='Subtotal' amount={coinsSubtotal} />
  </div>
);

const PayOutsSection = ({ formData, handleChange, errors, payOutSubtotal }) => (
  <div className='pt-4 border-t border-gray-200'>
    <SectionHeading title='Pay Outs' />

    {formData.payOuts.map((payOut, index) => (
      <div key={index} className='mb-4 pb-3 border-b border-gray-100'>
        <h4 className='text-sm font-medium text-gray-700 mb-2'>
          Pay Out #{index + 1}
        </h4>
        <div className='space-y-3'>
          <FormInput
            id={`payOutDesc[${index}]`}
            name={`payOutDesc[${index}]`}
            label='Description'
            placeholder='e.g., Vendor payment, Refund, etc.'
            value={payOut.description}
            onChange={handleChange}
            error={errors[`payOutDesc[${index}]`]}
          />

          <FormInput
            id={`payOutAmount[${index}]`}
            name={`payOutAmount[${index}]`}
            label='Amount ($)'
            type='number'
            min='0'
            step='0.01'
            value={payOut.amount}
            onChange={handleChange}
          />
        </div>
      </div>
    ))}

    <Subtotal label='Subtotal' amount={payOutSubtotal} isNegative={true} />
  </div>
);

const AthSection = ({ formData, handleChange, athSubtotal }) => (
  <div className='pt-4 border-t border-gray-200'>
    <SectionHeading title='ATH Payment' />

    <div className='space-y-3'>
      <FormInput
        id='athAmount'
        name='athAmount'
        label='Amount ($)'
        type='number'
        min='0'
        step='0.01'
        value={formData.athAmount}
        onChange={handleChange}
      />

      <FormInput
        id='athReference'
        name='athReference'
        label='Reference Number'
        placeholder='e.g., Transaction ID, Receipt Number, etc.'
        value={formData.athReference}
        onChange={handleChange}
      />
    </div>

    <Subtotal label='Subtotal' amount={athSubtotal} />
  </div>
);

const LectureSection = ({ formData, handleChange, lectureSubtotal }) => (
  <div className='pt-4 border-t border-gray-200'>
    <SectionHeading title='Lecture Total' />

    <div className='space-y-3'>
      <FormInput
        id='lectureTotal'
        name='lectureTotal'
        label='Amount ($)'
        type='number'
        min='0'
        step='0.01'
        value={formData.lectureTotal}
        onChange={handleChange}
      />
    </div>

    <div className='mt-3 flex justify-between'>
      <div className='flex items-center'>
        <span className='text-xs text-gray-500'>
          (For information only, not included in Net Total)
        </span>
      </div>
      <div className='flex items-center'>
        <span className='text-sm font-medium text-gray-700 mr-2'>Amount:</span>
        <span className='font-medium text-gray-600'>
          ${lectureSubtotal.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const SuccessScreen = ({
  formData,
  billsSubtotal,
  coinsSubtotal,
  payOutSubtotal,
  athSubtotal,
  lectureSubtotal,
  total,
  onNewTransaction,
}) => (
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
        <p className='font-medium text-gray-700 mb-2'>Date</p>
        <p className='font-medium text-gray-900'>{formData.saleDate}</p>
      </div>

      <div className='space-y-4'>
        <TransactionSummarySection
          title='Bills'
          items={[
            {
              label: '$20 × ',
              value: formData.bill20,
              amount: formData.bill20 * 20,
            },
            {
              label: '$10 × ',
              value: formData.bill10,
              amount: formData.bill10 * 10,
            },
            {
              label: '$5 × ',
              value: formData.bill5,
              amount: formData.bill5 * 5,
            },
            {
              label: '$1 × ',
              value: formData.bill1,
              amount: formData.bill1 * 1,
            },
          ]}
          subtotal={billsSubtotal}
          emptyMessage='No bills'
        />

        <TransactionSummarySection
          title='Coins'
          items={[
            {
              label: '25¢ × ',
              value: formData.coin25,
              amount: formData.coin25 * 0.25,
            },
            {
              label: '10¢ × ',
              value: formData.coin10,
              amount: formData.coin10 * 0.1,
            },
            {
              label: '5¢ × ',
              value: formData.coin5,
              amount: formData.coin5 * 0.05,
            },
            {
              label: '1¢ × ',
              value: formData.coin1,
              amount: formData.coin1 * 0.01,
            },
          ]}
          subtotal={coinsSubtotal}
          emptyMessage='No coins'
        />

        <div>
          <h3 className='font-medium text-gray-700 mb-2'>Pay Outs</h3>
          {formData.payOuts.some((p) => p.amount > 0) ? (
            <div className='space-y-1'>
              {formData.payOuts.map(
                (payOut, index) =>
                  payOut.amount > 0 && (
                    <p key={index} className='text-sm text-gray-900'>
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
            <p className='text-sm text-gray-900'>
              Amount: ${formData.athAmount.toFixed(2)}
            </p>
            {formData.athReference && (
              <p className='text-sm text-gray-900'>
                Reference: {formData.athReference}
              </p>
            )}
            <p className='text-sm font-medium text-gray-700 mt-2'>
              Subtotal: ${athSubtotal.toFixed(2)}
            </p>
          </div>
        )}

        {/* Lecture Total */}
        {formData.lectureTotal > 0 && (
          <div>
            <h3 className='font-medium text-gray-700 mb-2'>Lecture Total</h3>
            <p className='text-sm text-gray-900'>
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
          <span className='text-lg font-medium text-gray-700'>Net Total:</span>
          <span className='text-xl font-bold text-green-600'>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>

    <button
      onClick={onNewTransaction}
      className='mt-6 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors'
    >
      New Transaction
    </button>
  </div>
);

const TransactionSummarySection = ({
  title,
  items,
  subtotal,
  emptyMessage,
}) => {
  const hasItems = items.some((item) => item.value > 0);

  return (
    <div>
      <h3 className='font-medium px-3 mb-2 text-gray-700'>{title}</h3>
      <div className='space-y-1'>
        {hasItems ? (
          items.map(
            (item, index) =>
              item.value > 0 && (
                <p key={index} className='text-sm text-gray-900'>
                  {item.label}
                  {item.value} = ${item.amount.toFixed(2)}
                </p>
              )
          )
        ) : (
          <p className='text-sm text-gray-400'>{emptyMessage}</p>
        )}
      </div>
      <p className='text-sm font-medium text-gray-700 mt-2'>
        Subtotal: ${subtotal.toFixed(2)}
      </p>
    </div>
  );
};
