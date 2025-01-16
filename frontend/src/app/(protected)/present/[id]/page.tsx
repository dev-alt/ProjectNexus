import { PresentationContent } from './PresentationContent';

type Params = Promise<{ id: string }>;

export default async function ProjectPresentation({
                                                      params,
                                                  }: {
    params: Params;
}) {
    const resolvedParams = await params;

    return <PresentationContent id={resolvedParams.id} />;
}
