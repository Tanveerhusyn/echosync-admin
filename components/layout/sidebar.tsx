import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowBigDown, ChevronDown, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export default function Sidebar() {
  return (
    <nav
      className={cn(
        `relative  hidden h-screen border-r pt-16 lg:block w-80 bg-white`,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2 ">
          {/* <div className="flex justify-start relative items-center bg-white  p-4 rounded-[20px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="border border-gray-500 text-white w-full h-full  bg-blue-600">
                  <Avatar>
                    <AvatarImage src="/avatar.jpg" alt="Tanveer" />
                    <AvatarFallback className="text-white">T</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-sm font-semibold text-white">
                      Tanveer Hussain
                    </p>
                    <p className="text-xs text-white">
                      Marketing Administrator
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuContent>Hi</DropdownMenuContent>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
          <div className="space-y-1">
            <DashboardNav items={navItems} />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="absolute h-[50px] border border-black bg-transparent text-black  rounded-lg bottom-2 w-full max-w-[250px]">
                <Settings size={16} />
                <span className="ml-2 ">Connect</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate Review</DialogTitle>
                <div className="border border-slate-300 rounded-lg px-4 py-4">
                  <div className="flex items-center mb-2">
                    <img
                      className="h-10 w-10 rounded-full mr-2"
                      src="/ukn.svg"
                      alt="Reviewer avatar"
                    />
                    <div>
                      <span className="font-medium">John Doe</span>
                      <span className="text-slate-500 text-sm ml-1">4.5/5</span>
                    </div>
                  </div>
                  <p className="text-slate-700">
                    This product is amazing! It exceeded my expectations and was
                    very easy to use. I would highly recommend it to anyone
                    looking for a similar product.
                  </p>
                </div>
              </DialogHeader>

              <form>
                <div className="mb-4 w-full max-w-3xl rounded-lg bg-slate-200 dark:bg-slate-900">
                  <div className="rounded-lg rounded-b-none border border-slate-300 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800">
                    <label htmlFor="prompt-input" className="sr-only">
                      Enter your prompt
                    </label>
                    <textarea
                      id="prompt-input"
                      rows="4"
                      className="w-full border-0 bg-slate-50 px-0 text-base text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
                      placeholder="Enter your prompt"
                      required
                      value={`Dear John, Thank you for your review! We are glad to hear that you enjoyed our product. We are always looking for ways to improve our products and services, so your feedback is greatly appreciated. If you have any suggestions or concerns, please feel free to share them with us. We look forward to serving you again in the future.`}
                    ></textarea>
                  </div>
                  <div className="ml-2 flex items-center py-2">
                    <div>
                      <Button variant="review" type="submit">
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
