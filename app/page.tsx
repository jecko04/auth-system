"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginSchema, AdminLoginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HandMetal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthCookie } from "./actions/cookies";
import { toast } from "sonner";

export default function Home() {
 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginSchema>({
    resolver : zodResolver(adminLoginSchema), 
  });

  const onSubmit = async (formData: AdminLoginSchema) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed.");
        setLoading(false);
        return;
      } 
        toast.success(data.success || "Login successful!");
        setLoading(false);
        if (data.user.role === 'system_admin') {
          router.push("/auth/admin-dashboard");
        }else {
          router.push("/auth/dashboard");
        }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
    const res = await getAuthCookie()
      if (res) {
                
        router.push("/auth/dashboard");
      } else {
        console.warn("No auth cookie found, user not logged in.");
      }
    }
    checkAuth();
  }), [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Welcome to Finance Management</CardTitle>
          <CardDescription>
            Manage your finances effectively with our app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
          />
          {errors.email && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.email.message}</AlertDescription>
            </Alert>
          )}

          <Input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
          />
          {errors.password && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.password.message}</AlertDescription>
            </Alert>
          )}
          
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="link" className="cursor-pointer">
            <Link href={'/auth/forgot-password'}>
              Forgot Password?
            </Link>
          </Button>
          <Button variant="default">
           Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
