import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getStrapiData } from "@/utils/strapi";
import { ProjectsView } from "@/views/ProjectsView/ProjectsView";

export const generateMetadata = createMetadataGenerator({
  getMetadata: async (locale) => {
    const data = await getStrapiData('get-projects-page-data', locale);
    return data;
  },
  transformData: (data) => {
    // Extract metadata from the specific path in your data structure
    return data?.projectsPage?.metadata;
  },
  getPath: (locale) => `/${locale}/projects`,
  fallback: {
    title: 'Projects',
    description: 'Projects'
  }
});

export default async function ProjectsPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-projects-page-data', locale)

    return (
        <ProjectsView data={data} />
    );
  } 