"use client";

import AuthWrapper from "@/components/auth/auth-wrapper";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { loginSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth-service";
import { LoginFormData } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember_me: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data.username, data.password);
      if (response.status === 200) {
        router.push(ROUTES.HOME);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthWrapper
      title="Login"
      description="Please enter your details to login."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 my-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Username" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember_me"
              render={({ field }) => (
                <div className="flex cursor-pointer items-center space-x-2">
                  <Checkbox
                    id="remember_me"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="remember_me"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" variant="default">
              Login
            </Button>
            <Separator />
            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link href={ROUTES.REGISTER} className="text-blue-500">
                Register
              </Link>{" "}
              here.
            </p>
          </CardFooter>
        </form>
      </Form>
    </AuthWrapper>
  );
}
