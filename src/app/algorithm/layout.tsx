import ShortBanner from '@/components/utilComponents/ShortBanner';
import { PropsWithChildren } from 'react';

const AlgorithmLayout = ({ children }: PropsWithChildren) => {
  const shortBannerProps = {
    h1Text: '알고리즘을 풀어서 트리에 장식을 달아주세요',
    pText: ['알고리즘 트리에 최대 10개, 최근 3일 간의 알고리즘 풀이장식이 걸립니다.', '장식의 주인공이 되어보세요!']
  };

  return (
    <div className="w-full h-[calc(100vh-5rem)]">
      <ShortBanner shortBannerProps={shortBannerProps} />
      <div className="w-full h-full mx-auto flex flex-col">
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
};
export default AlgorithmLayout;
