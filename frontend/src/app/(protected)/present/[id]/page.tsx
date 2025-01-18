// app/(protected)/present/[id]/page.tsx
import ProjectPresentation from "./ProjectPresentation";
import { Suspense } from "react";
import { Metadata } from "next";

type PageProps = {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `Project ${resolvedParams.id} | Present`,
    }
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;

    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            }
        >
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <ProjectPresentation id={resolvedParams.id} />
            </div>
        </Suspense>
    );
}
