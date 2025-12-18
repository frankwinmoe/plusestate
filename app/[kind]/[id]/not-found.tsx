import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          ကြော်ငြာ မတွေ့ရှိပါ
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          သင်ရှာဖွေနေသော ကြော်ငြာကို မတွေ့ရှိပါ။ ကြော်ငြာနံပါတ် မှန်ကန်မှု စစ်ဆေးပါ။
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              ပင်မစာမျက်နှာ
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              ရှာဖွေရန်
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

