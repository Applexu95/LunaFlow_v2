/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserProfile, CycleEntry } from '@/src/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateNextCycle, getStatusMessage, formatReadableDate, getCurrentPhase, getCycleDay } from '@/src/lib/cycleUtils';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar as CalendarIcon, History, User, Settings2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ATHLETE_FACTS } from '@/src/constants/educationalFacts';
import AthleteInsights from './AthleteInsights';
import AIChat from './AIChat';

interface PeriodDashboardProps {
  profile: UserProfile;
  entries: CycleEntry[];
  onAddEntry: (date: Date) => void;
  onReset: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function PeriodDashboard({ profile, entries, onAddEntry, onReset, onUpdateProfile }: PeriodDashboardProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    if (isEditOpen) {
      setTempProfile(profile);
    }
  }, [isEditOpen, profile]);

  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  const { nextDate, daysRemaining, isOverdue } = lastEntry 
    ? calculateNextCycle(lastEntry.startDate, profile.cycleLength)
    : { nextDate: new Date(), daysRemaining: 0, isOverdue: false };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-8 py-4 rounded-3xl border border-[#FFE4DC] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF7E67] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-[#FF7E67] tracking-tight">LunaFlow</span>
        </div>
        <div className="flex items-center gap-4">
           <Button 
            variant="ghost" 
            onClick={onReset}
            className="text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest"
          >
            Reset
          </Button>
          <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-[#FF7E67] font-bold">
            U
          </div>
        </div>
      </header>

      {/* Grid Layout to match Design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Column (Left-ish in design) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <Card className="rounded-[32px] border border-[#FFE4DC] shadow-sm p-8 bg-white overflow-hidden">
              <h2 className="text-xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#FF7E67] rounded-full"></span>
                My Profile
              </h2>
              
              <div className="space-y-6">
                {[
                  { label: 'Age', value: profile.age, suffix: 'yrs' },
                  { label: 'Weight', value: profile.weight, suffix: 'kg' },
                  { label: 'Height', value: profile.height, suffix: 'cm' },
                  { label: 'Cycle', value: profile.cycleLength, suffix: 'days' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</label>
                    <div className="flex items-center gap-2 bg-[#F8F9FA] px-4 py-2 rounded-2xl border border-slate-100">
                      <span className="font-bold text-lg text-slate-700">{item.value}</span>
                      <span className="text-xs text-slate-400 uppercase">{item.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger 
                    render={
                      <Button 
                        className="w-full py-4 bg-[#FF7E67] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7E6744] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Update Information
                      </Button>
                    }
                  />
                  <DialogContent className="rounded-[32px] border-[#FFE4DC] sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black text-slate-800">Update Profile</DialogTitle>
                      <DialogDescription className="font-medium text-slate-500">
                        Adjust your physical stats for better cycle predictions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      {[
                        { label: 'Age', name: 'age', suffix: 'yrs' },
                        { label: 'Weight', name: 'weight', suffix: 'kg' },
                        { label: 'Height', name: 'height', suffix: 'cm' },
                        { label: 'Cycle Length', name: 'cycleLength', suffix: 'days' }
                      ].map((field) => (
                        <div key={field.name} className="flex flex-col gap-2">
                          <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            {field.label}
                          </Label>
                          <div className="relative">
                            <Input
                              id={field.name}
                              type="number"
                              value={(tempProfile as any)[field.name]}
                              onChange={(e) => setTempProfile(prev => ({ ...prev, [field.name]: parseInt(e.target.value) || 0 }))}
                              className="bg-[#F8F9FA] border border-slate-100 rounded-2xl h-12 text-lg px-4 focus-visible:ring-2 focus-visible:ring-[#FF7E67]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                              {field.suffix}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <Button 
                        type="button" 
                        onClick={() => {
                          onUpdateProfile(tempProfile);
                          setIsEditOpen(false);
                        }}
                        className="w-full bg-[#FF7E67] hover:brightness-105 text-white rounded-2xl h-14 text-lg font-bold transition-all active:scale-95"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </motion.div>

          {/* History */}
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
          >
            <Card className="rounded-[32px] border border-[#FFE4DC] shadow-sm p-8 bg-white">
              <h2 className="text-xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#FF7E67] rounded-full"></span>
                Cycle History
              </h2>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.length === 0 ? (
                  <p className="text-slate-400 italic text-sm">No history yet</p>
                ) : (
                  entries.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl transition-colors hover:bg-[#FFE4DC]/30">
                      <span className="font-bold text-slate-700">
                        {format(parseISO(entry.startDate), 'MMM do')}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-1 rounded-md text-[#FF7E67] font-black uppercase tracking-tighter shadow-sm">Log</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Athlete Pro Tips */}
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
          >
            <Card className="rounded-[32px] border border-[#FFE4DC] shadow-sm p-8 bg-[#FFE4DC]/20">
              <h2 className="text-xl font-bold mb-4 text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#FF7E67] rounded-full"></span>
                Pro Tips for Athletes
              </h2>
              <div className="space-y-4">
                {ATHLETE_FACTS.map((fact, i) => (
                  <div key={i} className={cn("p-4 bg-white rounded-2xl border border-[#FFE4DC]/50", i > 0 && "hidden md:block" )}>
                    <p className="font-black text-[#FF7E67] text-sm mb-1">{fact.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{fact.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Dashboard Column (Right-ish in design) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-[40px] border border-[#FFE4DC] shadow-sm bg-white p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD7CE] rounded-full opacity-20"></div>
              <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-[#FF7E67] rounded-full opacity-5"></div>

              <div className="z-10 text-center md:text-left space-y-4">
                <p className="text-[#FF7E67] font-bold text-sm uppercase tracking-[0.2em]">Current Status</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                  {lastEntry ? (
                    <>
                      Next cycle in<br/>
                      <span className="text-[#FF7E67]">
                        {isOverdue ? "Overdue" : `${daysRemaining} Days`}
                      </span>
                    </>
                  ) : (
                    "Ready to begin?"
                  )}
                </h1>
                {lastEntry && (
                  <p className="text-slate-400 font-medium max-w-[280px]">
                    Expected start: <span className="text-slate-600 font-bold">{formatReadableDate(nextDate)}</span>
                  </p>
                )}
                
                <div className="flex gap-4 pt-4 justify-center md:justify-start">
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger 
                      render={
                        <Button className="bg-[#FF7E67] hover:brightness-105 text-white rounded-2xl px-10 py-5 h-auto text-lg font-bold transition-all active:scale-95 shadow-lg shadow-[#FF7E6744]">
                          Log Period
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-[#FFE4DC] shadow-2xl" align="center">
                      <Calendar
                        mode="single"
                        selected={undefined}
                        onSelect={(date) => {
                          if (date) {
                            onAddEntry(date);
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] flex items-center justify-center mt-8 md:mt-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="50%" cy="50%" r="45%" 
                    stroke="#FF7E67" strokeWidth="20" fill="transparent" 
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: '283',
                      strokeDashoffset: lastEntry ? Math.max(0, 283 - (entries.length > 0 ? (daysRemaining / profile.cycleLength) * 283 : 0)) : 283,
                      transition: 'stroke-dashoffset 1s ease-out'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-slate-800">{daysRemaining}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days left</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🩸', label: 'Log Flow', sub: 'Add symptoms', bg: '#FFE4DC', hover: '#FFD7CE', color: '#FF7E67' },
              { icon: '💊', label: 'Medication', sub: 'Track intake', bg: '#E0F2F1', hover: '#B2DFDB', color: '#009688' },
              { icon: '😊', label: 'Mood Log', sub: 'Daily check-in', bg: '#FFF9C4', hover: '#FFF59D', color: '#FBC02D' }
            ].map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="group cursor-pointer"
                onClick={() => {
                  if (action.label === 'Log Flow') {
                    setIsCalendarOpen(true);
                  } else {
                    alert(`${action.label} will be integrated with your performance data in the next update!`);
                  }
                }}
              >
                <div 
                  className="p-8 rounded-[32px] flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md active:scale-95 shadow-sm"
                  style={{ backgroundColor: action.bg }}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">{action.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70" style={{ color: action.color }}>{action.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Athlete Insights */}
          {lastEntry && (
            <AthleteInsights 
              currentPhase={getCurrentPhase(lastEntry.startDate, profile.cycleLength)} 
              cycleDay={getCycleDay(lastEntry.startDate)} 
            />
          )}
        </div>
      </div>

      <AIChat profile={profile} />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
