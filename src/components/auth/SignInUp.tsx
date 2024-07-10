'use client';

import { authSelectAtom } from '@/atom/authAtom';
import { useAtom } from 'jotai';

const SignInOrUp = () => {
  const [authType, setAuthType] = useAtom(authSelectAtom);

  return (
    <div>
      <h2>{authType === 'signIn' ? '로그인' : '회원가입'}</h2>
      <button className="border" onClick={() => setAuthType((prev) => (prev === 'signIn' ? 'signUp' : 'signIn'))}>
        {authType === 'signIn' ? '회원가입' : '로그인'}
      </button>
    </div>
  );
};

export default SignInOrUp;
