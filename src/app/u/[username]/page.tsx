'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, MessageSquare, Sparkles, RefreshCw, UserCircle, ArrowRight, Bot, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompletion } from 'ai/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MessageSchema } from '@/schemas/messageSchema';
import { motion } from 'framer-motion';
import { useUserActivity } from '@/hooks/useUserActivity';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?||What's something you've always wanted to try?||What makes you genuinely happy?||If you could travel anywhere, where would you go?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  
  // User activity tracking
  const { getActivityColor, getActivityText } = useUserActivity({
    timeout: 2 * 60 * 1000, // 2 minutes for demo purposes (normally would be 5+ minutes)
    throttle: 500
  });

  // Message suggestions state
  const [completion, setCompletion] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // AI Generation State
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // AI Generation Options State
  const [aiOptions, setAiOptions] = useState({
    tone: 'friendly',
    length: 'medium',
    messageType: 'general',
    topic: ''
  });

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const handleAiGenerate = async () => {
    setIsGeneratingMessage(true);
    setGenerateError(null);
    setGeneratedMessage('');
    
    try {
      console.log('Generate button clicked with options:', aiOptions);
      
      const response = await axios.post('/api/generate-message', aiOptions);
      
      // Handle JSON response
      if (response.data && response.data.message) {
        setGeneratedMessage(response.data.message);
        console.log('Message generated successfully:', response.data.message);
      } else {
        throw new Error('No message received from API');
      }
    } catch (error) {
      console.error('Error generating message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setGenerateError(errorMessage);
      
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleUseGeneratedMessage = () => {
    if (generatedMessage.trim()) {
      form.setValue('content', generatedMessage.trim());
      toast({
        title: 'Message Added! ✨',
        description: 'AI-generated message has been added to your form.',
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: 'Message Sent! 🎉',
        description: 'Your anonymous message has been delivered successfully.',
      });
      
      form.reset({ ...form.getValues(), content: '' });
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to Send',
        description:
          axiosError.response?.data.message ?? 'Unable to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/suggest-messages');
      
      if (response.data && response.data.message) {
        setCompletion(response.data.message);
      } else {
        throw new Error('No suggestions received from API');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load suggestions';
      setError(errorMessage);
      
      toast({
        title: 'Unable to Load Suggestions',
        description: 'Please try refreshing the suggestions.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Load initial suggestions on component mount
  useEffect(() => {
    fetchSuggestedMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
                <UserCircle className="h-10 w-10 text-primary-foreground" />
              </div>
              {/* Dynamic activity status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getActivityColor()} rounded-full border-2 border-background flex items-center justify-center`}>
                <div className={`w-2 h-2 ${getActivityColor()} rounded-full animate-pulse`}></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Send Anonymous Message to{' '}
            <span className="gradient-text">@{username}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your thoughts anonymously and safely
          </p>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Badge variant="secondary" className="text-sm">
              <MessageSquare className="w-3 h-3 mr-1" />
              100% Anonymous
            </Badge>
            <Badge variant="secondary" className="text-sm">
              🔒 Secure & Private
            </Badge>
            <Badge variant={getActivityText() === 'Active' ? 'default' : 'secondary'} className="text-sm">
              <div className={`w-2 h-2 ${getActivityColor()} rounded-full mr-2`}></div>
              {getActivityText()}
            </Badge>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-primary" />
                <span>Your Anonymous Message</span>
              </CardTitle>
              <CardDescription>
                Write your message below. Your identity will remain completely anonymous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here... Be kind and respectful! 😊"
                            className="min-h-[120px] resize-none text-base bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className="text-sm text-muted-foreground">
                            {messageContent?.length || 0}/500 characters
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-center"
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || !messageContent?.trim() || messageSent}
                      size="lg"
                      className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : messageSent ? (
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5" />
                          <span>Message Sent!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="h-5 w-5" />
                          <span>Send Anonymous Message</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Message Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Gemini AI Generator</span>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini 1.5
                </Badge>
              </CardTitle>
              <CardDescription>
                Let Google&apos;s Gemini AI help you craft the perfect anonymous message with customizable options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Type</label>
                  <Select
                    value={aiOptions.messageType}
                    onValueChange={(value) => setAiOptions(prev => ({ ...prev, messageType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Message</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="compliment">Compliment</SelectItem>
                      <SelectItem value="confession">Confession</SelectItem>
                      <SelectItem value="advice">Advice</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select
                    value={aiOptions.tone}
                    onValueChange={(value) => setAiOptions(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="encouraging">Encouraging</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="thoughtful">Thoughtful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Length</label>
                  <Select
                    value={aiOptions.length}
                    onValueChange={(value) => setAiOptions(prev => ({ ...prev, length: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (2-4 sentences)</SelectItem>
                      <SelectItem value="long">Long (4-6 sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic (Optional)</label>
                  <Input
                    placeholder="e.g., friendship, dreams, hobbies..."
                    value={aiOptions.topic}
                    onChange={(e) => setAiOptions(prev => ({ ...prev, topic: e.target.value }))}
                    className="bg-background/50"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={handleAiGenerate}
                  disabled={isGeneratingMessage}
                  size="lg"
                  className="px-8"
                  variant="outline"
                >
                  {isGeneratingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  {isGeneratingMessage ? 'Generating...' : 'Generate Message'}
                </Button>
              </div>

              {/* Generated Message Display */}
              {generatedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="p-4 bg-background/70 rounded-lg border border-primary/20">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-primary">Generated Message:</span>
                      <Button
                        onClick={handleUseGeneratedMessage}
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Use This
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed">{generatedMessage}</p>
                  </div>
                </motion.div>
              )}

              {generateError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-sm text-destructive">
                      Failed to generate message: {generateError}
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggested Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>Message Suggestions</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                >
                  {isSuggestLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
              <CardDescription>
                Click on any suggestion to use it as your message
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-destructive text-sm">Unable to load suggestions</p>
                  <Button variant="outline" size="sm" onClick={fetchSuggestedMessages} className="mt-2">
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {parseStringMessages(completion).map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="h-auto min-h-[60px] p-4 text-left w-full justify-start hover:bg-primary/5 hover:border-primary/20 transition-all"
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                          <span className="text-sm leading-relaxed break-words hyphens-auto text-left overflow-hidden whitespace-pre-wrap max-w-full">{message.trim()}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-3">Want Your Own Message Board?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your account and start receiving anonymous messages from your friends and followers.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="px-8">
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>
            🔒 Your messages are completely anonymous and secure • 
            <Link href="/privacy" className="hover:text-foreground transition-colors ml-1">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}