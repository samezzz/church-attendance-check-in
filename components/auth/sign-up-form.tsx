'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { FormFieldWrapper } from "./form-field-wrapper";

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password, values.fullName);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up to start checking in to services</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldWrapper
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
            />
            <FormFieldWrapper
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />
            <FormFieldWrapper
              control={form.control}
              name="password"
              label="Password"
              placeholder="Create a password"
              type="password"
            />
            <FormFieldWrapper
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" className="p-0" onClick={() => window.location.href = '/signin'}>
            Sign in
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}