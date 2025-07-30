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
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRegisterSchema, AdminRegisterSchema } from "@/lib/schema";
import { toast } from "sonner"


export default function AdminRegister() {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<AdminRegisterSchema>({
    resolver: zodResolver(adminRegisterSchema),
  });

  const onSubmit = async (formData: AdminRegisterSchema) => {
  setLoading(true);

  try {
    const res = await fetch("/api/auth/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    toast.success(data.success || "User Register Successfully!");
    setLoading(false);
    router.push("/");
    
  } catch (error) {
    console.error("Registration failed:", error);
    setLoading(false);
  }
};

  
    
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-md mx-8 lg:mx-auto mt-50 lg:mt-10">
        <CardHeader>
          <CardTitle>Register to Your Management</CardTitle>
          <CardDescription>
            Manage and Plans effectively with our app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            {...register("full_name", { required: true })}
            placeholder="Fullname"
          />
          {errors.full_name && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.full_name.message}</AlertDescription>
            </Alert>
          )}

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

          <Input
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="Confirm Password"
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
            <Button variant="default" disabled>
              <Loader2Icon className="animate-spin mr-2" />
              Registering...
            </Button>
          ) : (
            <Button variant="default">Register</Button>
          )}
        </CardFooter>
      </Card>
    </form>
   
    </>
  );
}
