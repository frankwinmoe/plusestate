"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

const fetchData = async () => {
  const response = await fetch("/api/dashboard-metrics");
  const data = await response.json();
  return data;
};

interface metricsType {
  title: string;
  trend: string;
  trendValue: number;
  value: number;
  trendDescription: string;
  description: string;
}

export function SectionCards() {
  const [metrics, setMetrics] = useState<metricsType[]>([]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        if (Array.isArray(data)) {
          setMetrics(data);
        } else {
          console.error("API returned non-array data:", data);
          setMetrics([]); // Fallback to empty array
        }
      })
      .catch((error) => {
        console.error("Failed to fetch metrics:", error);
        setMetrics([]); // Fallback to empty array
      });
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((item, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription className="relative">
              <span>{item.title}</span>
              <Badge
                variant="outline"
                className="flex justify-center w-fit rounded-full absolute top-0 right-0"
              >
                {item.trend === "up" ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                {item.trendValue}
              </Badge>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {item.trendDescription}{" "}
              {item.trend === "up" ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">{item.description}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
