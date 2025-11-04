import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout 
      tree={source.pageTree} 
      {...baseOptions()}
      sidebar={{
        banner: (
          <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg mb-4 text-sm">
            🍦 Production-ready UI components for Better Auth
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
