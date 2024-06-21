import Link from "next/link";
import TodoComponent from "./todoComponent";
import CreateTodo from "./create-todo";
import { type Todo } from "@prisma/client";

export default function TodosServer({ data }: { data: Todo[] }) {
  return (
    <>
      <h1 className="text-primary">SERVER SIDE RENDERING</h1>
      <Link href={"/client"}>
        <h1>Click here to switch to client render</h1>
      </Link>
      <div className="my-4 flex h-screen flex-col gap-2">
        {data.map((todo) => (
          <TodoComponent key={todo.id} todo={todo} />
        ))}
      </div>
      <CreateTodo />
    </>
  );
}
