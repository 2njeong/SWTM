'use client';

import { Tables } from '@/type/database';
import QuizCommentForm from './QuizCommentForm';
import { useRef } from 'react';
import QuizCommetsList from './QuizCommetsList';

const QuizComments = ({ theQuiz }: { theQuiz: Tables<'quiz'> | undefined }) => {
  const commentFormRef = useRef<HTMLFormElement | null>(null);

  return (
    <div className="w-full flex flex-col items-center p-2 gap-2">
      <h1 className="w-full text-left">Comments</h1>
      <QuizCommentForm theQuiz={theQuiz} commentFormRef={commentFormRef} />
      <QuizCommetsList theQuiz={theQuiz} />
    </div>
  );
};

export default QuizComments;
