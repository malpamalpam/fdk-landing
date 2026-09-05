import { notFound } from 'next/navigation';
import { getLandingBySlug, getAllSlugs } from '@/content/landings';
import LandingTemplate from '@/components/LandingTemplate';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = getLandingBySlug(slug);

  if (!landing) notFound();

  return <LandingTemplate landing={landing} />;
}
