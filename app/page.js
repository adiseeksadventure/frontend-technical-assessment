import { redirect } from "next/navigation";

// The home page just forwards to the dashboard.
// If the user isn't logged in, proxy.js will bounce them to /login.
export default function Home() {
  redirect("/dashboard");
}
