'use client';

import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { GRADE_LEVELS } from '../../lib/constants';
import { useToast } from '../../hooks/useToast';

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'mixed', label: 'Mixed' }
];

const PROMPT_TONES = [
  { value: 'Neutral', label: 'Neutral (Standard Academic)' },
  { value: 'Strict', label: 'Strict (Rigorous & Formal)' },
  { value: 'Encouraging', label: 'Encouraging (Supportive & Clear)' }
];

export default function SettingsPage() {
  const { defaultGradeLevel, defaultDifficulty, promptTone, setSettings } = useSettingsStore();
  const { toast } = useToast();
  
  // Local state for the form so we only save on submit
  const [localGrade, setLocalGrade] = useState(defaultGradeLevel);
  const [localDiff, setLocalDiff] = useState(defaultDifficulty);
  const [localTone, setLocalTone] = useState(promptTone);

  // Sync state if store updates from another tab
  useEffect(() => {
    setLocalGrade(defaultGradeLevel);
    setLocalDiff(defaultDifficulty);
    setLocalTone(promptTone);
  }, [defaultGradeLevel, defaultDifficulty, promptTone]);

  const handleSave = () => {
    setSettings({
      defaultGradeLevel: localGrade,
      defaultDifficulty: localDiff,
      promptTone: localTone,
    });
    toast('Settings saved successfully!', 'success');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-page pb-20">
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="font-serif font-black text-3xl md:text-4xl text-navy mb-3 tracking-tight">
          Settings
        </h1>
        <p className="font-sans text-muted text-lg max-w-2xl leading-relaxed">
          Configure your default preferences for the VedaAI assessment generator.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-paper border border-ink/5 max-w-3xl animate-in fade-in slide-in-from-bottom-4">
        <h3 className="font-serif font-bold text-xl text-navy mb-6 border-b border-ink/5 pb-4">Assessment Defaults</h3>
        
        <div className="space-y-6">
          <Select
            label="Default Grade Level"
            options={GRADE_LEVELS}
            value={localGrade}
            onChange={(e) => setLocalGrade(e.target.value)}
          />
          
          <div>
            <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-2 block">
              Default Difficulty
            </label>
            <select 
              value={localDiff} 
              onChange={(e) => setLocalDiff(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-navy-700/20 bg-cream/50 text-navy placeholder:text-navy-700/40 focus:outline-none focus:border-amber focus:bg-white transition-all font-medium appearance-none"
            >
              <option value="">Select a default difficulty...</option>
              {DIFFICULTY_LEVELS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-2 block">
              AI Prompt Tone
            </label>
            <select 
              value={localTone} 
              onChange={(e) => setLocalTone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-navy-700/20 bg-cream/50 text-navy placeholder:text-navy-700/40 focus:outline-none focus:border-amber focus:bg-white transition-all font-medium appearance-none"
            >
              {PROMPT_TONES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <p className="text-sm text-muted mt-2">This tone will be automatically applied to your AI instructions.</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink/10 flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
