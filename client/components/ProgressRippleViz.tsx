
// client/components/ProgressRippleViz.tsx

import React, { useState, useEffect } from 'react';

// Basic type definition for a cross-project relation, mirroring the backend.
interface CrossProjectRelation {
  type: string;
  skill?: string;
  tasks: { content: string; title?: string }[];
  progressGain: number;
}

interface ProgressRippleVizProps {
  relations: CrossProjectRelation[];
  // The initial user input that triggered this visualization.
  sourceTask: string; 
}

/**
 * A component to visualize the ripple effect of a single task across multiple projects.
 */
export const ProgressRippleViz: React.FC<ProgressRippleVizProps> = ({ relations, sourceTask }) => {
  const [visibleRipples, setVisibleRipples] = useState<number[]>([]);

  // Animate the ripples appearing one by one.
  useEffect(() => {
    if (!relations || relations.length === 0) return;

    const timer = setTimeout(() => {
      // Reset visibility when new relations come in.
      setVisibleRipples([0]);
    }, 100); // Start the animation shortly after the component mounts.

    return () => clearTimeout(timer);
  }, [relations]);

  useEffect(() => {
    if (visibleRipples.length === 0 || visibleRipples.length >= relations.length) return;

    const timer = setTimeout(() => {
      setVisibleRipples(prev => [...prev, prev.length]);
    }, 700); // Stagger the appearance of each ripple.

    return () => clearTimeout(timer);
  }, [visibleRipples, relations.length]);


  if (!relations || relations.length === 0) {
    return null; // Don't render anything if there are no ripples to show.
  }

  // Helper to get a displayable name for a task.
  const getTaskName = (task: { content: string; title?: string }) => task.title || task.content;

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-teal-500/30 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-teal-300 mb-4 text-center">Neurodivergent Superpower: Activated!</h2>
      <p className="text-center text-gray-300 mb-6">Your input for "<span className='text-white font-semibold'>{sourceTask}</span>" created a wave of progress:</p>
      
      <div className="space-y-4">
        {/* Source Task as the epicenter of the ripple */}
        <div className="flex items-center justify-center p-3 bg-gray-900 rounded-lg animate-pulse-slow">
            <span className="text-lg font-semibold text-white">🌟 {getTaskName(relations[0].tasks[0])}</span>
        </div>

        {/* Ripples of progress */}
        {relations.map((relation, index) => {
          if (!visibleRipples.includes(index)) return null; // Controlled visibility for animation
          const relatedTask = relation.tasks.length > 1 ? relation.tasks[1] : relation.tasks[0];

          return (
            <div key={index} className="flex flex-col items-center animate-fade-in-up">
                <div className="text-teal-400 text-2xl">↓</div>
                <div className="w-full p-4 bg-gray-700/50 rounded-lg shadow-md border border-gray-600/50 text-center">
                    <p className="font-semibold text-white">+ {relation.progressGain}% Progress on: <span className='text-teal-300'>{getTaskName(relatedTask)}</span></p>
                    <p className="text-sm text-gray-400 mt-1">Reason: Shared skill in <span className='font-medium text-gray-300'>{relation.skill}</span></p>
                </div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-teal-500 mt-6">This is context-switching as a strength, not a weakness.</p>
    </div>
  );
};

