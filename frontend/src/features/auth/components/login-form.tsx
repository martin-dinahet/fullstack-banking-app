import { IconAt, IconLock } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Form } from "@/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();

  const onSuccess = () => {
    toast.success("Logged in successfully.");
    navigate("/");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form.Root
          defaultValues={{ email: "", password: "" }}
          mutation={login}
          onSuccess={onSuccess}
        >
          <Form.Fields>
            <Form.Field
              autoComplete="email"
              icon={<IconAt className="h-4 w-4" />}
              label="Email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            <Form.Field
              autoComplete="current-password"
              icon={<IconLock className="h-4 w-4" />}
              label="Password"
              name="password"
              type="password"
            />
            <Form.Error />
            <Form.Submit>Sign in</Form.Submit>
          </Form.Fields>
        </Form.Root>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline-offset-4 hover:underline"
            to="/register"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
