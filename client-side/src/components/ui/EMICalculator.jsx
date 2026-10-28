import React, { useState, useMemo, useEffect } from "react";
import { Calculator, Percent, Calendar, IndianRupee } from "lucide-react";

const EMICalculator = ({ initialPrice = 14500000 }) => {
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setPropertyPrice(initialPrice);
    }
  }, [initialPrice]);

  const minPrice = useMemo(() => Math.max(500000, Math.floor(initialPrice * 0.3)), [initialPrice]);
  const maxPrice = useMemo(() => Math.max(100000000, Math.ceil(initialPrice * 2)), [initialPrice]);
  const priceStep = useMemo(() => (maxPrice > 20000000 ? 500000 : 100000), [maxPrice]);

  const loanAmount = useMemo(() => {
    return propertyPrice * (1 - downPaymentPercent / 100);
  }, [propertyPrice, downPaymentPercent]);

  const { monthlyEmi, totalInterest, totalPayable } = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    if (monthlyRate === 0) {
      const emi = principal / totalMonths;
      return { monthlyEmi: emi, totalInterest: 0, totalPayable: principal };
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const payable = emi * totalMonths;
    const interest = payable - principal;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(interest),
      totalPayable: Math.round(payable)
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatRupees = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 sm:p-6 text-xs">
      <div className="flex items-center space-x-2 border-b border-[var(--color-border)] pb-3">
        <Calculator className="w-4 h-4 text-[var(--color-terracotta)]" />
        <h4 className="font-editorial text-base sm:text-lg font-bold text-[var(--color-foreground)]">
          Home Loan & EMI Simulator
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Sliders on Left */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-[var(--color-muted-foreground)]">Property Value</span>
              <span className="font-mono font-bold text-[var(--color-foreground)]">{formatRupees(propertyPrice)}</span>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={priceStep}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-terracotta)] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-[var(--color-muted-foreground)]">Down Payment ({downPaymentPercent}%)</span>
              <span className="font-mono font-bold text-[var(--color-foreground)]">
                {formatRupees((propertyPrice * downPaymentPercent) / 100)}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[var(--color-terracotta)] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-[var(--color-muted-foreground)]">Interest Rate</span>
                <span className="font-mono font-bold text-[var(--color-foreground)]">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="7.5"
                max="12.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[var(--color-terracotta)] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-[var(--color-muted-foreground)]">Loan Tenure</span>
                <span className="font-mono font-bold text-[var(--color-foreground)]">{tenureYears} Yrs</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[var(--color-terracotta)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Box on Right */}
        <div className="lg:col-span-5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)]">
              Estimated Monthly EMI
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-terracotta)] mt-1">
              ₹{monthlyEmi.toLocaleString("en-IN")}<span className="text-xs text-[var(--color-muted-foreground)] font-normal"> /mo</span>
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-[var(--color-border)] text-[11px]">
            <div className="flex justify-between text-[var(--color-muted-foreground)]">
              <span>Principal Loan Amount:</span>
              <span className="font-mono font-bold text-[var(--color-foreground)]">{formatRupees(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-muted-foreground)]">
              <span>Total Interest Payable:</span>
              <span className="font-mono font-bold text-[var(--color-foreground)]">{formatRupees(totalInterest)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-muted-foreground)] pt-1 border-t border-[var(--color-border)]">
              <span>Total Cost (Principal + Int):</span>
              <span className="font-mono font-bold text-[var(--color-foreground)]">{formatRupees(totalPayable)}</span>
            </div>
          </div>

          <p className="text-[9px] text-[var(--color-muted-foreground)] mt-3">
            *Indicative estimates based on standard monthly reducing balance. Actual bank sanctions subject to credit appraisal and CIBIL score.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
