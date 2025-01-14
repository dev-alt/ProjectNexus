// ProjectGrid.tsx


import {Project} from "@/types/types";
import {ProjectCard} from "@/components/projects/ProjectCard";
import React from "react";

interface ProjectGridProps {
    projects: Project[];
    onEditProject?: (project: Project) => void;
    onDeleteProject?: (project: Project) => void;
    onViewProject?: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
                                                            projects,
                                                            onEditProject,
                                                            onDeleteProject,
                                                            onViewProject,
                                                        }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
            <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
                onView={onViewProject}
            />
        ))}
    </div>
);
