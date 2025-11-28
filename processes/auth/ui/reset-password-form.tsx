"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { hashPassword } from "@/processes/auth/lib/password";
import {
  NewPasswordFormData,
  createNewPasswordSchema,
} from "@/processes/auth/lib/schemas/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useDictionary } from "@/hooks/use-dictionary";

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { dictionary, locale } = useDictionary();

  const token = searchParams.get("token");

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(createNewPasswordSchema(dictionary)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Проверяем валидность токена
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        // Для демо используем localStorage
        const demoToken = localStorage.getItem("resetToken");
        const demoUserId = localStorage.getItem("resetUserId");

        if (demoToken && demoUserId) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
        return;
      }

      // В реальном приложении проверяем токен в базе
      try {
        const { data, error } = await supabase
          .from("password_reset_tokens")
          .select("user_id, expires_at")
          .eq("token", token)
          .gt("expires_at", new Date().toISOString())
          .single();

        if (error || !data) {
          setValidToken(false);
          setError(dictionary.validation.token.invalidOrExpired);
        } else {
          setValidToken(true);
        }
      } catch (error) {
        setValidToken(false);
        setError(dictionary.validation.token.checkError);
      }
    };

    checkToken();
  }, [token, supabase]);

  const onSubmit = async (data: NewPasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      let userId: string;

      if (token) {
        // В реальном приложении
        const { data: tokenData } = await supabase
          .from("password_reset_tokens")
          .select("user_id")
          .eq("token", token)
          .single();

        if (!tokenData) {
          setError(dictionary.auth.resetPassword.messages.invalidToken);
          return;
        }
        userId = tokenData.user_id;
      } else {
        // Для демо из localStorage
        const demoUserId = localStorage.getItem("resetUserId");
        if (!demoUserId) {
          setError(dictionary.auth.resetPassword.messages.sessionExpired);
          return;
        }
        userId = demoUserId;
      }

      // Хешируем новый пароль
      const passwordHash = await hashPassword(data.password);

      // Обновляем пароль пользователя
      const { error: updateError } = await supabase
        .from("users")
        .update({ password_hash: passwordHash })
        .eq("id", userId);

      if (updateError) {
        setError(dictionary.auth.resetPassword.messages.updateError);
        return;
      }

      // Удаляем использованный токен
      if (token) {
        await supabase
          .from("password_reset_tokens")
          .delete()
          .eq("token", token);
      } else {
        // Очищаем демо данные
        localStorage.removeItem("resetToken");
        localStorage.removeItem("resetUserId");
      }

      setSuccess(true);

      // Редирект через 3 секунды
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 3000);
    } catch (error) {
      setError(dictionary.auth.resetPassword.messages.unknownError);
    } finally {
      setLoading(false);
    }
  };

  if (validToken === false) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>
              {dictionary.auth.resetPassword.invalidLink}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Link
              href={`/${locale}/forgot-password`}
              className="text-blue-600 hover:underline"
            >
              {dictionary.auth.resetPassword.messages.requestNewLink}
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {dictionary.auth.resetPassword.title}
        </CardTitle>
        <CardDescription className="text-center">
          {dictionary.auth.resetPassword.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.auth.resetPassword.fields.password.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        dictionary.auth.resetPassword.fields.password
                          .placeholder
                      }
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.auth.resetPassword.fields.confirmPassword.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        dictionary.auth.resetPassword.fields.confirmPassword
                          .placeholder
                      }
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  {dictionary.auth.resetPassword.messages.success}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || success || validToken === false}
            >
              {loading
                ? dictionary.auth.resetPassword.actions.submit.loading
                : dictionary.auth.resetPassword.actions.submit.idle}
            </Button>

            <div className="text-center">
              <Link
                href={`/${locale}/login`}
                className="text-sm text-blue-600 hover:underline"
              >
                {dictionary.auth.resetPassword.actions.backToLogin}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
