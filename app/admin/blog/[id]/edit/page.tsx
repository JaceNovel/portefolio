import { redirect } from "next/navigation";

export default async function AdminBlogEditRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard-admin/blog/${id}/edit`);
}
