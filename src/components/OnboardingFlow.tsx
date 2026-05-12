/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Flower2, ChevronRight, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    weight: 60,
    height: 165,
    cycleLength: 28,
    periodDuration: 5,
  });

  const steps = [
    {
      title: "FlowCycle for Athletes",
      description: "Customized period tracking designed for performance. Let's start with your physical stats.",
      fields: [
        { name: 'age', label: 'Age', type: 'number', suffix: 'years' },
        { name: 'weight', label: 'Weight', type: 'number', suffix: 'kg' },
        { name: 'height', label: 'Height', type: 'number', suffix: 'cm' },
      ]
    },
    {
      title: "Cycle Details",
      description: "This helps us predict your next cycle more accurately.",
      fields: [
        { name: 'cycleLength', label: 'Average Cycle Length', type: 'number', suffix: 'days' },
        { name: 'periodDuration', label: 'Average Period Duration', type: 'number', suffix: 'days' },
      ]
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const updateProfile = (name: string, value: string) => {
    setProfile(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const currentStepData = steps[step];

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="onboarding-card p-4">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-[#FFE4DC] rounded-full flex items-center justify-center mb-4">
                {step === 0 ? <Flower2 className="text-[#FF7E67] w-8 h-8" /> : <Sparkles className="text-[#FF7E67] w-8 h-8" />}
              </div>
              <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">{currentStepData.title}</CardTitle>
              <CardDescription className="text-slate-400 font-medium mt-2">{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {currentStepData.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      type={field.type}
                      value={(profile as any)[field.name]}
                      onChange={(e) => updateProfile(field.name, e.target.value)}
                      className="bg-[#F8F9FA] border border-slate-100 rounded-2xl h-12 text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#FF7E67]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                      {field.suffix}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button 
                  onClick={handleNext}
                  className="w-full bg-[#FF7E67] hover:brightness-105 text-white rounded-2xl h-14 text-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#FF7E6744]"
                >
                  {step === steps.length - 1 ? 'Start Tracking' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#FF7E67]' : 'w-2 bg-slate-100'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
