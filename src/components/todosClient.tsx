import Link from "next/link";
import TodoComponent from "./todoComponent";
import CreateTodo from "./create-todo";
import { api } from "@/utils/api";

export default function TodosClient() {
  const { data: todos, isLoading, isError } = api.todo.findAll.useQuery();

  // example of query states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!todos) return <div>No todos</div>;

  return (
    <>
      <h1 className="text-primary">CLIENT SIDE RENDERING</h1>
      <Link href={"/server"}>
        <h1>Click here to switch to server render</h1>
      </Link>
      <div className="my-4 flex h-screen flex-col gap-2">
        {todos.map((todo) => (
          <TodoComponent key={todo.id} todo={todo} />
        ))}
      </div>
      <CreateTodo />
    </>
  );
}
