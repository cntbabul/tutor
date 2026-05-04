import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tutor Marketplace',
    short_name: 'TutorApp',
    description: 'Find and book the best local tutors',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3a77ff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // You should add 192x192 and 512x512 png icons to your public folder for full PWA support
    ],
  };
}
