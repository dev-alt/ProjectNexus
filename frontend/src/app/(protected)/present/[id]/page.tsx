// app/(protected)/present/[id]/page.tsx
import { PresentationContent } from './PresentationContent';

export default function ProjectPresentation({
                                                params
                                            }: {
    params: { id: string }
}) {
    return <PresentationContent id={params.id} />;
}
