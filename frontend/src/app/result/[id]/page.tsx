'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getResult } from '../../../lib/api';
import { useSocket } from '../../../hooks/useSocket';
import { GeneratedPaper } from '../../../types';
import { ExamPaper } from '../../../components/paper/ExamPaper';
import { ActionBar } from '../../../components/paper/ActionBar';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { useAssignmentStore } from '../../../store/useAssignmentStore';
import { GeneratingOverlay } from '../../../components/form/GeneratingOverlay';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { jobStatus } = useAssignmentStore();
  
  // Use socket to listen for regeneration events
  useSocket(id);

  useEffect(() => {
    if (!id) return;
    
    // Only fetch if not currently regenerating
    if (jobStatus !== 'pending' && jobStatus !== 'processing') {
      fetchResult();
    }
  }, [id, jobStatus]);

  const fetchResult = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await getResult(id);
      setPaper(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load the generated paper.');
    } finally {
      setIsLoading(false);
    }
  };

  if (jobStatus === 'pending' || jobStatus === 'processing') {
    return <GeneratingOverlay />;
  }

  if (isLoading) {
    return (
      <div className="max-w-[850px] mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-ink/5">
        <div className="flex justify-center mb-8"><Skeleton variant="rect" className="h-10 w-64" /></div>
        <div className="flex justify-between mb-8">
          <Skeleton variant="line" className="w-24" />
          <Skeleton variant="line" className="w-24" />
          <Skeleton variant="line" className="w-24" />
        </div>
        <Skeleton variant="rect" className="h-[2px] w-full mb-8" />
        <div className="space-y-4 mb-10">
          <Skeleton variant="line" className="w-3/4" />
          <Skeleton variant="line" className="w-5/6" />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton variant="line" className="w-48 mb-4 h-5" />
              <div className="pl-4 space-y-3">
                <Skeleton variant="line" className="w-full" />
                <Skeleton variant="line" className="w-full" />
                <Skeleton variant="line" className="w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (errorMsg || !paper) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-rose/5 text-rose p-4 rounded-full mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="font-serif font-bold text-2xl text-navy mb-2 text-center">Paper Generation Failed</h2>
        <p className="text-muted text-center max-w-md mb-8">{errorMsg || 'Could not find the requested paper.'}</p>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => router.push('/create')}>Create New</Button>
          <Button onClick={fetchResult}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 sm:px-6 lg:px-8">
      <ActionBar paper={paper} assignmentId={id} />
      <ExamPaper paper={paper} />
    </div>
  );
}
