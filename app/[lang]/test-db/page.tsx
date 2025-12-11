import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "../dictionaries";

/**
 * Render a localized test page that queries the "users" table and displays the results.
 *
 * The component selects a language-specific dictionary using the provided `lang` parameter,
 * queries Supabase for users, and renders either an error message or the found user count
 * and a JSON dump of the users.
 *
 * @param params - A promise resolving to an object with a `lang` string used to choose localization
 * @returns The page's rendered JSX showing the user count and JSON data or an error message
 */
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