import { redirect } from 'next/navigation';
import { getAllPageIds } from '@/lib/mdx-utils';

export default function DocsIndexPage() {
  const allIds = getAllPageIds();
  const firstPage = allIds[0] || 'paradigms-overview';
  redirect(`/docs/${firstPage}/`);
}
