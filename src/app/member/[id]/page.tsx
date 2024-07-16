'use client';

import { categoryAtom } from '@/atom/memberAtom';
import Algorithm from '@/components/member/algorithm/Algorithm';
import GuestBook from '@/components/member/guestbook/GuestBook';
import UserInfo from '@/components/member/information/UserInfo';
import QuizListOfThatUser from '@/components/member/quiz/QuizListOfThatUser';
import { useFetchCurrentUser, useFetchThatUser } from '@/query/useQueries/useAuthQuery';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';

const AlgorithmWrapper = dynamic(() => import('@/components/member/algorithm/Algorithm'), { ssr: false });

const MemberPage = ({ params: { id } }: { params: { id: string } }) => {
  const { isThatUserLoading, thatUserData } = useFetchThatUser(id);
  const { isLoading, userData } = useFetchCurrentUser();
  const [theCategory, setTheCategory] = useAtom(categoryAtom);

  const categories = ['질문', '알고리즘', '방명록'];

  const handleCategory = (category: string) => {
    setTheCategory(category);
  };

  if (isThatUserLoading || isLoading) return <></>;
  return (
    <>
      <div className="border border-2 rounded w-full min-h-[550px] h-full max-h-[90%] flex justify-between relative">
        <section className="w-2/6 flex flex-col justify-around items-center justify-center px-4 py-2">
          <UserInfo thatUserData={thatUserData} currentUser={userData} />
        </section>

        <section className="border-l-2 w-4/6 flex flex-col justify-around">
          <div className="w-full h-full overflow-y-auto p-2 flex flex-col gap-2">
            <div>{theCategory}</div>
            {theCategory === '질문' ? (
              <QuizListOfThatUser id={id} />
            ) : theCategory === '알고리즘' ? (
              <AlgorithmWrapper id={id} />
            ) : theCategory === '방명록' ? (
              <GuestBook id={id} />
            ) : (
              <></>
            )}
          </div>
        </section>

        <div className="flex flex-col absolute top-0 right-0 transform translate-x-full">
          {categories.map((category) => (
            <button
              key={category}
              className={`border rounded px-1 py-0.5 ${category === theCategory && 'bg-gray-200'}`}
              onClick={() => handleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberPage;
