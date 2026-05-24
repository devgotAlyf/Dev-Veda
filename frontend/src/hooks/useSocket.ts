import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { getResult } from '../lib/api';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function useSocket(assignmentId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const setJobStatus = useAssignmentStore((state) => state.setJobStatus);
  const setGeneratedPaper = useAssignmentStore((state) => state.setGeneratedPaper);
  const router = useRouter();

  useEffect(() => {
    if (!assignmentId) return;

    const socket: Socket = io(SOCKET_URL);

    socket.on('connect', async () => {
      setIsConnected(true);
      socket.emit('join', assignmentId);
      
      // Fetch initial status to prevent race conditions where the job fails before socket connects
      try {
        const response = await api.get(`/assignments/${assignmentId}`);
        const assignment = response.data.assignment;
        if (assignment.status === 'failed') {
          setJobStatus('failed', 0, assignment.errorMessage || 'AI generation failed.');
        } else if (assignment.status === 'completed') {
          setJobStatus('completed', 100, 'Done!');
          try {
            const result = await getResult(assignmentId);
            setGeneratedPaper(result);
            router.push(`/result/${assignmentId}`);
          } catch (error) {
            setJobStatus('failed', 0, 'Failed to fetch generated paper');
          }
        }
      } catch (err) {
        // Ignore fetch errors
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('job:processing', (data: { assignmentId: string; progress: number; message?: string }) => {
      setJobStatus('processing', data.progress, data.message);
    });

    socket.on('job:completed', async (data: { assignmentId: string; resultId: string; progress: number }) => {
      setJobStatus('completed', 100, 'Done!');
      try {
        const result = await getResult(data.assignmentId);
        setGeneratedPaper(result);
        router.push(`/result/${data.assignmentId}`);
      } catch (error) {
        setJobStatus('failed', 0, 'Failed to fetch generated paper');
      }
    });

    socket.on('job:failed', (data: { assignmentId: string; error: string }) => {
      setJobStatus('failed', 0, data.error);
    });

    return () => {
      socket.emit('leave', assignmentId);
      socket.disconnect();
    };
  }, [assignmentId, setJobStatus, setGeneratedPaper, router]);

  return { isConnected };
}
