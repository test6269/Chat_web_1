import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, User, Lock, AlertCircle, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginRequest } from "@shared/schema";

interface LoginProps {
  setUser: (user: any) => void;
}

export default function Login({ setUser }: LoginProps) {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setLocation("/chat");
    },
    onError: (error: any) => {
      setError(error.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginRequest) => {
    setError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--whatsapp-bg)]">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 whatsapp-gradient rounded-full mb-4 shadow-lg">
            <MessageCircle className="text-white text-3xl" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--whatsapp-text)] mb-2">Rudra Chats</h1>
          <p className="text-gray-600">Connect and chat in real-time</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-[var(--whatsapp-text)]">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your unique username"
                            className="pl-10 focus:ring-[var(--whatsapp-primary)] focus:border-[var(--whatsapp-primary)]"
                            {...field}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Enter password (hint: 456)"
                            className="pl-10 focus:ring-[var(--whatsapp-primary)] focus:border-[var(--whatsapp-primary)]"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full whatsapp-gradient hover:opacity-90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    <>
                      <LogIn className="mr-2" size={16} />
                      Join Chat Room
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Join the <span className="font-semibold text-[var(--whatsapp-primary)]">"Rudra"</span> chat room
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            <AlertCircle className="inline mr-1" size={14} />
            Demo: Use any username with password <span className="font-mono font-bold">456</span>
          </p>
        </div>
      </div>
    </div>
  );
}
