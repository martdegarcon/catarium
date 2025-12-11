"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { hashPassword } from "@/processes/auth/lib/password";
import {
  RegisterFormData,
  createRegisterSchema,
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
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useDictionary } from "@/hooks/use-dictionary";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { dictionary, locale } = useDictionary();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(dictionary)),
    defaultValues: {
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const passwordHash = await hashPassword(data.password);

      const { data: user, error } = await supabase
        .from("users")
        .insert([
          {
            login: data.login,
            email: data.email,
            password_hash: passwordHash,
            language: locale,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          setError(dictionary.auth.register.messages.duplicateUser);
        } else {
          setError(dictionary.auth.register.messages.genericError);
        }
        return;
      }

      setSuccess(true);
      form.reset();

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (error) {
      setError(dictionary.auth.register.messages.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {dictionary.auth.register.title}
        </CardTitle>
        <CardDescription className="text-center">
          {dictionary.auth.register.description}
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
                    {dictionary.auth.register.fields.login.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        dictionary.auth.register.fields.login.placeholder
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.auth.register.fields.email.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={
                        dictionary.auth.register.fields.email.placeholder
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dictionary.auth.register.fields.password.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        dictionary.auth.register.fields.password.placeholder
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
                    {dictionary.auth.register.fields.confirmPassword.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        dictionary.auth.register.fields.confirmPassword
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
                  {dictionary.auth.register.messages.success}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || success}
            >
              {loading && <Spinner className="mr-2" />}
              {loading
                ? dictionary.auth.register.actions.submit.loading
                : dictionary.auth.register.actions.submit.idle}
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-center gap-2 pt-4 text-sm border-t">
          <span className="text-muted-foreground">
            {dictionary.auth.register.actions.hasAccount}
          </span>
          <Link
            href={`/${locale}/login`}
            className="font-medium text-primary hover:underline"
          >
            {dictionary.auth.register.actions.signIn}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
