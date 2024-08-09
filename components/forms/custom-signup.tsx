"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Country codes data (you might want to expand this list)
const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  // Add more country codes as needed
];

// Define the validation schema
const signUpSchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    aboutCompany: z.string().min(1, "Company description is required"),
    agreeToPolicy: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function CustomSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      countryCode: "+1",
      agreeToPolicy: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      companyName: data.companyName,
      phoneNumber: `${data.countryCode}${data.phoneNumber}`,
      email: data.email,
      password: data.password,
      aboutCompany: data.aboutCompany,
      agreeToPolicy: data.agreeToPolicy,
      isGoogleUser: false,
    };

    try {
      const response = await fetch("https://api.echosync.ai/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        router.push("/platform");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    console.log("Google sign-in clicked");
    signIn("google", { callbackUrl: callbackUrl ?? "/business-info" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          Lets Get Your Company Started{" "}
          <span role="img" aria-label="building">
            🏢
          </span>
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Join our platform and grow your business
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input placeholder="Company Name" {...register("companyName")} />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyName.message}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <div className="col-span-2">
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
            </div>
          </div>

          <Input placeholder="Company Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Input
                placeholder="Confirm Password"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

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

          <div className="flex items-center space-x-2">
            <Controller
              name="agreeToPolicy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="agreeToPolicy"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label
              htmlFor="agreeToPolicy"
              className="text-sm font-medium leading-none"
            >
              I agree to the{" "}
              <a href="#" className="text-blue-600">
                Terms of Service and Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.agreeToPolicy && (
            <p className="text-red-500 text-xs mt-1">
              {errors.agreeToPolicy.message}
            </p>
          )}

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
              "Register Company"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full mt-6 bg-white text-gray-700 border border-gray-300 rounded-2xl p-6 flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/" className="text-blue-600">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
