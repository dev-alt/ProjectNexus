// app/(protected)/team/[id]/page.tsx
import TeamPage from './TeamPage';

type Params = Promise<{ id: string }>;

export default async function TeamServerPage({ params }: { params: Params }) {
    const resolvedParams = await params; // Resolve the Promise for params
    const { id } = resolvedParams;

    return <TeamPage params={{ id }} />;
}
