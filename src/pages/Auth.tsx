import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, User, Gift, ArrowRight, Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import GoogleIcon from '@/components/icons/GoogleIcon';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const otpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const Auth = () => {
  const { isAuthenticated, signIn, signUp, signInWithGoogle, signInWithOtp, verifyOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        toast.error('Login failed', { 
          description: error.message 
        });
      } else {
        toast.success('Login successful');
        navigate('/');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(values.email, values.password, {
        first_name: values.firstName,
        last_name: values.lastName,
      });
      if (error) {
        toast.error('Signup failed', { 
          description: error.message 
        });
      } else {
        toast.success('Account created successfully', {
          description: 'Please check your email for verification.'
        });
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Google sign in failed');
    }
  };

  const handleSendOtp = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOtp(values.email);
      if (error) {
        toast.error('Failed to send OTP', { 
          description: error.message 
        });
      } else {
        setOtpSent(true);
        setEmailForOtp(values.email);
        toast.success('OTP sent successfully', {
          description: 'Please check your email for the OTP code.'
        });
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await verifyOtp(emailForOtp, otp);
      if (error) {
        toast.error('OTP verification failed', { 
          description: error.message 
        });
      } else {
        toast.success('OTP verified successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-heartfelt-burgundy mb-2">Welcome to Heartfelt</h1>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="otp">Login with OTP</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Enter your email and password to login</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="your@email.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" type="password" placeholder="••••••" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>Login</>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <GoogleIcon />
                  <span className="ml-2">Google</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="John" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="your@email.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" type="password" placeholder="••••••" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>Create account</>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <GoogleIcon />
                  <span className="ml-2">Google</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="otp">
            <Card>
              <CardHeader>
                <CardTitle>Login with OTP</CardTitle>
                <CardDescription>
                  {otpSent 
                    ? "Enter the 6-digit code sent to your email" 
                    : "Enter your email to receive a one-time password"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!otpSent ? (
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleSendOtp)} className="space-y-4">
                      <FormField
                        control={otpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="your@email.com" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>Send OTP</>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <Label className="mb-3">Enter 6-digit OTP</Label>
                      <InputOTP 
                        maxLength={6} 
                        value={otp} 
                        onChange={setOtp}
                        className="text-center"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button 
                      className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>Verify OTP</>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => setOtpSent(false)}
                      disabled={isLoading}
                    >
                      Back to email
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="text-sm text-center text-muted-foreground w-full">
                  OTP will be sent to your email and valid for 10 minutes
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
