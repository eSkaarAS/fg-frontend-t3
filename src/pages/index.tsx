import Head from "next/head";

import { api } from "@/utils/api";
import Todo from "@/components/todo";
import CreateTodo from "@/components/create-todo";

export default function Home() {
  const { data } = api.todo.findAll.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-green-200">
        {data?.map((todo) => <Todo key={todo.id} todo={todo} />)}
        <CreateTodo />
      </main>
    </>
  );
}
