import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { getSession } from '#/lib/auth/auth-session'
import { ChatPage } from '#/modules/chat/components/chat-page'
import { listCats } from '#/modules/cats/cat.api'
import { listChatConversations } from '#/modules/chat/chat-history.api'

export const Route = createFileRoute('/chat')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user }
  },
  head: () => ({ meta: [{ title: 'Chat • AnabulCare' }] }),
  loader: async () => {
    const [conversations, result] = await Promise.all([
      listChatConversations(),
      listCats(),
    ])
    if (!result.success) throw new Error(result.message)
    return {
      conversations,
      cats: result.cats.map((cat) => ({ id: cat.id, name: cat.name })),
    }
  },
  component: ChatRoute,
  errorComponent: () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#fcfbf7] p-6 text-[#253e32]">
      <p>Riwayat chat gagal dimuat. Silakan coba lagi.</p>
      <Link
        to="/chat"
        reloadDocument
        className="rounded-xl bg-[#284f3d] px-5 py-3 text-sm text-white"
      >
        Coba lagi
      </Link>
      <Link to="/" className="text-sm underline">
        Kembali ke beranda
      </Link>
    </div>
  ),
})

function ChatRoute() {
  const { user } = Route.useRouteContext()
  const { conversations, cats } = Route.useLoaderData()
  return (
    <ChatPage
      name={user.name}
      initialConversations={conversations}
      cats={cats}
    />
  )
}
