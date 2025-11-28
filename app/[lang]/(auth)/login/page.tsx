// app/[lang]/(auth)/login/page.tsx
import { LoginForm } from "@/processes/auth/ui/login-form";
import { getDictionary } from "../../dictionaries";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: "ru" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center space-y-4 px-4">
      <LoginForm />
    </div>
  );
}
