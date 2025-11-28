import { RegisterForm } from "@/processes/auth/ui/register-form";
import { getDictionary } from "../../dictionaries";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: "ru" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-muted/50 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{dict.auth.register.title}</h1>
        <p className="text-muted-foreground">{dict.auth.register.description}</p>
      </div>
      <RegisterForm />
    </div>
  );
}
