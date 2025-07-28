'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  useEffect(() => {
    // Show notification and redirect after a short delay
    toast({
      title: 'Verification Not Required! 🎉',
      description: 'Your account is automatically verified. You can sign in directly.',
    });

    // Redirect to sign-in after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/sign-in');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 text-center">
          {/* Header */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold gradient-text">AnonChat</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Account Ready! ✅
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Email verification has been disabled. Your account for{' '}
            <span className="font-semibold text-foreground">
              {params.username}
            </span>{' '}
            is automatically verified and ready to use.
          </p>

          <p className="text-sm text-muted-foreground mb-6">
            Redirecting you to sign in page in a few seconds...
          </p>

          <Button 
            onClick={() => router.replace('/sign-in')}
            className="w-full"
          >
            Go to Sign In
          </Button>
        </div>
      </motion.div>
    </div>
  );
}