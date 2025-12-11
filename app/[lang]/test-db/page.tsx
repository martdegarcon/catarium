import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "../dictionaries";

export default async function TestDBPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const supabase = await createClient();
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  const { data: users, error } = await supabase.from("users").select("*");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">{dict.pages.testDb.title}</h1>

      {error ? (
        <div className="text-red-500">
          {dict.pages.testDb.error}: {error.message}
        </div>
      ) : (
        <div>
          <p className="mb-4">
            {dict.pages.testDb.foundUsers}: {users?.length}
          </p>
          <pre className="rounded bg-muted p-4 text-sm">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
