import React, { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { GeneratedPaper } from '../../types';
import { regenerateResult } from '../../lib/api';
import { downloadPdf } from '../../lib/pdfExport';
import { useToast } from '../../hooks/useToast';
import { useAssignmentStore } from '../../store/useAssignmentStore';

interface ActionBarProps {
  paper: GeneratedPaper;
  assignmentId: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({ paper, assignmentId }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast, error } = useToast();
  const setJobStatus = useAssignmentStore((state) => state.setJobStatus);

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      await regenerateResult(assignmentId);
      toast('Regenerating paper...', 'info');
      setJobStatus('pending'); // This will trigger the GeneratingOverlay via parent if designed that way
    } catch (err: any) {
      error(err.message || 'Failed to regenerate paper');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const filename = `${paper.subject.replace(/\s+/g, '-')}-${paper.gradeLevel.replace(/\s+/g, '-')}-ExamPaper.pdf`;
      await downloadPdf(paper, filename);
      toast('PDF downloaded successfully!', 'success');
    } catch (err) {
      error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="sticky top-[64px] z-20 bg-cream/80 backdrop-blur-md py-4 mb-6 border-b border-ink/10 flex justify-end gap-3 print:hidden px-4 sm:px-0">
      <Button
        variant="ghost"
        onClick={handleRegenerate}
        isLoading={isRegenerating}
        className="gap-2"
      >
        <RotateCcw size={18} />
        <span className="hidden sm:inline">Regenerate</span>
      </Button>
      
      <Button
        onClick={handleDownload}
        isLoading={isDownloading}
        className="gap-2 shadow-sm"
      >
        <Download size={18} />
        <span>Download PDF</span>
      </Button>
    </div>
  );
};
