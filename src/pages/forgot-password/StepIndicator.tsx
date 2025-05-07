
import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
              ${step < currentStep 
                ? "bg-accent-blue border-accent-blue text-white" 
                : step === currentStep 
                  ? "border-accent-blue text-accent-blue" 
                  : "border-gray-300 text-gray-400"}`}
          >
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          <span className={`text-xs mt-1 ${step <= currentStep ? "text-accent-blue" : "text-gray-400"}`}>
            {step === 1 ? "Email" : step === 2 ? "OTP" : "Password"}
          </span>
        </div>
      ))}

      <div className="h-1 flex-1 bg-gray-200 absolute z-[-1] w-2/3 left-1/2 transform -translate-x-1/2">
        <div 
          className="h-full bg-accent-blue transition-all" 
          style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
        ></div>
      </div>
    </div>
  );
}
