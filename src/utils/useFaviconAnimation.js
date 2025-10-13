import { useEffect } from 'react';

/**
 * Custom hook to animate the favicon
 * Cycles through multiple favicon images to create an animation effect
 */
export function useFaviconAnimation() {
  useEffect(() => {
    const favicon_images = [
      '/favicons/favicon1.png',
      '/favicons/favicon2.png',
      '/favicons/favicon3.png',
      '/favicons/favicon4.png'
    ];

    let image_counter = 0;

    const intervalId = setInterval(() => {
      // Remove current favicon
      const existingIcon = document.querySelector("link[rel='icon']");
      const existingShortcutIcon = document.querySelector("link[rel='shortcut icon']");

      if (existingIcon) existingIcon.remove();
      if (existingShortcutIcon) existingShortcutIcon.remove();

      // Add new favicon image
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = favicon_images[image_counter];
      link.type = 'image/png';
      document.querySelector("head").appendChild(link);

      // Cycle through images
      if (image_counter === favicon_images.length - 1) {
        image_counter = 0;
      } else {
        image_counter++;
      }
    }, 500);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);
}
