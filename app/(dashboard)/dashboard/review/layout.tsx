import { ReviewFooter } from "../../../../components/custom/ReviewFooter";
import ReviewHeader from "../../../../components/custom/ReviewHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="w-full relative  bg-slate-300">
      <div className="flex h-full">
        <main className="w-full pt-5 flex justify-center items-start">
          {children}
        </main>
      </div>
      <ReviewFooter />
    </span>
  );
}
