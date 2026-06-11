'use client';

/**
 * Client-side wrapper for DigitalTwinCity.
 * `ssr: false` is only valid inside a 'use client' component in Next.js App Router.
 * This wrapper prevents the Three.js/R3F component from being rendered on the server,
 * which would crash with `window is not defined`.
 */
import dynamic from 'next/dynamic';

const DigitalTwinCity = dynamic(() => import('@/components/DigitalTwinCity'), {
  ssr: false,
  loading: () => (
    <div
      style={{ minHeight: '40px', background: 'transparent' }}
      aria-hidden="true"
    />
  ),
});

export default function DigitalTwinCityClient() {
  return <DigitalTwinCity />;
}
