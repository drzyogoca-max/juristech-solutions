/**
 * src/components/ai-advisor/AIResponseFeedback.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Anonymous AI Response Quality Feedback
 * Specification: Task 11 Phase 6
 *
 * Captures user quality ratings anonymously:
 *  { responseType, rating, feature, timestamp }
 * STRICT RULE: Zero prompt, contract, document, or PII storage.
 */

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import type { SupportedAILang } from '../../ai/types';

export interface FeedbackData {
  responseType: string;
  rating: 'helpful' | 'needs_improvement';
  feature: string;
  timestamp: string;
}

interface AIResponseFeedbackProps {
  feature: string;
  responseType?: string;
  lang: SupportedAILang;
  isRtl?: boolean;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
}

export const AIResponseFeedback: React.FC<AIResponseFeedbackProps> = ({
  feature,
  responseType = 'legal_advisory',
  lang,
  isRtl = false,
  onFeedbackSubmit,
}) => {
  const [selectedRating, setSelectedRating] = useState<'helpful' | 'needs_improvement' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isAr = lang === 'ar';

  const handleRating = (rating: 'helpful' | 'needs_improvement') => {
    if (submitted) return;
    setSelectedRating(rating);
    setSubmitted(true);

    const feedback: FeedbackData = {
      responseType,
      rating,
      feature,
      timestamp: new Date().toISOString(),
    };

    if (onFeedbackSubmit) {
      onFeedbackSubmit(feedback);
    }
  };

  return (
    <div className={`flex items-center gap-2 pt-2 text-xs text-slate-400 ${isRtl ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
      <span className="text-[11px]">
        {isAr ? 'هل كانت هذه الإجابة مفيدة؟' : 'Was this response helpful?'}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleRating('helpful')}
          disabled={submitted}
          aria-label={isAr ? 'مفيد' : 'Helpful'}
          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
            selectedRating === 'helpful'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          {submitted && selectedRating === 'helpful' && <Check className="w-2.5 h-2.5 text-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => handleRating('needs_improvement')}
          disabled={submitted}
          aria-label={isAr ? 'تحتاج تحسين' : 'Needs Improvement'}
          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
            selectedRating === 'needs_improvement'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ThumbsDown className="w-3 h-3" />
          {submitted && selectedRating === 'needs_improvement' && <Check className="w-2.5 h-2.5 text-amber-400" />}
        </button>
      </div>

      {submitted && (
        <span className="text-[10px] text-emerald-400 font-medium">
          {isAr ? 'شكراً لتقييمك!' : 'Thank you for your feedback!'}
        </span>
      )}
    </div>
  );
};
