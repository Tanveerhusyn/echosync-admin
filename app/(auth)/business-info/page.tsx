"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2, Star, TrendingUp, MessageCircle, Award } from "lucide-react";

const businessInfoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  aboutCompany: z.string().min(1, "Company description is required"),
});

const ReviewBubble = ({ color, children }) => (
  <div
    className={`${color} rounded-full p-4 shadow-lg flex items-center space-x-2 animate-float`}
  >
    {children}
  </div>
);

export default function BusinessInfo() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessInfoSchema),
  });

  useEffect(() => {
    if (session?.user?.googleProfile) {
      setValue("companyName", session.user.googleProfile.name || "");
    }
  }, [session, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.echosync.ai/users/complete-google-signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            email: session?.user?.email,
            isGoogleUser: true,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Business information saved successfully!");
        await update({
          ...session,
          user: {
            ...session?.user,
            ...result.user,
            needsBusinessInfo: false,
          },
        });
        router.push("/dashboard");
      } else {
        throw new Error(
          result.message || "Failed to save business information",
        );
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //   if (!session) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div className="bg-gradient-to-br from-[#00072D] via-[#0A2472] to-blue-900 w-full h-full min-h-screen grid grid-cols-2 items-center">
      <div className="h-full flex flex-col justify-center items-center text-white p-8 relative overflow-hidden">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <img
                src="/main.svg"
                className="w-48 rounded-full"
                alt="Review Management System"
              />
            </div>
          </div>

          <ReviewBubble color="bg-yellow-400 text-yellow-900 absolute top-0 left-1/4">
            <Star className="w-6 h-6" />
            <span>4.9</span>
          </ReviewBubble>

          <ReviewBubble color="bg-green-400 text-green-900 absolute bottom-1/4 right-0">
            <TrendingUp className="w-6 h-6" />
            <span>+23%</span>
          </ReviewBubble>

          <ReviewBubble color="bg-blue-400 text-blue-900 absolute bottom-0 left-1/4">
            <MessageCircle className="w-6 h-6" />
            <span>2.5k</span>
          </ReviewBubble>

          <ReviewBubble color="bg-purple-400 text-purple-900 absolute top-1/4 left-0">
            <Award className="w-6 h-6" />
            <span>#1</span>
          </ReviewBubble>
        </div>

        <p className="text-xl mt-8 text-center max-w-md">
          Complete your business profile to unlock the full potential of our
          AI-driven platform. Transform feedback into actionable insights and
          boost your reputation.
        </p>
      </div>
      <div className="h-full flex justify-center items-center">
        <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center">
            Complete Your Business Profile{" "}
            <span role="img" aria-label="building">
              🏢
            </span>
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Provide additional information about your company
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input placeholder="Company Name" {...register("companyName")} />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName.message}
              </p>
            )}

            <Input
              placeholder="Phone Number"
              type="tel"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phoneNumber.message}
              </p>
            )}

            <div>
              <Label htmlFor="aboutCompany">Tell us about your company</Label>
              <Textarea
                id="aboutCompany"
                placeholder="Our company ..."
                className="min-h-[100px]"
                {...register("aboutCompany")}
              />
              {errors.aboutCompany && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.aboutCompany.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0A2472] rounded-2xl p-6 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
