# ❎ TODO APP ✅

En kort intro til T3 og hvordan raskt lage en prototype med T3, shadcn og tailwindcss.

# 1. create t3 app

---

---

---

#### INFO --- [Create T3 app](https://create.t3.gg/) --- [Theo](https://www.youtube.com/@t3dotgg)

```
Det står en del info her og der igjennom README.md. Du kan velge å ignorere info tekstene om du vil. Det er helt greit å fullføre gjennomgangen uten å lese info tekstene.

Det er hoveddelene i T3 stacken:

- LANG:            typescript        [pålagt]
- FRAMEWORK:       next.js           [pålagt]
- ROUTER:          trpc              [valgfritt]
- STYLING:         tailwind          [valgfritt]
- DB:              prisma/drizzle    [valgfritt]
- AUTH:            next auth         [valgfritt]
```

---

---

---

<br>

```bash
npm create t3-app@latest
```

Vi skal gjøre de neste stegene, men FØRST lager vi todo schemaen.

```bash
Next steps:
  cd fg-frontend-t3
  npm run db:push
  npm run dev
  git commit -m "initial commit"
```

---

---

---

### INFO

```
Vi skal se på følgende filer:

DB
- schema.prisma

Backend
- src/server/api/routers/post.ts
- src/server/api/root.ts
- src/server/api/trpc.ts
- src/server/db.ts

Utils
- src/utils/api.ts

Frontend
- src/pages/api/trpc/[trpc].ts
- src/pages/index.tsx
- src/pages/_app.tsx

TLDR:

- Vi lager et db object som inneholder typene til databasen --- db.ts
- Vi lager en indre context for routeren og api handleren i frontenden som inneholder db objektet --- trpc.ts
- Vi lager en type av Routeren --- root.ts
- Vi exporterer et `api` objekt som er en context med Router typen som input
- Vi wrapper frontenden i denne contexten --- _app.tsx



Dette er magien til TRPC og det som gjør at denne stacken er så god.
Vi har en enkel måte å lage schemaer til databasen som blir inferet gjennom hele stacken.
```

---

---

---

# 2. create todo schema

Vi skal lage en todo app, så la oss lage en DB schema for dette.

Gå til `schema.prisma` og legg til modellen `Todo`:

```prisma
model Todo {
    id          String   @id @default(cuid())
    description String
    isCompleted Boolean  @default(false)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
}
```

Vi må oppdatere prisma schemaet og migrere databasen.

```bash
npm i
npm run db:push
```

# 3. implement todo router

---

---

---

### INFO TRPC - [trpc](https://trpc.io/docs)

```
Vi skal lage en router. legg til et nytt endepunkt ved å legge til et attribute til router objektet.

Det er et par ting man må bestemme seg for når man lager et nytt endepunkt:

- Hvilke procedure skal vi bruke?
- Hva er inputen?
- Hva er outputen?

typisk er GET calls query og POST calls mutation.
```

---

---

---

<br>

Vi skal lage en router for todos. Gå til `src/routes/todos.ts` og legg til følgende kode:

```typescript
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const todoRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          description: input.description,
        },
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: { id: input.id },
        data: {
          isCompleted: input.completed,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input.id },
      });
    }),

  findAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
```

# 4. Initialize [Shadcn/UI](https://ui.shadcn.com/docs/installation/next)

### info

---

---

---

```
Vi skal bruke shadcn sitt UI bibliotek for å lage en rask prototype.
Shadcn setter opp tailwindcss configuration for theming og tilbyr en CLI for å installere komponenter.
```

---

---

---

<br>

Vi installerer shadcn med følgende kommando:

```bash
npx shadcn-ui@latest init
```

For å innstallere en shadcn komponent, så bruker vi CLIen til shadcn:

```bash
npx shadcn-ui@latest add ___KOMPONENT_NAVN___
```

# 5. implement todo component - [shadcn/ui - checkbox - øverste komponent eksempel](https://ui.shadcn.com/docs/components/checkbox)

Lag komponenten `src/components/Todo.tsx` og legg til følgende kode:

Når man henter componenter fra shadcn, så må man installere de. Det gjør man med følgende kommando:

```bash
npx shadcn-ui@latest add checkbox
```

Koden er hentet fra [shadcn/ui - checkbox](https://ui.shadcn.com/docs/components/checkbox)

```typescript
"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  )
}
```

Vi skal ta inn todo som prop og toggle todoen i backenden når vi trykker på trykket på sjekkboksen. Endelig kode er limt inn under:

```typescript
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
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {todo.description}
      </label>
    </div>
  );
}
```

# 6. implement create todo skjema - [shadcn/ui - input - nederste komponent eksempel](https://ui.shadcn.com/docs/components/input)

Lag komponenten `src/components/CreateTodo.tsx` og legg til følgende kode:

```typescript
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

Det kommer til å være en del rødt i komponenten det er fordi vi mangler noen shadcn komponenter. Disse kan vi installere med følgende kommando:

```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
```

Vi mangler å legge til `useToast` hooken. La oss bare slette den fra koden over.
Vi mangler å implementere createTodo endepunktet fra backenden. La oss gjøre det nå.
Slutt koden ser du under.

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";

const FormSchema = z.object({
  description: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function CreateTodo() {
  const utils = api.useUtils();

  const { mutate: createTodo } = api.todo.create.useMutation({
    onSuccess: () => {
      void utils.todo.findAll.invalidate();
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createTodo(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="todo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

# 7. implement index page

La oss oppdatere start siden for å vise todoene og legge til mulighet for å lage nye todos.

```typescript
      // legg til øverst i komponenten
      const { data } = api.todo.findAll.useQuery();

      // legg til i return i main  elementet
      <main>
        {data?.map((todo) => <Todo key={todo.id} todo={todo} />)}
        <CreateTodo />
      </main>
```

# 8. implement changes to shadcn components

Vi har lagt til en del shadcn komponenter, så la oss oppdatere en av disse `src/components/ui/checkbox.tsx`.
Her er nemlig forskjellen på shadcn og mange andre ui biblioteker. Vi eier koden og kan endre den som vi vil.

Gå til `src/components/ui/checkbox.tsx` og legg til følgende kode i classname:

```css
//prettier-ignore
[state=checked]:opacity-50;
```

I `src/components/todo.tsx` oppdater label komponenten til følgende kode:

```typescript
<label
  htmlFor={todo.id}
  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${todo.isCompleted ? "line-through opacity-50" : ""}`}
>
```

# 9. implement litt bedre styling på index.tsx

Legg til følgende kode i `src/pages/index.tsx`:

```typescript
...
...
...
<main className="relative w-full bg-background p-10">
  <div className="my-4 flex h-screen flex-col gap-2">
...
...
...
```

Legg til følgende kode i `src/components/create-todo.tsx`:

```typescript
...
...
...
<form
  onSubmit={form.handleSubmit(onSubmit)}
  className="sticky bottom-4 mt-auto flex gap-2"
>
...
...
...
```

# 10. implement delete functionality

Vi mangler å legge til delete funksjonalitet. La oss gjøre det nå.

todos:

- [] Lag knapp for slett
- [] implementer api.todo.delete.useMutation
- [] husk å invalidere cache etter sletting

```typescript
// api/todo.ts
const { mutate: deleteTodo } = api.todo.delete.useMutation({
  onSuccess: () => {
    void utils.todo.findAll.invalidate();
  },
});

// Legg til knappen i Todo komponenten
<Button
  variant="ghost"
  size="icon"
  className="ml-auto"
  onClick={() => deleteTodo({ id: todo.id })}
>
  <Trash2 className="text-red-500" />
</Button>
```

# 11. viktigst av alt 🥳 DARK MODE 🥹

Vi følger [shadcn sin dark mode guide for next.js](https://ui.shadcn.com/docs/dark-mode/next)

👇👇👇 Den er beskrevet under 👇👇👇

Legg til next-themes

```bash
npm install next-themes
```

Legg til theme-provider i components mappen

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Legg til theme-provider i `_app.tsx`

```typescript
import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className={GeistSans.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
};
```

Legg til theme-toggle i components mappen

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

Vi må installere dropdown-menu

```bash
npx shadcn-ui@latest add dropdown-menu
```

Sist, men ikke minst, legg til theme-toggle i `src/pages/index.tsx`

```typescript
<div className="fixed right-4 top-4">
  <ThemeToggle />
</div>
```

# 12. DEPLOY

Vi gjør en live demo

[https://vercel.com/](Vercel)

# Ekstra ressurser

- [CSS to Tailwind css](https://transform.tools/css-to-tailwind)
- [Samling av ting relatert til Shadcn/UI](https://github.com/birobirobiro/awesome-shadcn-ui)

# Bonus

- [Typewriter](https://www.cult-ui.com/docs/components/typewriter)

# Bonus Bonus

Vil du lage en desktop app? Sjekk ut [Tauri](https://v2.tauri.app/)

```
npm install -D @tauri-apps/cli@next
npx tauri init
npx tauri dev
```
