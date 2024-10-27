"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
/* eslint-disable */
const page = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const [check, setCheck] = useState(false);

  const checkMessage = async () => {
    const response = await axios.get<ApiResponse>("/api/accept-messages");
    setCheck(response.data.isAcceptingMessage as boolean);
  };

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    await checkMessage();
    if (false) {
    } else {
      setIsSubmitting(true);
      try {
        const response = await axios.post<ApiResponse>("/api/send-message", {
          ...data,
          username,
        });
        toast({
          title: "Message Send",
          description: response.data.message,
        });
      } catch (error) {
        console.error("Error in sign up of user", error);
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage =
          axiosError.response?.data.message || "Failed to sent message";
        toast({
          title: "Failed to Send Message",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="text-4xl">
                <FormLabel className="font-bold text-lg">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={checkMessage}
                type="submit"
                disabled={isSubmitting}
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
