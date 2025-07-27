'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Copy,
  ExternalLink,
  Save,
  Loader2,
  Link as LinkIcon,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import Link from 'next/link';

function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  useEffect(() => {
    if (session?.user) {
      fetchAcceptMessages();
    }
  }, [session, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: acceptMessages ? 'Messages Disabled' : 'Messages Enabled',
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  const username = session.user.username || session.user.email;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'Your profile URL has been copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Unable to copy link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your account preferences and privacy settings
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>
                  Your basic account information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Username</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-mono bg-muted px-3 py-2 rounded-lg flex-1">
                        @{username}
                      </span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Account Status</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Verified Account</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Anonymous Message Link</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={profileUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none font-mono"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={copied}
                      >
                        {copied ? (
                          <Mail className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Link href={`/u/${username}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this link to receive anonymous messages
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Privacy Settings</CardTitle>
                </div>
                <CardDescription>
                  Control your privacy and message preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Accept Anonymous Messages</h4>
                        <p className="text-sm text-muted-foreground">
                          Allow others to send you anonymous messages
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={acceptMessages ? "default" : "secondary"}>
                      {acceptMessages ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      {...register('acceptMessages')}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Data Protection</h4>
                    <p className="text-xs text-muted-foreground">
                      All messages are encrypted and your identity is never revealed to senders.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Message Retention</h4>
                    <p className="text-xs text-muted-foreground">
                      You have full control over your messages and can delete them anytime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Theme</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose between light, dark, or system theme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common actions and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start h-auto p-4">
                      <MessageSquare className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">View Messages</div>
                        <div className="text-xs text-muted-foreground">Go to your dashboard</div>
                      </div>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={copyToClipboard}
                  >
                    <LinkIcon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Share Profile</div>
                      <div className="text-xs text-muted-foreground">Copy your message link</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground"
          >
            <p>
              Need help? Check out our{' '}
              <Link href="/help" className="text-primary hover:underline">
                Help Center
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 