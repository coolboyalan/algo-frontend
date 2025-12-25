"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RefreshButton() {
    const router = useRouter();

    return (
        <Button
            variant="outline"
            size="sm"
            className="hover:bg-gray-100"
            onClick={() => router.refresh()}
        >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
        </Button>
    );
}

interface BrokerLoginButtonProps {
    brokerName: string;
    loginUrl?: string;
}

export function BrokerLoginButton({ brokerName, loginUrl }: BrokerLoginButtonProps) {
    // Check if current time is within trading hours (8:30 AM to 3:00 PM IST)
    const isTradingHours = () => {
        const now = new Date();
        const istTime = new Date(
            now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        const hours = istTime.getHours();
        const minutes = istTime.getMinutes();
        const currentTime = hours * 60 + minutes;
        const startTime = 8 * 60 + 30; // 8:30 AM
        const endTime = 15 * 60; // 3:00 PM
        return currentTime >= startTime && currentTime < endTime;
    };

    const handleLogin = () => {
        if (!isTradingHours()) {
            toast.error("Trading is only allowed between 8:30 AM and 3:00 PM IST", {
                description: "Please try again during market hours",
            });
            return;
        }

        if (loginUrl) {
            window.open(loginUrl, "_blank");
            toast.success(`Opening ${brokerName} login page...`);
        } else {
            toast.info("Login URL not configured for this broker key.");
        }
    };

    return (
        <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!isTradingHours() || !loginUrl}
        >
            Login to Broker
        </Button>
    );
}
