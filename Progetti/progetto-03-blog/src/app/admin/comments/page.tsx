import { prisma } from '@/lib/prisma'
import { CommentModerator } from '@/components/admin/CommentModerator'

export default async function AdminCommentsPage() {
  const pendingComments = await prisma.comment.findMany({
    where: { approved: false },
    include: { post: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const approvedComments = await prisma.comment.findMany({
    where: { approved: true },
    include: { post: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Moderazione Commenti</h1>

      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-amber-400 flex items-center gap-2">
          Da Approvare <span className="bg-amber-500/10 px-2 py-0.5 rounded-full text-xs">{pendingComments.length}</span>
        </h2>
        <CommentModerator comments={pendingComments} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center gap-2">
          Recenti Approvati
        </h2>
        <CommentModerator comments={approvedComments} />
      </div>
    </div>
  )
}
