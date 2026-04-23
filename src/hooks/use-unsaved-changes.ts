import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    // Handle internal navigation via Link clicks
    const handleInternalNavigation = (e: MouseEvent) => {
      if (!isDirty) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.href && !anchor.href.includes('#')) {
        const url = new URL(anchor.href);
        // Only intercept internal links that change the path
        if (
          url.origin === window.location.origin && 
          url.pathname !== window.location.pathname
        ) {
          e.preventDefault();
          e.stopPropagation();
          setPendingUrl(anchor.href);
          setShowConfirm(true);
        }
      }
    };

    document.addEventListener('click', handleInternalNavigation, true);

    return () => {
      document.removeEventListener('click', handleInternalNavigation, true);
    };
  }, [isDirty]);

  const confirmNavigation = () => {
    if (pendingUrl) {
      router.replace(pendingUrl);
    }
    setShowConfirm(false);
    setPendingUrl(null);
  };

  const cancelNavigation = () => {
    setShowConfirm(false);
    setPendingUrl(null);
  };

  return {
    showConfirm,
    confirmNavigation,
    cancelNavigation,
  };
}

