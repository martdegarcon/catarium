"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LoginFormData,
  createLoginSchema,
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

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { dictionary, locale } = useDictionary();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(dictionary)),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        login: data.login,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError(dictionary.auth.login.messages.invalidCredentials);
      } else {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch (error) {
      setError(dictionary.auth.login.messages.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {dictionary.auth.login.title}
        </CardTitle>
        <CardDescription className="text-center">
          {dictionary.auth.login.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.auth.login.fields.login.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        dictionary.auth.login.fields.login.placeholder
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
                    {dictionary.auth.login.fields.password.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        dictionary.auth.login.fields.password.placeholder
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {loading
                ? dictionary.auth.login.actions.submit.loading
                : dictionary.auth.login.actions.submit.idle}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col items-center gap-3 pt-2">
          <Link
            href={`/${locale}/forgot-password`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {dictionary.auth.login.actions.forgotPassword}
          </Link>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {dictionary.auth.login.actions.noAccount}
            </span>
            <Link
              href={`/${locale}/register`}
              className="font-medium text-primary hover:underline"
            >
              {dictionary.auth.login.actions.createAccount}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
