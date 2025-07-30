"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { zodResolver } from "@hookform/resolvers/zod";
import { emailChecker, EmailChecker } from "@/lib/schema";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner"

export default function forgotPassword() {
    const [loading, setLoading] = useState(false);


    const { register, handleSubmit, formState: { errors } } = useForm<EmailChecker>({
        resolver : zodResolver(emailChecker), 
      });

    const onSubmit = async (formData: EmailChecker) => {
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                email: formData.email,
                }),
            })

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Something went wrong!");
                setLoading(false);
                return;
            }
            toast.success("Reset link sent to your email!");
            setLoading(false);
        } catch (err) {
            console.error("Sending email error:", err);
            setLoading(false);
        }
    }
    
return (
 <>
 <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email address, and we'll send you a secure link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
          />

        </CardContent>
        <CardFooter className="flex justify-between">
          {loading ? (
            <Button variant="default" disabled>
              <Loader2Icon className="animate-spin mr-2" />
              Sending...
            </Button>
          ) : (
            <Button variant="default">Reset Password</Button>
          )}
        </CardFooter>
      </Card>
    </form>
 </>
);
}