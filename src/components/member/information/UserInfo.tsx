'use client';

import { Tables } from '@/type/database';
import { useState } from 'react';
import { GoGear } from 'react-icons/go';
import ShowUserData from './ShowUserData';
import UpdateUserForm from './UpdateUserForm';
import Avatar from './Avatar';
import { useAtom } from 'jotai';
import { avatarAtom } from '@/atom/memberAtom';

const UserInfo = ({
  thatUserData,
  currentUser
}: {
  thatUserData: Tables<'users'> | undefined;
  currentUser: Tables<'users'> | undefined;
}) => {
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [_, setAvatar] = useAtom(avatarAtom);
  const userDataList = ['nickname', 'Github', 'Email'];

  const handleUserFormOpen = () => {
    setAvatar(null);
    setUserFormOpen((prev) => !prev);
  };

  return (
    <>
      {currentUser?.user_id === thatUserData?.user_id && (
        <button onClick={handleUserFormOpen} className="ml-auto">
          {userFormOpen ? '수정취소' : <GoGear className="text-xl" />}
        </button>
      )}
      <Avatar userFormOpen={userFormOpen} currentUser={currentUser} />
      <div className={`h-3/6 w-full border flex py-2 px-4`}>
        {userFormOpen ? (
          <>
            <UpdateUserForm currentUser={currentUser} userDataList={userDataList} setUserFormOpen={setUserFormOpen} />
          </>
        ) : (
          <ShowUserData
            userDataList={userDataList}
            userData={thatUserData?.user_id === currentUser?.user_id ? currentUser : thatUserData}
          />
        )}
      </div>
    </>
  );
};

export default UserInfo;