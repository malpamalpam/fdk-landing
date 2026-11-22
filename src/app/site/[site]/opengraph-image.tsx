import { ImageResponse } from 'next/og';
import { SITES } from '@/config/sites';
import { getSiteContent, VALID_SITES } from '@/content/sites';

export function generateStaticParams() {
  return VALID_SITES.map((site) => ({ site }));
}

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function alt({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  const content = getSiteContent(site);
  return content?.meta.title ?? 'Fundacja Firma Dla Każdego';
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const content = getSiteContent(site);
  const config = SITES[site as keyof typeof SITES];

  if (!content || !config) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#191B3F',
            color: 'white',
            fontSize: 48,
          }}
        >
          Fundacja Firma Dla Każdego
        </div>
      ),
      { ...size },
    );
  }

  const hook = content.hero.hooks[0];
  const badge = content.hero.badge;
  const domain = config.domains[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#191B3F',
          padding: '48px 56px',
          position: 'relative',
        }}
      >
        {/* Top-left brand */}
        <div
          style={{
            fontSize: 20,
            color: 'white',
            fontWeight: 400,
          }}
        >
          Fundacja Firma Dla Każdego
        </div>

        {/* Centered H1 hook */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            {hook}
          </div>
        </div>

        {/* Bottom row: badge pill left, domain right */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              backgroundColor: '#C6FF39',
              color: '#191B3F',
              fontSize: 18,
              fontWeight: 600,
              padding: '8px 20px',
              borderRadius: 999,
            }}
          >
            {badge}
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#C8B6FF',
            }}
          >
            {domain}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
