'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

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

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
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

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;


// 'use client';

// import React, { useCallback, useEffect, useState } from 'react';
// // Assuming useSession, axios, useForm, zodResolver, MessageCard, Button, Separator, Switch, useToast, Message, ApiResponse, AcceptMessageSchema, z, Loader2, RefreshCcw, User are imported/defined elsewhere in the actual project setup.
// // For this standalone React component, I'll simulate these imports or assume they are available in the environment.

// // Mock imports for demonstration purposes (replace with actual imports in a Next.js project)
// const useSession = () => ({ data: { user: { username: 'johndoe' } } }); // Mock session
// const axios = {
//   get: async (url: string) => {
//     if (url === '/api/accept-messages') return { data: { isAcceptingMessages: true } };
//     if (url === '/api/get-messages') return { data: { messages: [
//       { _id: '1', content: 'Hello there!', createdAt: new Date().toISOString() },
//       { _id: '2', content: 'Great job!', createdAt: new Date(Date.now() - 86400000).toISOString() },
//       { _id: '3', content: 'Keep up the good work!', createdAt: new Date(Date.now() - 172800000).toISOString() },
//     ]} };
//     return { data: {} };
//   },
//   post: async (url: string, data: any) => {
//     if (url === '/api/accept-messages') return { data: { message: 'Message settings updated successfully' } };
//     return { data: {} };
//   },
// };
// const useForm = () => ({
//   register: () => ({}),
//   watch: (field: string) => field === 'acceptMessages' ? true : false, // Mock watch
//   setValue: () => {},
// });
// const zodResolver = (schema: any) => {}; // Mock zodResolver
// const MessageCard = ({ message, onMessageDelete }: { message: any, onMessageDelete: (id: string) => void }) => (
//   <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-transform hover:scale-105 duration-300">
//     <p className="text-gray-800 text-lg mb-2">{message.content}</p>
//     <p className="text-gray-500 text-sm mb-4">{new Date(message.createdAt).toLocaleString()}</p>
//     <button
//       onClick={() => onMessageDelete(message._id)}
//       className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
//     >
//       Delete
//     </button>
//   </div>
// );
// const Button = ({ children, onClick, variant, title, disabled }: { children: React.ReactNode, onClick?: () => void, variant?: string, title?: string, disabled?: boolean }) => (
//   <button
//     onClick={onClick}
//     title={title}
//     disabled={disabled}
//     className={`
//       ${variant === 'outline' ? 'bg-white border border-purple-500 text-purple-600 hover:bg-purple-50' : 'bg-purple-600 hover:bg-purple-700 text-white'}
//       font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
//     `}
//   >
//     {children}
//   </button>
// );
// const Separator = () => <div className="my-8 border-t border-gray-200"></div>;
// const Switch = ({ checked, onCheckedChange, disabled, ...props }: { checked: boolean, onCheckedChange: (checked: boolean) => void, disabled: boolean, [key: string]: any }) => (
//   <label className="relative inline-flex items-center cursor-pointer">
//     <input
//       type="checkbox"
//       checked={checked}
//       onChange={(e) => onCheckedChange(e.target.checked)}
//       disabled={disabled}
//       className="sr-only peer"
//       {...props}
//     />
//     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
//   </label>
// );
// const useToast = () => ({ toast: (options: { title: string, description?: string, variant?: string }) => console.log('Toast:', options.title, options.description) });
// const Loader2 = ({ className }: { className?: string }) => <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
// const RefreshCcw = ({ className }: { className?: string }) => <svg className={`h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12v1a8 8 0 0015.356 2m-6.356-2H14V7"></path></svg>;

// type Message = {
//   _id: string;
//   content: string;
//   createdAt: string;
// };

// type ApiResponse = {
//   success: boolean;
//   message: string;
//   isAcceptingMessages?: boolean;
//   messages?: Message[];
// };

// // Mock Zod schema for AcceptMessageSchema
// const AcceptMessageSchema = {
//   parse: (data: any) => data, // Simple mock, replace with actual zod schema parsing
// };
// type AcceptMessageForm = {
//   acceptMessages: boolean;
// };

// type User = {
//   username: string;
// }

// function UserDashboard() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);
//   const [profileUrl, setProfileUrl] = useState('');

//   const { toast } = useToast();
//   const { data: session } = useSession();

//   const form = useForm<AcceptMessageForm>({
//     resolver: zodResolver(AcceptMessageSchema),
//   });

//   const { register, watch, setValue } = form;
//   const acceptMessages = watch('acceptMessages');

//   const handleDeleteMessage = (messageId: string) => {
//     setMessages((prev) => prev.filter((message) => message._id !== messageId));
//   };

//   const fetchAcceptMessages = useCallback(async () => {
//     setIsSwitchLoading(true);
//     try {
//       const response = await axios.get<ApiResponse>('/api/accept-messages');
//       setValue('acceptMessages', response.data.isAcceptingMessages ?? false); // Default to false if undefined
//     } catch (error: any) {
//       // const axiosError = error as AxiosError<ApiResponse>; // Keep this for actual Next.js project
//       toast({
//         title: 'Error',
//         description: error.response?.data?.message ?? 'Failed to fetch message settings',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   }, [setValue, toast]);

//   const fetchMessages = useCallback(
//     async (refresh: boolean = false) => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get<ApiResponse>('/api/get-messages');
//         setMessages(response.data.messages || []);
//         if (refresh) {
//           toast({
//             title: 'Refreshed Messages',
//             description: 'Showing latest messages',
//           });
//         }
//       } catch (error: any) {
//         // const axiosError = error as AxiosError<ApiResponse>; // Keep this for actual Next.js project
//         toast({
//           title: 'Error',
//           description: error.response?.data?.message ?? 'Failed to fetch messages',
//           variant: 'destructive',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [toast]
//   );

//   useEffect(() => {
//     if (!session || !session.user) return;

//     fetchMessages();
//     fetchAcceptMessages();

//     if (typeof window !== 'undefined') {
//       const { username } = session.user as User;
//       const baseUrl = `${window.location.protocol}//${window.location.host}`;
//       setProfileUrl(`${baseUrl}/u/${username}`);
//     }
//   }, [session, fetchMessages, fetchAcceptMessages]);

//   const handleSwitchChange = async () => {
//     try {
//       const response = await axios.post<ApiResponse>('/api/accept-messages', {
//         acceptMessages: !acceptMessages,
//       });
//       setValue('acceptMessages', !acceptMessages);
//       toast({
//         title: response.data.message,
//         variant: 'default',
//       });
//     } catch (error: any) {
//       // const axiosError = error as AxiosError<ApiResponse>; // Keep this for actual Next.js project
//       toast({
//         title: 'Error',
//         description: error.response?.data?.message ?? 'Failed to update message settings',
//         variant: 'destructive',
//       });
//     }
//   };

//   const copyToClipboard = () => {
//     // navigator.clipboard.writeText(profileUrl); // Use this in a real browser environment
//     document.execCommand('copy'); // Fallback for iFrame
//     toast({
//       title: 'URL Copied!',
//       description: 'Profile URL has been copied to clipboard.',
//     });
//   };

//   if (!session || !session.user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 font-inter">
//         <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
//           <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading user dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center py-12 font-inter">
//       <div className="mx-4 md:mx-8 lg:mx-auto p-8 bg-white rounded-2xl w-full max-w-6xl shadow-xl border border-gray-200">
//         {/* Page Title */}
//         <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
//           Mystery Message Dashboard
//         </h1>

//         {/* Copy Link Section */}
//         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
//           <h2 className="text-xl font-bold mb-4 text-gray-800">Share Your Link</h2>
//           <p className="text-gray-600 mb-4">
//             Share this unique link with your friends to receive anonymous messages!
//           </p>
//           <div className="flex flex-col sm:flex-row items-center gap-4">
//             <input
//               type="text"
//               value={profileUrl}
//               disabled
//               className="flex-grow w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
//             />
//             <Button onClick={copyToClipboard}>
//               Copy Link
//             </Button>
//           </div>
//         </div>

//         <Separator />

//         {/* Switch to Accept Messages */}
//         <div className="my-8 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
//           <div className="flex items-center">
//             <Switch
//               {...register('acceptMessages')}
//               checked={acceptMessages}
//               onCheckedChange={handleSwitchChange}
//               disabled={isSwitchLoading}
//             />
//             <span className="ml-3 text-lg text-gray-800 font-medium">
//               Accepting Messages: <strong className={acceptMessages ? 'text-green-600' : 'text-red-600'}>
//                 {acceptMessages ? 'On' : 'Off'}
//               </strong>
//             </span>
//           </div>
//           {isSwitchLoading && <Loader2 className="h-5 w-5 animate-spin text-purple-600 ml-4" />}
//         </div>

//         <Separator />

//         {/* Messages Section Header */}
//         <div className="mt-8 flex items-center justify-between mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">Your Messages</h2>
//           <Button
//             variant="outline"
//             title="Refresh Messages"
//             onClick={(e) => {
//               e.preventDefault();
//               fetchMessages(true);
//             }}
//           >
//             {isLoading ? (
//               <Loader2 className="h-5 w-5 animate-spin mr-2" />
//             ) : (
//               <RefreshCcw className="h-5 w-5 mr-2" />
//             )}
//             Refresh
//           </Button>
//         </div>

//         {/* Messages Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {messages.length > 0 ? (
//             messages.map((message) => (
//               <MessageCard
//                 key={message._id}
//                 message={message}
//                 onMessageDelete={handleDeleteMessage}
//               />
//             ))
//           ) : (
//             <p className="text-gray-500 text-lg col-span-full text-center py-10">
//               No messages to display. Share your link to start receiving messages!
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;
