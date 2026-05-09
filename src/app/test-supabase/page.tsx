import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold font-mono mb-8">Supabase Connection Test</h1>
      <p className="text-muted-foreground mb-4">If the connection works, you will see your todos below (or an empty list if none exist, or an error if the table is missing).</p>
      <ul className="list-disc pl-5 space-y-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="font-mono">{todo.name}</li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && (
        <p className="font-mono text-red-500">No todos found or connection error.</p>
      )}
    </div>
  )
}
