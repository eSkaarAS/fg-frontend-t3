import CreateTodo from "@/components/create-todo";
import { ThemeToggle } from "@/components/theme-toggle";
import TodosClient from "@/components/todosClient";
import Head from "next/head";
export default function Page() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative w-full bg-background p-10">
        <TodosClient />
        <CreateTodo />
        <div className="fixed right-4 top-4">
          <ThemeToggle />
        </div>
      </main>
    </>
  );
}
