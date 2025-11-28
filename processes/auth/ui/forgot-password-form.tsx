"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  ResetPasswordFormData,
  createResetPasswordSchema,
} from "@/processes/auth/lib/schemas/auth";
import {
  generateResetToken,
  getTokenExpiry,
} from "@/processes/auth/lib/tokens";

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

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { dictionary, locale } = useDictionary();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema(dictionary)),
    defaultValues: {
      login: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Ищем пользователя по логину
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, login, email")
        .eq("login", data.login)
        .single();

      if (userError || !user) {
        setError(dictionary.auth.forgotPassword.messages.userNotFound);
        return;
      }

      // Генерируем токен сброса
      const resetToken = generateResetToken();
      const tokenExpiry = getTokenExpiry();

      // Сохраняем токен в базе
      const { error: tokenError } = await supabase
        .from("password_reset_tokens")
        .insert([
          {
            user_id: user.id,
            token: resetToken,
            expires_at: tokenExpiry.toISOString(),
          },
        ]);

      if (tokenError) {
        setError(dictionary.auth.forgotPassword.messages.tokenError);
        return;
      }

      // ⭐ ОТПРАВЛЯЕМ ПИСЬМО ⭐
      const emailResponse = await fetch("/api/send-reset-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          resetToken: resetToken,
          login: user.login,
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("Email sending failed:", emailResult.error);
        setError(dictionary.auth.forgotPassword.messages.emailError);

        // Удаляем токен если письмо не отправилось
        await supabase
          .from("password_reset_tokens")
          .delete()
          .eq("token", resetToken);

        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setError(dictionary.auth.forgotPassword.messages.unknownError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {dictionary.auth.forgotPassword.title}
        </CardTitle>
        <CardDescription className="text-center">
          {dictionary.auth.forgotPassword.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.auth.forgotPassword.fields.login.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        dictionary.auth.forgotPassword.fields.login.placeholder
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
                  <p className="font-semibold">
                    {dictionary.auth.forgotPassword.messages.successTitle}
                  </p>
                  <p className="mt-1">
                    {dictionary.auth.forgotPassword.messages.successDescription}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>
                      {dictionary.auth.forgotPassword.messages.checkSpam}
                    </strong>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => router.push(`/${locale}/reset-password`)}
                  >
                    {dictionary.auth.forgotPassword.messages.goToReset}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || success}
            >
              {loading
                ? dictionary.auth.forgotPassword.actions.submit.loading
                : dictionary.auth.forgotPassword.actions.submit.idle}
            </Button>

            <div className="text-center">
              <Link
                href={`/${locale}/login`}
                className="text-sm text-blue-600 hover:underline"
              >
                {dictionary.auth.forgotPassword.messages.backToLogin}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
