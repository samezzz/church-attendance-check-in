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
import { Separator } from '@/components/ui/separator';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Invalid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const { signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      console.log('Form values:', values);
      await signUp(values.email, values.password, values.fullName, values.phone);
      toast.success('Account created successfully! Please check your email to confirm your account.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast.success('Signed up successfully');
    } catch (error) {
      console.error('Google sign up error:', error);
      toast.error('Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            type="button" 
            className="w-full" 
            disabled={isLoading}
            onClick={onGoogleSignUp}
          >
            {isLoading ? 'Signing up...' : 'Sign up with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

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
                name="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
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
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </div>
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