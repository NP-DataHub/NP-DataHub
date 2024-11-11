import React, { useState } from 'react';

const BudgetForm = () => {
  const [formData, setFormData] = useState({
    budget: '',
    remaining: '',
    beneficiaries: '',
    costPerClient: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => {
        let updatedData = { ...prevData, [id]: value };

        // Calculate "remaining" when budget is updated
        if (id === 'budget') {
          updatedData.remaining = value ? String(Number(value) * 2) : '';
        }

        // Calculate "costPerClient" when beneficiaries is updated
        if (id === 'beneficiaries') {
          updatedData.costPerClient = value ? String(Number(value) * 2) : '';
        }

        return updatedData;
      });
    }
  };

  return (
    <div className="p-6 bg-[#171821] rounded-lg">
      <h3 className="text-xl font-semibold text-[#A9DFD8]">Calculator</h3>
      <p className="text-white">
        Compare NTEE code sectors against public data that align with various regional non-profit’s missions.
        The public data is pulled from the U.S. Census, which offers the strongest baseline across a host of demographic variables.
      </p>
      <h6 className="text font-semibold text-white mt-4">COST PER CLIENT/CONSTITUENT FOR GRANT OR PROJECT</h6>
      <form className="w-full max-md:max-w-full mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="budget" className="text-[#A9DFD8] mr-4 w-3/4">What is the grant or project budget? (ex. $50,000)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="What is the grant or project budget?"
            style={{ MozAppearance: 'textfield' }}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="remaining" className="text-[#A9DFD8] mr-4 w-3/4">New total remaining after percentage of salaries applied</label>
          <input
            type="text"
            id="remaining"
            name="remaining"
            value={formData.remaining}
            readOnly
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="New total remaining after percentage of salaries applied"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="beneficiaries" className="text-[#A9DFD8] mr-4 w-3/4">How many clients/constituents will benefit from the grant or project total?</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="beneficiaries"
            name="beneficiaries"
            value={formData.beneficiaries}
            onChange={handleChange}
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="How many clients/constituents will benefit from the grant or project total?"
            style={{ MozAppearance: 'textfield' }}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="costPerClient" className="text-[#A9DFD8] mr-4 w-3/4">New cost of services provided to one client/constituent based on budget</label>
          <input
            type="text"
            id="costPerClient"
            name="costPerClient"
            value={formData.costPerClient}
            readOnly
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="New cost of services provided to one client/constituent based on budget"
          />
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
