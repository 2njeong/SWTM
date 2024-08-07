'use server';

import { algorithmSchema, guestbookSchema, userInfoSchema } from '@/schema/memberSchema';
import { todoSchema } from '@/schema/todolistSchema';
import { serverSupabase } from '@/supabase/server';
import { Tables } from '@/type/database';
import { GuestBookObj, UserInfoOBJ } from '@/type/memberType';

const supabase = serverSupabase();

type SubmitAlgorithmObj = {
  creator: string;
  explanation: string | null;
  newLearn: string | null;
};

export const submitAlgorithm = async (submitAlgorithmObj: SubmitAlgorithmObj, data: FormData) => {
  const level = data.get('level');
  const title = data.get('title');
  const link = data.get('link');
  // const newLearn = data.get('newLearn');
  const { explanation, newLearn } = submitAlgorithmObj;
  const algorithmObj = { ...submitAlgorithmObj, level, title, link, newLearn };

  const result = algorithmSchema.safeParse({ level, title, link, explanation, newLearn });
  if (!result.success) {
    const errors = result.error.errors;
    return errors[0];
  }

  try {
    const { error } = await supabase.from('algorithm').insert(algorithmObj);
    if (error) throw new Error(error.message);
  } catch (e) {
    throw new Error(`fail to add new algorithm, ${e}`);
  }
};

const makeAvatarUrl = async (avatarFile: FormDataEntryValue, user_id: string | undefined) => {
  const uuid = crypto.randomUUID();
  const imgUrlPath = `avatar/${user_id}/${uuid}`;
  if (avatarFile instanceof File) {
    const { data: avatarUrlData, error } = await supabase.storage.from('avatar').upload(imgUrlPath, avatarFile, {
      cacheControl: '3600',
      upsert: true,
      contentType: avatarFile.type
    });
    if (error) {
      throw new Error(`fail to upload user avatar to storage, ${error.message}`);
    } else {
      const { data: avatarUrl } = await supabase.storage.from('avatar').getPublicUrl(avatarUrlData.path as string);
      return avatarUrl.publicUrl;
    }
  } else {
    return null;
  }
};

export const updateUserInfo = async (userInfoObj: UserInfoOBJ, data: FormData) => {
  const avatarFile = data.get('avatar');
  const { user_id, avatar, ...rest } = userInfoObj;
  const avatarUrl =
    avatarFile instanceof File && avatarFile.size > 0 ? await makeAvatarUrl(avatarFile, user_id) : avatar;
  const userObj = rest;
  const result = userInfoSchema.safeParse(userObj);
  if (!result.success) {
    const errors = result.error.errors;
    return errors[0];
  }

  const { error } = await supabase
    .from('users')
    .update({ avatar: avatarUrl, ...userObj })
    .eq('user_id', user_id);
  if (error) {
    return (
      error.message === 'duplicate key value violates unique constraint "users_nickname_key"' &&
      '이미 존재하는 닉네임 입니다.'
    );
  }
};

export const submitGuestBook = async (guestBookObj: GuestBookObj, data: FormData) => {
  const content = data.get('content');
  const result = guestbookSchema.safeParse({ content });
  if (!result.success) {
    const errors = result.error.errors;
    return errors[0];
  }
  const newGuestBookOnj = { ...guestBookObj, content };
  try {
    const { error } = await supabase.from('guestbook').insert(newGuestBookOnj);
    if (error) throw new Error(error.message);
  } catch (e) {
    throw new Error(`fail to insert guestbook, ${e}`);
  }
};

export const submitTodolist = async (user_id: string | undefined, data: FormData) => {
  const todo_item = data.get('todo_item');
  const result = todoSchema.safeParse({ todo_item });
  if (!result.success) {
    const errors = result.error.errors;
    return errors[0];
  }
  const todoObj = {
    user_id,
    todo_item,
    done: false,
    isDeleted: false,
    created_at: new Date().toISOString()
  };
  try {
    const { error } = await supabase.from('todolist').insert(todoObj);
    if (error) throw new Error(error.message);
  } catch (e) {
    throw new Error(`fail to insert todo, ${e}`);
  }
};

export const updateTodolistServerAction = async ({ todolist }: { todolist: Tables<'todolist'>[] }, data: FormData) => {
  try {
    const { error } = await supabase.rpc('update_todolist', { todos: todolist });
    if (error) throw new Error(error.message);
  } catch (e) {
    throw new Error(`fail to update todo, ${e}`);
  }
};
