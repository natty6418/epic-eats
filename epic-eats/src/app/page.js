"use client";
import { options } from './api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function App() {
  const session = await getServerSession(options);
  if (session) {
    redirect("/feed");
    return;
  }
  // useSmoothScroll();
  redirect("/home");
  return;
}
