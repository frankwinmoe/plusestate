"use client";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  listingCode: string;
}

export function CopyButton({ listingCode }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(listingCode);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={handleCopy}
      title="Copy Ad Number"
    >
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </Button>
  );
}

