"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState} from "react";
import { Loader2Icon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword, ResetPasswords } from "@/lib/schema";
import { toast } from "sonner"

export default function ResetPassword() {

  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [token, setToken] = useState<boolean | null>(null);
  
  const urlToken = searchParams.get("ResetPasswordToken");

  useEffect(() => {
    
    const checkToken = async () => {
      const res = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ResetPasswordToken: urlToken,
        }),
      });

      const data = await res.json();
      setToken(data.valid);
    }
    checkToken();
  }, [searchParams])


  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswords>({
    resolver: zodResolver(resetPassword),
  });

  const onSubmit = async (formData: ResetPasswords) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: urlToken,
          password: formData.password
        }),
      });


      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        setLoading(false);
        setToken(false);
        return;
      }

      toast.success(data.success || "Changed Password Successfully");
      setLoading(false);
      route.push("/");
    } catch (err) {
      console.error("Changed password failed:", err);
      setLoading(false);
    }
  }

  return (
    <>

    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-md mx-8 lg:mx-auto mt-50 lg:mt-10">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>
            Update your password regularly to keep your account secure.
          </CardDescription>
        </CardHeader>
        {token === null ? (
          <CardContent>
            <p className="text-gray-500">Verifying token...</p>
          </CardContent>
          ) : token ? (
            <>
              <CardContent className="space-y-4">

              <Input
                type="password"
                {...register("password", { required: true })}
                placeholder="New-Password"
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}

              <Input
                type="password"
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm New-Password"
              />
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.confirmPassword.message}</AlertDescription>
                </Alert>
              )}

            </CardContent>
            <CardFooter className="flex justify-between">
              {loading ? (
                <Button type="submit" variant="default" disabled>
                  <Loader2Icon className="animate-spin mr-2" />
                  Reset Password...
                </Button>
              ) : (
                <Button type="submit" variant="default">Reset Password</Button>
              )}
            </CardFooter>
          </>
          ) : (
            <CardContent>
              <p className="text-red-500">Your token has expired or is invalid. Please request a new one.</p>
            </CardContent>
          )}
        
      </Card>
    </form>
    </>
  );
}

