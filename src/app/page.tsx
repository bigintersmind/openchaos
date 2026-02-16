import { redirect } from "next/navigation";
import { pickRandomVariant } from "@/lib/chaos-router";

export default function Home() {
  redirect(`/${pickRandomVariant()}`);
}
