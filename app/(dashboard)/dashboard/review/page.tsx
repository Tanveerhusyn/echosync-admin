"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, LayoutGrid, List, Zap } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewTableNew } from "@/components/tables/employee-tables/employee-table";
const items = [
  {
    name: "Alex Johnson",
    quote:
      "This service was absolutely amazing! Highly recommend to anyone looking for top-notch quality.",
    title: "CEO of Innovate Ltd.",
    platform: "google",
  },
  {
    name: "Samantha Bloom",
    quote:
      "A game changer in our industry. The attention to detail and customer service is unmatched.",
    title: "Director of Operations at Tech Solutions",
    platform: "yelp",
  },
  {
    name: "Raj Patel",
    quote:
      "Truly impressed by the professionalism and the speed of service. Will be returning for sure.",
    title: "Founder of Creative Minds",
    platform: "google",
  },
  {
    name: "Emily Carter",
    quote:
      "From start to finish, the process was seamless. It's rare to find a service that truly delivers on every front.",
    title: "Marketing Manager at BrandWorks",
    platform: "yelp",
  },
  {
    name: "Michael Lee",
    quote:
      "Exceptional experience. The team went above and beyond to meet our needs. A+ service!",
    title: "Product Lead at NextGen Innovations",
    platform: "google",
  },
  {
    name: "Jessica Diaz",
    quote:
      "Fantastic work! The project exceeded our expectations and was delivered ahead of schedule.",
    title: "Head of Design at Creativa Studio",
    platform: "yelp",
  },
  {
    name: "Daniel Smith",
    quote:
      "Efficient, professional, and friendly. Can't ask for more. Highly recommended!",
    title: "Project Manager at BuildRight",
    platform: "google",
  },
  {
    name: "Laura Williams",
    quote:
      "Their expertise is evident in the quality of their work. Very satisfied with the outcome.",
    title: "CEO of FreshStart",
    platform: "yelp",
  },
  {
    name: "James Gonzalez",
    quote:
      "A pleasure to work with. They really understand the needs of their clients and deliver accordingly.",
    title: "Operations Manager at Logistics Inc.",
    platform: "google",
  },
  {
    name: "Karen Thompson",
    quote:
      "Remarkable service! They really go the extra mile to ensure customer satisfaction.",
    title: "Creative Director at Visionary Art",
    platform: "yelp",
  },
];

const Review = () => {
  return (
    <div className="scroller  relative z-20 h-[100vh] w-[90%] overflow-auto ">
      <ReviewTableNew />
    </div>
  );
};

export default Review;
