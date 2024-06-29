'use client';

import ReturnQuizType from './ReturnQuizType';
import { useAtom } from 'jotai';
import { submitQuizAction } from '@/app/quiz/makequiz/action';
import { useRef } from 'react';
import { answerAtom, editorContentAtom, inputAtom, quizTyper } from '@/atom/quizAtom';
import SubmitBtn from './SubmitBtn';
import Question from './Question';
import { useQueryClient } from '@tanstack/react-query';
import { QUIZLIST_QUERY_KEY } from '@/query/quiz/quizQueryKeys';
import { useFetchCurrentUser } from '@/query/useQueries/useAuthQuery';

const MakeQuiz = () => {
  const { userData } = useFetchCurrentUser();
  const [inputArr, setInputArr] = useAtom(inputAtom);
  const [contentData, setContentData] = useAtom(editorContentAtom);
  const [answer, setAnswer] = useAtom(answerAtom);
  const [quizType] = useAtom(quizTyper);
  const formRef = useRef<HTMLFormElement>(null);
  const quueryClient = useQueryClient();

  const submitQuiz = async (data: FormData) => {
    const question = data.get('question');
    if (!question) {
      alert('질문을 입력해주세요.');
      return;
    }
    if (!answer || answer.join() === '<p><br></p>' || !answer.length) {
      alert(`정답을 알려주세요. 도움이 필요한 질문이라도 예상하는 답변을 남겨주세요!`);
      return;
    }
    if (quizType === '객관식') {
      if (inputArr.length < 2) {
        alert('객관식 문항은 최소 2개 이상이어야 합니다.');
        return;
      }
    } else {
      if (!contentData) {
        alert('문제의 내용을 알려주세요!');
      }
    }
    const submitActionWithAnswer = submitQuizAction.bind(null, answer, contentData, userData?.user_id ?? '');
    await submitActionWithAnswer(data);
    quueryClient.invalidateQueries({ queryKey: [QUIZLIST_QUERY_KEY] });
    formRef.current?.reset();
    setInputArr([1]);
    setAnswer(null);
    setContentData(null);
  };

  return (
    <>
      <form action={submitQuiz} ref={formRef} className="w-4/6 flex flex-col gap-6">
        <Question />
        <ReturnQuizType />
        <SubmitBtn />
      </form>
    </>
  );
};

export default MakeQuiz;
