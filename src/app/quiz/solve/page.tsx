import HotQuizList from '@/components/quiz/HotQuizList';
import QuizList from '@/components/quiz/QuizList';
import { Suspense } from 'react';

const QuizPage = async () => {
  return (
    <div className="h-screen flex flex-col items-center p-6 ">
      <div className="w-full">
        <section className="bg-beiOne">
          <h1 className="text-3xl font-bold">Hot Quiz</h1>
          <div className="w-full">
            <Suspense>
              <HotQuizList />
            </Suspense>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Quiz List</h1>
          <QuizList />
        </section>
      </div>
    </div>
  );
};

export default QuizPage;