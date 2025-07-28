'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, User, Mail, Lock, MessageSquare, ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { motion } from 'framer-motion';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);
  const checkingRef = useRef(false); // Prevent multiple simultaneous checks

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      const currentUsername = debouncedUsername[0];
      
      // Prevent multiple simultaneous checks
      if (checkingRef.current) {
        return;
      }
      
      if (currentUsername && currentUsername.length > 2) {
        checkingRef.current = true;
        setIsCheckingUsername(true);
        setUsernameMessage('');
        
        // Create an AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 10000); // 10 second timeout
        
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${currentUsername}`,
            {
              signal: controller.signal,
              timeout: 10000 // 10 second timeout
            }
          );
          clearTimeout(timeoutId);
          setUsernameMessage(response.data.message);
        } catch (error) {
          clearTimeout(timeoutId);
          const axiosError = error as AxiosError<ApiResponse>;
          
          if (axios.isCancel(error)) {
            setUsernameMessage('Username check timed out. Please try again.');
          } else {
            setUsernameMessage(
              axiosError.response?.data.message ?? 'Error checking username. Please try again.'
            );
          }
        } finally {
          checkingRef.current = false;
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage('');
        setIsCheckingUsername(false);
        checkingRef.current = false;
      }
    };
    
    checkUsernameUnique();
  }, [debouncedUsername[0]]); // Fixed: only depend on the actual debounced value, not the array

  // Auto-reset failsafe for stuck states
  useEffect(() => {
    // Reset isCheckingUsername if it's been stuck for too long
    if (isCheckingUsername) {
      const timeout = setTimeout(() => {
        setIsCheckingUsername(false);
        checkingRef.current = false; // Also reset the ref
        if (!usernameMessage) {
          setUsernameMessage('Username check failed. Please try again.');
        }
      }, 15000); // 15 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [isCheckingUsername]);

  // Additional safeguard: Stop checking if no response after reasonable time
  useEffect(() => {
    if (isCheckingUsername && username.length > 2) {
      const emergencyTimeout = setTimeout(() => {
        setIsCheckingUsername(false);
        checkingRef.current = false;
        setUsernameMessage('Check timed out. Please try a different username.');
      }, 8000); // 8 seconds emergency timeout
      
      return () => clearTimeout(emergencyTimeout);
    }
  }, [isCheckingUsername, username]);

  useEffect(() => {
    // Reset isSubmitting if it's been stuck for too long
    if (isSubmitting) {
      const timeout = setTimeout(() => {
        setIsSubmitting(false);
      }, 45000); // 45 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [isSubmitting]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 second timeout
    
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data, {
        signal: controller.signal,
        timeout: 30000 // 30 second timeout
      });

      clearTimeout(timeoutId);
      
      toast({
        title: 'Account Created! 🎉',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      clearTimeout(timeoutId);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = 'There was a problem with your sign-up. Please try again.';
      
      if (axios.isCancel(error)) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (axiosError.response?.data.message) {
        errorMessage = axiosError.response.data.message;
      }

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUsernameStatus = () => {
    // If currently checking and username is valid length
    if (isCheckingUsername && username.length > 2) {
      return { icon: null, className: "text-muted-foreground", message: "Checking availability..." };
    }
    
    // If username is too short, show nothing
    if (username.length <= 2) {
      return null;
    }
    
    // If we have a positive response
    if (usernameMessage === 'Username is unique') {
      return { icon: CheckCircle, className: "text-green-500", message: "Username available!" };
    }
    
    // If we have an error response
    if (usernameMessage && usernameMessage !== 'Username is unique') {
      return { icon: XCircle, className: "text-red-500", message: usernameMessage };
    }
    
    // Default state - no icon
    return null;
  };

  const isFormValid = () => {
    const formErrors = Object.keys(form.formState.errors).length > 0;
    const hasUsername = username.length > 2;
    const usernameAvailable = usernameMessage === 'Username is unique';
    const notCheckingUsername = !isCheckingUsername;
    const notBlocked = !checkingRef.current;
    
    return !formErrors && hasUsername && usernameAvailable && notCheckingUsername && notBlocked;
  };

  // Add debugging reset function
  const resetFormState = () => {
    setIsSubmitting(false);
    setIsCheckingUsername(false);
    setUsernameMessage('');
    checkingRef.current = false; // Also reset the ref
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background - Fixed pointer events */}
      <div className="absolute inset-0 gradient-bg opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-background to-background dark:from-purple-900/20 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageSquare className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold gradient-text">AnonChat</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              Join the Community
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              Create your account and start messaging anonymously right away
            </motion.p>
          </div>

          {/* Form */}
          <Form {...form}>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Username</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Choose a unique username"
                        className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                      {(() => {
                        const status = getUsernameStatus();
                        if (!status) return null;
                        
                        // Only render icon if it exists
                        if (status.icon) {
                          const StatusIcon = status.icon;
                          return (
                            <div className="absolute right-3 top-3">
                              <StatusIcon className={`h-4 w-4 ${status.className}`} />
                            </div>
                          );
                        }
                        
                        return null;
                      })()}
                    </div>
                    {(() => {
                      const status = getUsernameStatus();
                      if (!status) return null;
                      return (
                        <p className={`text-sm ${status.className}`}>
                          {status.message}
                        </p>
                      );
                    })()}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 h-12 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll use this for your account recovery
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </Form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            🔒 Your privacy is our priority • 100% anonymous messaging
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
