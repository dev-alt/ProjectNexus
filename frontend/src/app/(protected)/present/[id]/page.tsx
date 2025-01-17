// app/(protected)/present/[id]/page.tsx
import ProjectPresentation from "./ProjectPresentation";
import { Suspense } from "react";

interface PageProps {
    params: {
        id: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: PageProps) {
    // Properly await the params using Promise.resolve()
    const { id } = await Promise.resolve(params);

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <ProjectPresentation id={id} />
            </div>
        </Suspense>
    );
}
