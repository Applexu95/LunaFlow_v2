/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhaseInsight {
  phase: string;
  hormones: string;
  athleticFocus: string;
  nutritionTip: string;
  recoveryAdvice: string;
  color: string;
  range: [number, number]; // range of days in the cycle
}

export const CYCLE_PHASES: PhaseInsight[] = [
  {
    phase: "Menstrual Phase",
    range: [1, 5],
    hormones: "Estrogen and Progesterone are at their lowest.",
    athleticFocus: "Focus on mobility, recovery, and low-intensity steady state (LISS). Ideal for technical skill work that isn't physically draining.",
    nutritionTip: "Prioritize iron-rich foods (lean meat, lentils) and anti-inflammatory nutrients (Omega-3s).",
    recoveryAdvice: "Sleep is your best friend now. Your body's baseline stress is higher, so don't be afraid to take an extra rest day.",
    color: "#FF7E67"
  },
  {
    phase: "Follicular Phase",
    range: [6, 12],
    hormones: "Estrogen is rising. Insulin sensitivity is high.",
    athleticFocus: "High Intensity Power. This is your 'Go Time'. Your body is primed for strength gains, HIIT, and heavy lifting.",
    nutritionTip: "Carbohydrate loading is most effective now. Ensure high-quality protein for muscle hypertrophy.",
    recoveryAdvice: "Muscle recovery is at its peak. You can safely increase training volume and frequency.",
    color: "#009688"
  },
  {
    phase: "Ovulatory Phase",
    range: [13, 15],
    hormones: "Estrogen and Luteinizing Hormone (LH) peak.",
    athleticFocus: "Peak Performance. You likely feel strongest and most confident. Be mindful of higher ACL/ligament laxity; warm up properly.",
    nutritionTip: "Support estrogen metabolism with cruciferous vegetables (broccoli, kale). Hydrate more than usual.",
    recoveryAdvice: "Dynamic warm-ups are critical. Your body temperature begins to rise.",
    color: "#FBC02D"
  },
  {
    phase: "Luteal Phase",
    range: [16, 32], // Extend to 32 to cover longer cycles
    hormones: "Progesterone peaks. Body temperature and heart rate increase.",
    athleticFocus: "Endurance & Skill. Focus on aerobic capacity. Avoid maximum exertion in hot/humid conditions as cooling is harder.",
    nutritionTip: "Metabolic rate increases. You may need 200+ extra calories. Complex carbs will help manage PMS symptoms.",
    recoveryAdvice: "Prioritize magnesium for muscle relaxation. Deep sleep may be harder to achieve, so use cooling bedding.",
    color: "#9C27B0"
  }
];
