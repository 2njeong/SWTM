import { updateTodolistServerAction } from '@/app/member/action';
import SubmitBtn from '@/components/makequiz/SubmitBtn';
import { CURRENT_USER_QUERY_KEY, THAT_USER_QUERY_KEY } from '@/query/auth/authQueryKeys';
import { TODOLIST_QUERY_KEY } from '@/query/member/memberQueryKey';
import { useFetchTodolist } from '@/query/useQueries/useMemberQuery';
import { Tables } from '@/type/database';
import { SevenDaysTodolist } from '@/type/memberType';
import { getToday } from '@/utils/utilFns';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { MdCancel } from 'react-icons/md';

const Todos = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { user_id } = queryClient.getQueryData<Tables<'users'>>([CURRENT_USER_QUERY_KEY]) ?? {};
  const [{ user_id: thatUserID }] = queryClient.getQueryData<Tables<'users'>[]>([THAT_USER_QUERY_KEY, id]) ?? [];
  const sevenDaysTodolist = queryClient.getQueryData<SevenDaysTodolist[]>([TODOLIST_QUERY_KEY, thatUserID]);
  const todos = sevenDaysTodolist?.find((todolist) => todolist.day === getToday())?.todos ?? [];
  const [todolist, setTodolist] = useState(todos);

  useEffect(() => {
    setTodolist(todos);
  }, [todos]);

  const handleTodolist = ({ e, todo_id }: { e?: ChangeEvent<HTMLInputElement>; todo_id: string }) => {
    if (user_id !== thatUserID) return;
    setTodolist(
      todolist.map((todo) =>
        todo.todo_id === todo_id ? (e ? { ...todo, done: e.target.checked } : { ...todo, isDeleted: true }) : todo
      )
    );
  };

  const updateTodolist = async (data: FormData) => {
    if (todolist.every((todo, i) => todo.done === todos[i].done && todo.isDeleted === todos[i].isDeleted)) {
      alert('변경사항이 없습니다.');
      return;
    }
    const todoObj = {
      todolist
    };
    await updateTodolistServerAction(todoObj, data);
    queryClient.invalidateQueries({ queryKey: [TODOLIST_QUERY_KEY, thatUserID] });
  };

  console.log('disabledCondition =>', user_id !== thatUserID);

  const btnProps = {
    formId: 'todosForm',
    sectionClasName: 'border w-full flex justify-end sticky top-0 shrink-0 backdrop-blur-lg',
    buttonClassName: 'w-20 border rounded px-1 py-0.5 flex items-center justify-center',
    pendingText: <HiEllipsisHorizontal />,
    doneText: '업데이트'
  };

  return (
    <form
      id="todosForm"
      action={updateTodolist}
      className="border rounded-md w-[70%] h-full overflow-y-auto pt-1 pb-2 px-4 flex flex-col gap-1"
      style={{ paddingTop: user_id !== thatUserID ? '1.5rem' : '' }}
    >
      {user_id === thatUserID && <SubmitBtn btnProps={btnProps} />}
      {todolist.map(
        (todo) =>
          !todo.isDeleted && (
            <div key={todo.todo_id} className="w-full flex items-center justify-between px-2">
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="check"
                  checked={todo.done}
                  disabled={user_id !== thatUserID}
                  onChange={(e) => handleTodolist({ e, todo_id: todo.todo_id })}
                ></input>
                <h4>{todo.todo_item}</h4>
              </div>
              <MdCancel
                className="cursor-pointer text-gray-400 hover:text-gray-300"
                onClick={() => handleTodolist({ todo_id: todo.todo_id })}
              />
            </div>
          )
      )}
    </form>
  );
};

export default Todos;