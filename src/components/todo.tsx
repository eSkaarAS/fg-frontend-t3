"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/utils/api";
import { type Todo } from "@prisma/client";

export default function Todo({ todo }: { todo: Todo }) {
  const utils = api.useUtils();
  const { mutate: toggleTodo } = api.todo.toggle.useMutation({
    onSuccess: () => {
      void utils.todo.findAll.invalidate();
    },
  });

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={todo.id}
        defaultChecked={todo.isCompleted}
        onCheckedChange={(e) => {
          if (typeof e === "boolean")
            toggleTodo({
              id: todo.id,
              completed: e,
            });
        }}
      />
      <label
        htmlFor={todo.id}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${todo.isCompleted ? "line-through opacity-50" : ""}`}
      >
        {todo.description}
      </label>
    </div>
  );
}
