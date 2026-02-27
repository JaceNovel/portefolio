import { redirect } from "next/navigation";

export default function AdminNewPostRedirect() {
  redirect("/dashboard-admin/blog/new");
}
