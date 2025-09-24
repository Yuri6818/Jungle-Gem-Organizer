import { useEffect, useMemo, useState } from 'react'
import { Gem, Leaf, Lightbulb, Briefcase, Plus, Trash2, Check } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import confetti from 'canvas-confetti'
import './index.css'

type TabKey = 'Personal' | 'Work' | 'Ideas'
type Task = { id: string; text: string; done: boolean }
type TasksByTab = Record<TabKey, Task[]>

const TAB_ORDER: TabKey[] = ['Personal', 'Work', 'Ideas']

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function useLocalStorageTasks(key: string, initial: TasksByTab) {
  const [value, setValue] = useState<TasksByTab>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as TasksByTab) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

function App() {
  const [active, setActive] = useState<TabKey>('Personal')
  const [tasksByTab, setTasksByTab] = useLocalStorageTasks('jg/tasks', {
    Personal: [],
    Work: [],
    Ideas: [],
  })
  const tasks = tasksByTab[active]
  const countsByTab = useMemo(
    () => ({
      Personal: tasksByTab.Personal.length,
      Work: tasksByTab.Work.length,
      Ideas: tasksByTab.Ideas.length,
    }),
    [tasksByTab]
  )
  const [input, setInput] = useState('')

  const completedCount = useMemo(() => tasks.filter(t => t.done).length, [tasks])

  function addTask() {
    const text = input.trim()
    if (!text) return
    const next: Task = { id: uuid(), text, done: false }
    setTasksByTab(prev => ({ ...prev, [active]: [next, ...prev[active]] }))
    setInput('')
  }
  function toggleTask(id: string) {
    setTasksByTab(prev => ({
      ...prev,
      [active]: prev[active].map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    }))
    const nowDone = tasks.find(t => t.id === id)?.done === false
    if (nowDone) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
      const messages = [
        'Great job! 💎',
        'You crushed it! 🌿',
        'Sparkle achieved! ✨',
        'Another gem collected! 💚'
      ]
      toast.success(messages[Math.floor(Math.random() * messages.length)])
    }
  }
  function removeTask(id: string) {
    setTasksByTab(prev => ({ ...prev, [active]: prev[active].filter(t => t.id !== id) }))
  }
  function clearDone() {
    setTasksByTab(prev => ({ ...prev, [active]: prev[active].filter(t => !t.done) }))
  }

  function exportTasks() {
    const blob = new Blob([JSON.stringify(tasksByTab, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jungle-gem-tasks.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importTasks(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as TasksByTab
        setTasksByTab(data)
        toast.success('Tasks imported!')
      } catch {
        toast.error('Import failed')
      }
    }
    reader.readAsText(file)
    evt.target.value = ''
  }

  return (
    <div className="min-h-screen bg-[url('/jungle.webp')] bg-cover bg-fixed bg-center text-white">
      <Toaster richColors position="top-right" />
      <div className="min-h-screen backdrop-blur-[1px] bg-gradient-to-b from-black/40 via-black/30 to-black/60">
        <header className="px-4 sm:px-6 pt-8 pb-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Gem className="size-8 text-emerald-300" />
            <h1 className="font-[Pacifico] text-3xl sm:text-4xl text-emerald-200 drop-shadow">Jungle Gem Organizer</h1>
          </div>
        </header>

        <main className="px-4 sm:px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <nav className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto">
              {TAB_ORDER.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={
                    'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ' +
                    (active === tab
                      ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-900/30'
                      : 'bg-white/10 hover:bg-white/20 text-emerald-100')
                  }
                >
                  {tab === 'Personal' && <Leaf className={`size-4 ${active === tab ? 'shimmer' : ''}`} />}
                  {tab === 'Work' && <Briefcase className={`size-4 ${active === tab ? 'shimmer' : ''}`} />}
                  {tab === 'Ideas' && <Lightbulb className={`size-4 ${active === tab ? 'shimmer' : ''}`} />}
                  <span className="font-[Quicksand] font-semibold">{tab}</span>
                  <span className={
                    'ml-2 inline-flex items-center justify-center rounded-full text-xs px-2 py-0.5 ' +
                    (active === tab ? 'bg-white/20' : 'bg-black/20')
                  }>
                    {countsByTab[tab]}
                  </span>
                </button>
              ))}
            </nav>

            <section className="bg-white/10 rounded-2xl border border-white/10 shadow-xl shadow-black/20 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder={`Add to ${active}...`}
                  className="flex-1 rounded-xl px-4 py-3 bg-black/30 text-white placeholder:text-emerald-200/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={addTask}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold"
                >
                  <Plus className="size-4" /> Add
                </button>
              </div>

              <ul className="space-y-2">
                {tasks.map(t => (
                  <li key={t.id} className="flex items-center gap-3 bg-black/30 rounded-xl px-3 py-3 border border-white/10">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`size-7 rounded-full border flex items-center justify-center ${t.done ? 'bg-emerald-500 border-emerald-400' : 'border-white/30'}`}
                      aria-label={t.done ? 'Mark as not done' : 'Mark as done'}
                    >
                      {t.done && <Check className="size-4 text-white" />}
                    </button>
                    <span className={`flex-1 ${t.done ? 'line-through text-emerald-100/60' : ''}`}>{t.text}</span>
                    <button onClick={() => removeTask(t.id)} className="text-emerald-200/80 hover:text-emerald-100" aria-label="Delete">
                      <Trash2 className="size-5" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between text-emerald-100/80">
                <span className="text-sm">{completedCount} completed</span>
                <div className="flex items-center gap-3">
                  <button onClick={clearDone} className="text-sm hover:underline">Clear completed</button>
                  <button onClick={exportTasks} className="text-sm hover:underline">Export</button>
                  <label className="text-sm hover:underline cursor-pointer">
                    Import
                    <input type="file" accept="application/json" className="hidden" onChange={importTasks} />
                  </label>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      {/* Mobile floating Add button */}
      <button
        onClick={addTask}
        className="fixed bottom-6 right-6 sm:hidden rounded-full bg-emerald-500 hover:bg-emerald-400 text-white p-4 shadow-xl shadow-emerald-900/30"
        aria-label="Add task"
      >
        <Plus className="size-6" />
      </button>
    </div>
  )
}

export default App
