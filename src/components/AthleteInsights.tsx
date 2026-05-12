/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhaseInsight } from '@/src/constants/insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Utensils, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AthleteInsightsProps {
  currentPhase: PhaseInsight | null;
  cycleDay: number;
}

export default function AthleteInsights({ currentPhase, cycleDay }: AthleteInsightsProps) {
  if (!currentPhase) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1.5 h-8 bg-[#FF7E67] rounded-full"></div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Athlete Intelligence</h2>
      </div>

      <Card className="rounded-[40px] border border-[#FFE4DC] shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 pb-8 border-b border-slate-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-black text-slate-800 mb-1">{currentPhase.phase}</CardTitle>
                <p className="text-slate-500 font-medium">Cycle Day {cycleDay} • <span className="italic" style={{ color: currentPhase.color }}>{currentPhase.hormones}</span></p>
              </div>
              <div 
                className="px-6 py-2 rounded-2xl text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2"
                style={{ backgroundColor: currentPhase.color }}
              >
                <Zap className="w-4 h-4" />
                Phase Optimized
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="w-full h-16 bg-white border-b border-slate-100 rounded-none p-0 flex justify-around">
              <TabsTrigger 
                value="training" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF7E67] data-[state=active]:bg-[#FFF5F2] data-[state=active]:text-[#FF7E67] font-bold uppercase text-xs tracking-widest transition-all"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger 
                value="nutrition" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF7E67] data-[state=active]:bg-[#FFF5F2] data-[state=active]:text-[#FF7E67] font-bold uppercase text-xs tracking-widest transition-all"
              >
                <Utensils className="w-4 h-4 mr-2" />
                Fueling
              </TabsTrigger>
              <TabsTrigger 
                value="recovery" 
                className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF7E67] data-[state=active]:bg-[#FFF5F2] data-[state=active]:text-[#FF7E67] font-bold uppercase text-xs tracking-widest transition-all"
              >
                <Info className="w-4 h-4 mr-2" />
                Recovery
              </TabsTrigger>
            </TabsList>
            
            <div className="p-8">
              <TabsContent value="training" className="mt-0 focus-visible:outline-none">
                <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#FF7E67] shrink-0">
                      <Dumbbell className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800 mb-2">Performance Strategy</h4>
                      <p className="text-slate-600 leading-relaxed text-lg">{currentPhase.athleticFocus}</p>
                   </div>
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="mt-0 focus-visible:outline-none">
                <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#FF7E67] shrink-0">
                      <Utensils className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800 mb-2">Nutritional Fueling</h4>
                      <p className="text-slate-600 leading-relaxed text-lg">{currentPhase.nutritionTip}</p>
                   </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recovery" className="mt-0 focus-visible:outline-none">
                <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#FF7E67] shrink-0">
                      <Info className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800 mb-2">Recovery Advice</h4>
                      <p className="text-slate-600 leading-relaxed text-lg">{currentPhase.recoveryAdvice}</p>
                   </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        <div className="px-8 py-4 bg-slate-50 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 text-center">
           Expertly analyzed hormones for peak performance
        </div>
      </Card>
    </motion.div>
  );
}
