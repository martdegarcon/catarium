import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { DashboardLayout } from "../dashboard-layout";

export default async function DashboardLayoutWrapper({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const session = await getServerSession();
  const { lang } = await params;

  if (!session) {
    redirect(`/${lang}/login`);
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
