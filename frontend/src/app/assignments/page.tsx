'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAssignments } from '../../lib/api';
import { FileText, Loader2, ArrowRight } from 'lucide-react';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] p-page pb-20">
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="font-serif font-black text-3xl md:text-4xl text-navy mb-3 tracking-tight">
          My Assignments
        </h1>
        <p className="font-sans text-muted text-lg max-w-2xl leading-relaxed">
          View and manage all your previously generated assessment papers.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-amber" size={48} />
        </div>
      ) : assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-sm border border-ink/5">
          <div className="w-20 h-20 bg-navy-700/5 rounded-full flex items-center justify-center mb-6 text-navy-700/20">
            <FileText size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif font-bold text-xl text-navy mb-2">No assignments yet</h3>
          <p className="text-muted mb-6">Create your first AI-generated assessment paper.</p>
          <Link href="/create" className="px-6 py-3 bg-amber text-white font-medium rounded-lg shadow-md hover:bg-amber-600 transition-colors">
            Create Assessment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment, i) => (
            <div 
              key={assignment.id} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  assignment.status === 'completed' ? 'bg-sage/10 text-sage' : 
                  assignment.status === 'failed' ? 'bg-rose/10 text-rose' : 
                  'bg-amber/10 text-amber'
                }`}>
                  {assignment.status}
                </span>
                <span className="text-xs text-muted font-medium">
                  {new Date(assignment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-navy mb-1 truncate">{assignment.title}</h3>
              <p className="text-muted text-sm mb-4">{assignment.subject} • {assignment.gradeLevel}</p>
              
              <div className="flex justify-between text-sm text-navy-700 mb-6">
                <span>{assignment.numberOfQuestions} Questions</span>
                <span className="font-bold">{assignment.totalMarks} Marks</span>
              </div>

              {assignment.status === 'completed' ? (
                <Link href={`/result/${assignment.id}`} className="flex items-center justify-center w-full py-2.5 bg-navy-800 text-cream rounded-lg hover:bg-navy transition-colors font-medium text-sm group">
                  View Paper <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button disabled className="w-full py-2.5 bg-ink/5 text-muted rounded-lg font-medium text-sm cursor-not-allowed">
                  {assignment.status === 'failed' ? 'Generation Failed' : 'Processing...'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
