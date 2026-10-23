import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Rocket, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { surveySections, questionClusters, allQuestions } from '../../data/surveyQuestions';
import PeekingCharacter from './PeekingCharacter';
import WalkingAvatarProgressBar from './WalkingAvatarProgressBar';
import RetroScaleSlider from './RetroScaleSlider';
import SurveyIcon from '../../components/SurveyIcon';
import { submitToGoogleSheets } from '../../services/googleSheets';

export default function RetroSurveyView() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentClusterIndex, setCurrentClusterIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customInputs, setCustomInputs] = useState({});
  const [isWaitlistStage, setIsWaitlistStage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' });

  const currentCluster = questionClusters[currentClusterIndex] || questionClusters[0];

  // Active questions for the currently selected cluster (satisfying showIf condition)
  const clusterQuestions = useMemo(() => {
    return allQuestions.filter(
      (q) => currentCluster.questionIds.includes(q.id) && (!q.showIf ? true : q.showIf(answers))
    );
  }, [currentCluster, answers]);

  // Overall progress across 10 relatable clusters
  const progressPercent = isWaitlistStage
    ? 100
    : Math.round(((currentClusterIndex) / questionClusters.length) * 100);

  // Alternates mascot side by cluster
  const peekingSide = currentClusterIndex % 2 === 0 ? 'right' : 'left';

  const triggerAnsweringFeedback = () => {
    setIsAnswering(true);
    setTimeout(() => setIsAnswering(false), 700);
  };

  const handleSingleSelect = (questionId, optionLabel) => {
    triggerAnsweringFeedback();
    setAnswers((prev) => ({ ...prev, [questionId]: optionLabel }));
  };

  const handleMultiSelect = (questionId, optionLabel) => {
    triggerAnsweringFeedback();
    const currentList = Array.isArray(answers[questionId]) ? answers[questionId] : [];
    const isAlreadySelected = currentList.includes(optionLabel);
    const updatedList = isAlreadySelected
      ? currentList.filter((item) => item !== optionLabel)
      : [...currentList, optionLabel];

    setAnswers((prev) => ({ ...prev, [questionId]: updatedList }));
  };

  const handleCustomInputChange = (questionId, text) => {
    setCustomInputs((prev) => ({ ...prev, [questionId]: text }));
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text ? `Other: ${text}` : 'Other',
    }));
  };

  const handleNextCluster = () => {
    if (currentClusterIndex < questionClusters.length - 1) {
      setCurrentClusterIndex((prev) => prev + 1);
    } else {
      setIsWaitlistStage(true);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackCluster = () => {
    if (isWaitlistStage) {
      setIsWaitlistStage(false);
      return;
    }
    if (currentClusterIndex > 0) {
      setCurrentClusterIndex((prev) => prev - 1);
    } else {
      setHasStarted(false);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = clusterQuestions.filter((q) => {
    if (q.type === 'scale') return true;
    if (q.type === 'multi') return answers[q.id]?.length > 0;
    return !!answers[q.id];
  }).length;

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!leadInfo.name || !leadInfo.email) return;

    setIsSubmitting(true);
    try {
      await submitToGoogleSheets(answers, leadInfo);
      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#95d9c0', '#0a0a0a', '#d41f26', '#fed766'],
      });
    } catch (err) {
      alert('Error submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f6f2] text-[#0a0a0a] font-retro flex flex-col justify-between overflow-x-hidden">
      {/* Retro Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 border-b-2 border-black bg-white/95 px-4 py-2 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:pr-28">
          {/* Logo & Brand Motto */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 border-2 border-black rounded-lg overflow-hidden p-0.5 bg-[#95d9c0] shadow-[2px_2px_0px_#000]">
              <img src="/logo.png" alt="Cognibloom Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-sm font-bold text-black tracking-tight">
                  COGNIBLOOM
                </span>
                <span className="bg-[#d41f26] text-white text-[9px] font-pixel px-1.5 py-0.2 rounded-xs">
                  AI v2.0
                </span>
              </div>
              <p className="text-[10px] text-zinc-600 font-sans hidden sm:block">
                The AI That Teaches, Not Just Answers.
              </p>
            </div>
          </div>

          {/* Progress Status */}
          {hasStarted && (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="font-pixel text-[11px] bg-black text-[#95d9c0] px-2.5 py-1 rounded-md border border-black shadow-[2px_2px_0px_#95d9c0]">
                QUEST: {isWaitlistStage ? 'FINAL' : `PHASE 0${currentCluster.id}/10 // ${currentCluster.title}`}
              </span>
            </div>
          )}
        </div>

        {/* Walking Avatar Progress Track */}
        {hasStarted && !isSubmitted && (
          <div className="max-w-5xl mx-auto mt-1 sm:pr-28">
            <WalkingAvatarProgressBar progressPercent={progressPercent} />
          </div>
        )}
      </header>

      {/* Main Content Area - Expansive on Welcome, Ultra-Wide & Balanced on Questions */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-4 sm:py-8">
        <div className={`w-full relative transition-all duration-300 ${!hasStarted ? 'max-w-4xl' : isWaitlistStage ? 'max-w-xl' : 'max-w-5xl lg:max-w-6xl'}`}>
          {/* Peeking Mascot behind the active question card from Left or Right */}
          {hasStarted && !isWaitlistStage && (
            <PeekingCharacter
              side={peekingSide}
              questionIndex={currentClusterIndex}
              isAnswering={isAnswering}
            />
          )}

          <AnimatePresence mode="wait">
            {/* 1. RETRO EXPANDED WELCOME SCREEN */}
            {!hasStarted && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="w-full bg-white border-2 sm:border-3 border-black rounded-2xl p-5 sm:p-7 shadow-[6px_6px_0px_#000] relative"
              >
                {/* Top OS Window Bar */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#d41f26] border border-black shadow-[1px_1px_0px_#000]" />
                    <span className="h-3 w-3 rounded-full bg-[#fed766] border border-black shadow-[1px_1px_0px_#000]" />
                    <span className="h-3 w-3 rounded-full bg-[#95d9c0] border border-black shadow-[1px_1px_0px_#000]" />
                    <span className="text-[11px] sm:text-xs font-pixel ml-2 text-black">
                      COGNIBLOOM // SYSTEM_DIAGNOSTIC_2026.EXE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[10px] font-pixel text-zinc-500">
                      FRAMEWORK: SLC v1.0
                    </span>
                    <span className="text-[9px] font-pixel bg-[#95d9c0] text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] flex items-center gap-1.5 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                </div>

                {/* 2-Column Responsive Layout: Left details, Right terminal & action */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* LEFT COLUMN: Product Philosophy & Mission Intro (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-center space-y-4 pr-0 lg:pr-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#eaf3f0] border border-black rounded-md font-pixel text-[10px] text-[#0f7d5e] mb-3 shadow-[1px_1px_0px_#000]">
                        <Sparkles className="h-3 w-3 text-[#0f7d5e]" />
                        <span>SIMPLE • LOVABLE • COMPLETE</span>
                      </div>

                      <h1 className="font-pixel text-2xl sm:text-3xl text-black leading-tight tracking-tight mb-3">
                        UNDERSTANDING IS BUILT, NOT MEMORIZED.
                      </h1>

                      <p className="font-sans text-xs sm:text-sm text-zinc-700 leading-relaxed">
                        Most AI tools spit out shallow answers that you forget the next day. <strong className="text-black font-semibold">Cognibloom</strong> is engineered around a connected learning system to challenge, guide, and train your brain into genuine understanding.
                      </p>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Diagnostic Terminal Box with START Button (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-[#f4f3ef] border-2 border-black rounded-xl p-4 sm:p-5 shadow-[3px_3px_0px_#000]">
                    <div>
                      {/* Terminal Mission Header */}
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/15">
                        <div className="flex items-center gap-1.5 font-pixel text-[11px] text-[#0f7d5e] font-bold">
                          <Terminal className="h-3.5 w-3.5" />
                          <span>MISSION_CONTROL.EXE</span>
                        </div>
                        <span className="text-[9px] font-pixel bg-black text-[#95d9c0] px-1.5 py-0.5 rounded border border-black">
                          SLOT #CB-2026
                        </span>
                      </div>

                      {/* Mission Objective */}
                      <div className="bg-white border-2 border-black rounded-lg p-3 mb-3 shadow-[2px_2px_0px_#000]">
                        <p className="font-pixel text-[9px] text-zinc-500 uppercase tracking-wider mb-1">
                          &gt;_ MISSION OBJECTIVE:
                        </p>
                        <p className="font-sans text-xs text-zinc-800 leading-snug">
                          Help us decode how your memory drops, what makes difficult concepts stick, and what your ultimate AI study buddy must look like.
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-1.5 mb-3.5 text-[11px] font-sans text-zinc-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0f7d5e] shrink-0" />
                          <span>100% Private cognitive assessment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0f7d5e] shrink-0" />
                          <span>Priority Founding Cohort Beta key</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0f7d5e] shrink-0" />
                          <span>Zero signup required to initialize</span>
                        </div>
                      </div>

                      {/* Diagnostic Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        <span className="px-2 py-0.5 bg-white border border-black rounded-md font-pixel text-[10px] flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                          <Clock className="h-3 w-3 text-zinc-600" /> ~2 MINS
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-black rounded-md font-pixel text-[10px] flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                          <Lock className="h-3 w-3 text-zinc-600" /> PRIVATE
                        </span>
                        <span className="px-2 py-0.5 bg-[#95d9c0] text-black border border-black rounded-md font-pixel text-[10px] flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                          <Rocket className="h-3 w-3 text-black" /> VIP ACCESS
                        </span>
                      </div>
                    </div>

                    {/* Prominent START Button on Right Side */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setHasStarted(true)}
                        className="w-full py-3.5 px-4 bg-black text-[#95d9c0] font-pixel text-xs sm:text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_#95d9c0] hover:bg-zinc-900 hover:shadow-[5px_5px_0px_#95d9c0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <span>START SYSTEM DIAGNOSTIC</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-[10px] font-retro text-center text-zinc-500 mt-2">
                        [INITIALIZE ACTIVE QUESTIONNAIRE]
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. RETRO CLUSTER COLLAGE VIEW (2 to 3 Relatable Questions per Slide) */}
            {hasStarted && !isWaitlistStage && currentCluster && (
              <motion.div
                key={`cluster-${currentCluster.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full bg-white border-2 sm:border-3 border-black rounded-2xl p-4 sm:p-7 shadow-[6px_6px_0px_#000] relative z-10"
              >
                {/* Cluster Top OS Bar */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#d41f26] border border-black shadow-[1px_1px_0px_#000]" />
                    <span className="h-3 w-3 rounded-full bg-[#fed766] border border-black shadow-[1px_1px_0px_#000]" />
                    <span className="h-3 w-3 rounded-full bg-[#95d9c0] border border-black shadow-[1px_1px_0px_#000]" />
                    <span className="text-[11px] sm:text-xs font-pixel ml-2 text-black">
                      COGNIBLOOM // PHASE_0{currentCluster.id}.EXE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] bg-black text-[#95d9c0] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                      PHASE {currentClusterIndex + 1} OF {questionClusters.length}
                    </span>
                  </div>
                </div>

                {/* Cluster Header Banner - Compact & Wide */}
                <div className="bg-[#f7f6f2] border-2 border-black rounded-xl p-3 sm:p-3.5 mb-4 shadow-[2px_2px_0px_#000]">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-pixel text-[9px] bg-[#95d9c0] text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] font-bold">
                      {currentCluster.badge}
                    </span>
                    <span className="font-pixel text-[9px] text-zinc-500">
                      {answeredCount} OF {clusterQuestions.length} ANSWERED
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h2 className="font-pixel text-base sm:text-xl text-black">
                      {currentCluster.title}
                    </h2>
                    <p className="font-sans text-[11px] text-zinc-600">
                      {currentCluster.subtitle}
                    </p>
                  </div>
                </div>

                {/* Relatable Questions Collage - 2 Columns on Desktop */}
                <div className={`grid gap-4 items-stretch ${
                  clusterQuestions.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'
                }`}>
                  {clusterQuestions.map((q, qIdx) => {
                    const isAnswered =
                      q.type === 'scale'
                        ? true
                        : q.type === 'multi'
                        ? answers[q.id]?.length > 0
                        : !!answers[q.id];

                    return (
                      <div
                        key={q.id}
                        className={`border-2 rounded-xl p-3.5 sm:p-4 transition-all shadow-[2px_2px_0px_#000] flex flex-col justify-between ${
                          isAnswered ? 'bg-[#fafafa] border-black' : 'bg-white border-black/80'
                        }`}
                      >
                        <div>
                          {/* Question Header */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-start gap-1.5">
                              <span className="font-pixel text-[9px] bg-black text-[#95d9c0] px-1.5 py-0.2 rounded border border-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#95d9c0]">
                                Q{q.number || qIdx + 1}
                              </span>
                              <h3 className="font-sans font-bold text-xs sm:text-[13px] text-black leading-snug">
                                {q.question}
                              </h3>
                            </div>

                            {isAnswered && (
                              <span className="shrink-0 font-pixel text-[8px] bg-[#95d9c0] text-black px-1.5 py-0.2 rounded border border-black shadow-[1px_1px_0px_#000] flex items-center gap-0.5 font-bold">
                                <Check className="h-2 w-2" /> SAVED
                              </span>
                            )}
                          </div>

                          {q.subtitle && (
                            <p className="font-sans text-[10px] text-zinc-500 mb-2 pl-5">
                              {q.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Question Content: Scale Slider */}
                        {q.type === 'scale' && (
                          <div className="pt-1.5">
                            <RetroScaleSlider
                              options={q.scaleOptions}
                              value={
                                answers[q.id] ||
                                q.scaleOptions[q.defaultValueIndex || 0]
                              }
                              onChange={(val) => {
                                triggerAnsweringFeedback();
                                setAnswers((prev) => ({ ...prev, [q.id]: val }));
                              }}
                            />
                          </div>
                        )}

                        {/* Question Content: Multi-Select */}
                        {q.type === 'multi' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {q.options.map((opt) => {
                              const list = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                              const isSelected = list.includes(opt.label);
                              return (
                                <button
                                  key={opt.label}
                                  type="button"
                                  onClick={() => handleMultiSelect(q.id, opt.label)}
                                  className={`p-2 px-2.5 rounded-lg border-2 text-left font-sans text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#95d9c0] border-black text-black font-bold shadow-[2px_2px_0px_#000]'
                                      : 'bg-white border-zinc-300 text-zinc-800 hover:border-black hover:bg-zinc-50'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5 min-w-0">
                                    {(opt.icon || opt.emoji) && (
                                      <span
                                        className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                          isSelected
                                            ? 'bg-black text-[#95d9c0] border-black'
                                            : 'bg-black/5 text-zinc-700 border-black/15'
                                        }`}
                                      >
                                        <SurveyIcon
                                          name={opt.icon}
                                          emoji={opt.emoji}
                                          className="h-3 w-3 stroke-[2.2]"
                                        />
                                      </span>
                                    )}
                                    <span className="leading-tight truncate text-xs">{opt.label}</span>
                                  </span>
                                  <span
                                    className={`h-3.5 w-3.5 border border-black rounded-xs flex items-center justify-center shrink-0 ${
                                      isSelected ? 'bg-black text-[#95d9c0]' : 'bg-white'
                                    }`}
                                  >
                                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Question Content: Single-Select */}
                        {q.type === 'single' && (
                          <div
                            className={`grid gap-1.5 pt-1 ${
                              q.options.length >= 4
                                ? 'grid-cols-1 sm:grid-cols-2'
                                : 'grid-cols-1'
                            }`}
                          >
                            {q.options.map((opt) => {
                              const isSelected =
                                answers[q.id] === opt.label ||
                                (opt.hasCustomInput && answers[q.id]?.startsWith('Other'));
                              return (
                                <div
                                  key={opt.label}
                                  className={
                                    opt.hasCustomInput && isSelected ? 'sm:col-span-2' : ''
                                  }
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleSingleSelect(q.id, opt.label)}
                                    className={`w-full p-2 px-2.5 rounded-lg border-2 text-left font-sans text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#95d9c0] border-black text-black font-bold shadow-[2px_2px_0px_#000]'
                                        : 'bg-white border-zinc-300 text-zinc-800 hover:border-black hover:bg-zinc-50'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5 min-w-0">
                                      {(opt.icon || opt.emoji) && (
                                        <span
                                          className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                            isSelected
                                              ? 'bg-black text-[#95d9c0] border-black'
                                              : 'bg-black/5 text-zinc-700 border-black/15'
                                          }`}
                                        >
                                          <SurveyIcon
                                            name={opt.icon}
                                            emoji={opt.emoji}
                                            className="h-3 w-3 stroke-[2.2]"
                                          />
                                        </span>
                                      )}
                                      <span className="leading-snug truncate text-xs">{opt.label}</span>
                                    </span>
                                    <span
                                      className={`h-3.5 w-3.5 rounded-full border border-black flex items-center justify-center shrink-0 ${
                                        isSelected ? 'bg-black text-[#95d9c0]' : 'bg-white'
                                      }`}
                                    >
                                      {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                    </span>
                                  </button>

                                  {/* Custom Other Input */}
                                  {opt.hasCustomInput && isSelected && (
                                    <div className="mt-1.5 pl-0.5">
                                      <input
                                        type="text"
                                        autoFocus
                                        value={customInputs[q.id] || ''}
                                        onChange={(e) =>
                                          handleCustomInputChange(q.id, e.target.value)
                                        }
                                        placeholder="Please specify details..."
                                        className="w-full px-2.5 py-1.5 rounded-md border-2 border-black bg-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#95d9c0]"
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sticky Bottom Cluster Navigation Dock - Always Visible! */}
                <div className="sticky bottom-2 z-30 mt-6 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleBackCluster}
                    className="px-3.5 py-2 bg-white text-black font-pixel text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span className="hidden sm:inline">{currentClusterIndex === 0 ? 'BACK TO INTRO' : 'PREV PHASE'}</span>
                    <span className="sm:hidden">BACK</span>
                  </button>

                  <div className="text-[10px] font-pixel text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_#000] truncate text-center">
                    PHASE {currentClusterIndex + 1}/{questionClusters.length} • {answeredCount}/{clusterQuestions.length} DONE
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      // Set default for scale questions if not touched yet
                      clusterQuestions.forEach((q) => {
                        if (q.type === 'scale' && !answers[q.id]) {
                          setAnswers((prev) => ({
                            ...prev,
                            [q.id]: q.scaleOptions[q.defaultValueIndex || 0],
                          }));
                        }
                      });
                      handleNextCluster();
                    }}
                    className="px-4 py-2 bg-black text-[#95d9c0] font-pixel text-xs rounded-lg border-2 border-black shadow-[3px_3px_0px_#95d9c0] hover:bg-zinc-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>
                      {currentClusterIndex === questionClusters.length - 1
                        ? 'PROCEED TO WAITLIST'
                        : 'NEXT PHASE'}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. RETRO WAITLIST SCREEN */}
            {hasStarted && isWaitlistStage && (
              <motion.div
                key="retro-waitlist"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white border-2 sm:border-3 border-black rounded-2xl p-5 sm:p-7 shadow-[5px_5px_0px_#000] text-center"
              >
                {isSubmitted ? (
                  <div>
                    <div className="h-14 w-14 mx-auto mb-3 bg-[#95d9c0] border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#000]">
                      <CheckCircle2 className="h-7 w-7 text-black" />
                    </div>
                    <span className="font-pixel text-[10px] bg-black text-[#95d9c0] px-2.5 py-0.5 rounded border border-black">
                      STATUS: PRIORITY ACCESS GRANTED
                    </span>
                    <h2 className="font-pixel text-lg sm:text-xl text-black mt-3 mb-1">
                      WELCOME TO THE FOUNDING COHORT!
                    </h2>
                    <p className="font-sans text-xs text-zinc-600 mb-4 max-w-md mx-auto">
                      Thank you, <strong className="text-black">{leadInfo.name}</strong>. Your feedback is being synthesized into Cognibloom’s core teaching loop. Check <strong className="text-black">{leadInfo.email}</strong> for beta keys!
                    </p>
                    <div className="p-2.5 bg-zinc-100 border-2 border-black rounded-lg text-left text-[11px] font-retro max-w-xs mx-auto">
                      <div>// PASSPORT_ID: #CB-{Math.floor(1000 + Math.random() * 9000)}</div>
                      <div>// TIER: EARLY_FOUNDING_LEARNER</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#fed766] border border-black rounded-md font-pixel text-[11px] text-black mb-2">
                      <Zap className="h-3 w-3" /> DIAGNOSTIC COMPLETE!
                    </div>

                    <h2 className="font-pixel text-base sm:text-xl text-black mb-1">
                      WE’RE BUILDING SOMETHING BIG.
                    </h2>
                    <p className="font-sans text-xs text-zinc-600 mb-4 max-w-md mx-auto">
                      Want early access before the public launch? Enter your coordinates below to join the private beta.
                    </p>

                    <form onSubmit={handleWaitlistSubmit} className="space-y-2.5 text-left max-w-sm mx-auto">
                      <div>
                        <label className="block text-[10px] font-pixel text-black mb-0.5">
                          YOUR NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={leadInfo.name}
                          onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                          placeholder="Diwakar Chaurasia"
                          className="w-full p-2 rounded-md border-2 border-black bg-zinc-50 text-xs font-sans focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#95d9c0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-pixel text-black mb-0.5">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          value={leadInfo.email}
                          onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                          placeholder="diwakar@example.com"
                          className="w-full p-2 rounded-md border-2 border-black bg-zinc-50 text-xs font-sans focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#95d9c0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-pixel text-black mb-0.5">
                          WHATSAPP (OPTIONAL)
                        </label>
                        <input
                          type="tel"
                          value={leadInfo.phone}
                          onChange={(e) => setLeadInfo({ ...leadInfo, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full p-2 rounded-md border-2 border-black bg-zinc-50 text-xs font-sans focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#95d9c0]"
                        />
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleBackCluster}
                          className="px-4 py-2.5 bg-white text-black font-pixel text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          <span>BACK</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 py-2.5 bg-black text-[#95d9c0] font-pixel text-xs rounded-lg border-2 border-black shadow-[3px_3px_0px_#95d9c0] hover:bg-zinc-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isSubmitting ? (
                            <span>TRANSMITTING DATA...</span>
                          ) : (
                            <>
                              <span>CLAIM EARLY BETA ACCESS</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Retro Footer */}
      <footer className="relative z-20 border-t-2 border-black bg-white px-4 py-2 text-center text-[11px] font-sans text-zinc-600">
        <p>© 2026 Spiral Infra • Cognibloom. The AI That Teaches, Not Just Answers.</p>
      </footer>
    </div>
  );
}
