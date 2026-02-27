import { redirect } from "next/navigation";

export default function ClientLoginRedirect() {
  redirect("/client-area/login");
}
