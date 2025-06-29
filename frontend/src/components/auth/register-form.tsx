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
import {
  AUTH_COOKIE_EXPIRES,
  AUTH_COOKIE_NAME,
} from "@/constants/auth.constant";
import { ROUTES } from "@/constants/routes";
import { registerSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth-service";
import { RegisterFormData } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      accept_terms: true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authService.register(data);
      if (response.success) {
        Cookies.set(AUTH_COOKIE_NAME, response.data.token, {
          expires: AUTH_COOKIE_EXPIRES,
        });
        startTransition(() => {
          router.push(ROUTES.HOME);
          router.refresh();
          toast.success("Register successful");
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Register failed");
    }
  };

  return (
    <AuthWrapper
      title="Register"
      description="Please enter your details to register."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 my-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
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
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <div className="flex cursor-pointer items-center space-x-2">
                  <Checkbox
                    id="accept_terms"
                    name="accept_terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="accept_terms"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept Terms
                  </label>
                </div>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" variant="default">
              Register
            </Button>
            <Separator />
            <p className="text-center">
              Already have an account?{" "}
              <Link href={ROUTES.LOGIN} className="text-blue-500">
                Login
              </Link>{" "}
              here.
            </p>
          </CardFooter>
        </form>
      </Form>
    </AuthWrapper>
  );
}
