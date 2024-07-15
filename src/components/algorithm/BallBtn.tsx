import { ZINDEX } from '@/constants/commonConstants';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import AvatarImage from '../member/information/AvatarImage';
import { Tables } from '@/type/database';

type BallBtnProps = {
  balls: Pick<Tables<'algorithm'>, 'algorithm_id' | 'title' | 'creator' | 'creator_avatar' | 'creator_nickname'>[];
  index: number;
  userOpenArr: boolean[] | null;
  setUserOpenArr: Dispatch<SetStateAction<boolean[] | null>>;
};

const BallBtn = ({ balls, index, userOpenArr, setUserOpenArr }: BallBtnProps) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleUserOpenOff = (event: any) => {
      if (btnRef) {
        if (btnRef.current && !btnRef.current.contains(event.target)) {
          const openIdx = userOpenArr?.findIndex((item) => item);
          openIdx &&
            setUserOpenArr((prev) => {
              if (prev === null) return null;
              prev[openIdx] = false;
              return [...prev];
            });
        }
      }
    };
    document.addEventListener('click', handleUserOpenOff);
    return () => {
      document.removeEventListener('click', handleUserOpenOff);
    };
  }, [setUserOpenArr, userOpenArr]);

  const goToStudyZone = (creator: string) => {
    const features =
      'width=1400,height=800,resizable=yes,scrollbars=no,status=yes,toolbar=no,menubar=no,location=yes, noopener, noreferrer';
    window.open(`/member/${creator}`, '_blank', features);
  };

  return (
    <div
      className={`flex flex-col gap-2 border rounded absolute bg-gray-200 opacity-90 w-44 max-sm:28 h-30 -translate-y-2/3 translate-x-1/2 py-2 px-1 drop-shadow-2xl`}
      style={{ zIndex: ZINDEX.ballZ }}
    >
      <div className="flex w-full items-center justify-center gap-1">
        <AvatarImage src={balls[index].creator_avatar} alt="algorithm creator avatar" size="2.5" />
        <p className="w-3/6">{balls && balls[index].creator_nickname}</p>
      </div>
      <div className="w-full">
        <p className="truncate text-xs">Q. {balls[index].title}</p>
      </div>
      <button
        ref={btnRef}
        onClick={() => goToStudyZone(balls[index].creator)}
        className="flex items-center justify-center w-full border-[2.5px] border-white rounded text-sm hover:bg-gray-300 p-0.5"
      >
        스터디 존 구경하기
      </button>
    </div>
  );
};

export default BallBtn;