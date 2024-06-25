'use client';

import { handleSignIn, handleSignUp } from '@/app/auth/action';
import { authSelectAtom } from '@/atom/authAtom';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { AuthField, AuthResult, AuthValiationErr } from '@/type/authType';
import { useFormState } from 'react-dom';
import AuthFormBtn from './AuthFormBtn';

const AuthForm = () => {
  const [authType] = useAtom(authSelectAtom);
  const [validationErr, setValidationErr] = useState<AuthValiationErr | null>(null);
  const authFormRef = useRef<HTMLFormElement | null>(null);
  const authArr: AuthField[] = ['email', 'nickname', 'password'];

  const submitAuthForm = async (state: any, data: FormData) => {
    const result: AuthResult = authType === 'signIn' ? await handleSignIn(data) : await handleSignUp(data);
    authFormRef.current?.reset();
    if (result.error) {
      setValidationErr(result.error);
      return;
    }
    alert(result.message);
    setValidationErr(null);
  };
  const [_, formAction] = useFormState(submitAuthForm, null);

  return (
    <form className="flex flex-col gap-4" action={formAction} ref={authFormRef}>
      {authArr.map((item) => {
        if (authType === 'signIn' && item === 'nickname') return;
        return (
          <div key={item}>
            <h3>{item[0].toUpperCase() + item.slice(1)}</h3>
            <input name={item} type={item === 'password' ? 'password' : 'text'} />
            {validationErr && <p className="text-sm">{validationErr[item]?._errors[0]}</p>}
          </div>
        );
      })}
      <AuthFormBtn />
    </form>
  );
};

export default AuthForm;