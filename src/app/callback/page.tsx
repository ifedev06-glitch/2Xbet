// src/app/deposit/callback/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProfile, verifyDeposit, UserProfileResponse } from "@/app/lib/api";

// Separate component that uses useSearchParams
function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState<string>("Verifying payment...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setMessage("No payment reference found.");
      setIsSuccess(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Get current user ID
        const profile: UserProfileResponse = await getProfile();

        // Verify deposit
        const res = await verifyDeposit({
          reference,
          userId: profile.id,
          amount: 0,
        });

        setMessage(res || "Payment verified successfully!");
        setIsSuccess(true);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err) {
        console.error("Deposit verification failed:", err);
        setMessage("Payment verification failed.");
        setIsSuccess(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        {isSuccess === null && <p>{message}</p>}
        {isSuccess === true && <p className="text-green-400 font-semibold">{message}</p>}
        {isSuccess === false && <p className="text-red-400 font-semibold">{message}</p>}
        {isSuccess !== null && <p className="text-sm text-slate-400 mt-2">Redirecting to dashboard...</p>}
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function DepositCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}