import { redirect } from "next/navigation"
import { isDatabaseInitialized } from "@/actions/auth-actions"

export default async function Home() {
  // Check if database is initialized
  const dbInitialized = await isDatabaseInitialized()

  if (!dbInitialized) {
    redirect("/setup")
  } else {
    redirect("/login")
  }
}
