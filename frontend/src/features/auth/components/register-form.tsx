import { IconAlertCircle, IconArrowRight, IconLoader2, IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handle } from "@/lib/handle";
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
  const register = useRegister();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const { error } = await handle(register.mutateAsync({ email, password }));
      if (!error) return onSuccess();
      onError(error);
    });
  };

  const onSuccess = () => {
    toast.success("Account created successfully.");
    navigate("/dashboard");
  };

  const onError = (error: string) => {
    setError(error);
    toast.error(error);
  };

  return (
    <div>
      <Card className="w-xs">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
          <CardDescription>Enter your details below to get started.</CardDescription>
        </CardHeader>

        <form action={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  disabled={isPending}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={isPending}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-8">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/login">Sign in instead</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
