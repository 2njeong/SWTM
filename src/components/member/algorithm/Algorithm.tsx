'use client';

import { useState } from 'react';
import { useFetchThatUsersAlgorithm } from '@/query/useQueries/useMemberQuery';
import MakeNewAlgorithm from './MakeNewAlgorithm';
import AlgorithmList from './AlgorithmList';
import { MdOutlineCancel } from 'react-icons/md';
import { useQueryClient } from '@tanstack/react-query';
import { Tables } from '@/type/database';
import { CURRENT_USER_QUERY_KEY, THAT_USER_QUERY_KEY } from '@/query/auth/authQueryKeys';
import { useInView } from 'react-intersection-observer';

const Algorithm = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { user_id: currentUserID } = queryClient.getQueryData<Tables<'users'>>([CURRENT_USER_QUERY_KEY]) ?? {};
  const [data] = queryClient.getQueryData<Tables<'users'>[]>([THAT_USER_QUERY_KEY, id]) ?? [];
  const [writeNewPost, setWriteNewPost] = useState(false);
  const { algorithmData, algorithmIsLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFetchThatUsersAlgorithm(data.user_id);

  const handleNewPost = () => {
    setWriteNewPost((prev) => !prev);
  };

  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (!inView || !hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    }
  });

  if (algorithmIsLoading)
    return <div className="w-full h-full flex justify-center items-center">알고리즘 로딩중..</div>;

  return (
    <div className="w-full h-full max-h-[90%] flex flex-col border-4 border-red-100 rounded-md mt-3">
      <div className="w-full flex justify-end p-2">
        {data.user_id === currentUserID && (
          <button
            className={`${
              !writeNewPost &&
              'border-2 border-red-400 hover:border-white hover:bg-red-200 hover:text-white rounded px-1 py-0.5'
            } flex items-center`}
            onClick={handleNewPost}
          >
            {writeNewPost ? <MdOutlineCancel className="text-2xl" /> : 'new 알고리즘'}
          </button>
        )}
      </div>
      <div className="h-full overflow-y-auto px-2 py-4">
        {data.user_id === currentUserID ? (
          writeNewPost ? (
            <MakeNewAlgorithm userData={data} />
          ) : (
            <AlgorithmList algorithmData={algorithmData} />
          )
        ) : (
          <AlgorithmList algorithmData={algorithmData} />
        )}
        {!writeNewPost && hasNextPage && (
          <div ref={ref} className="w-full h-20 flex justify-center items-center">
            {isFetchingNextPage && <p>로딩중...</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Algorithm;
