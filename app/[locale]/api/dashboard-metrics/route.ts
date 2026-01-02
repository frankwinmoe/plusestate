import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setSeconds(-1);

    // Fetch total listings for current and previous month
    const { count: currentListings } = await supabase
      .from("listings")
      .select("id", { count: "exact" })
      .gte("created_at", currentMonthStart.toISOString());

    const { count: previousListings } = await supabase
      .from("listings")
      .select("id", { count: "exact" })
      .gte("created_at", previousMonthStart.toISOString())
      .lte("created_at", previousMonthEnd.toISOString());

    const listingTrend = calculateTrend(currentListings, previousListings);

    // Fetch total views for current and previous month
    const { data: currentViewsData } = await supabase
      .from("listing_views")
      .select("id")
      .gte("created_at", currentMonthStart.toISOString());

    const { data: previousViewsData } = await supabase
      .from("listing_views")
      .select("id")
      .gte("created_at", previousMonthStart.toISOString())
      .lte("created_at", previousMonthEnd.toISOString());

    const currentViews = currentViewsData?.length || 0;
    const previousViews = previousViewsData?.length || 0;
    const viewsTrend = calculateTrend(currentViews, previousViews);

    // Construct metrics
    const metrics = [
      {
        title: "Total Listings",
        value: currentListings || 0,
        description: "Total number of properties listed this month.",
        trend: listingTrend.trend,
        trendValue: listingTrend.trendValue,
        trendDescription: listingTrend.description,
      },
      {
        title: "Total Views",
        value: currentViews,
        description: "Total number of views this month.",
        trend: viewsTrend.trend,
        trendValue: viewsTrend.trendValue,
        trendDescription: viewsTrend.description,
      },
    ];

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics." },
      { status: 500 },
    );
  }
}

function calculateTrend(current: number | null, previous: number | null) {
  if (previous === 0) {
    return {
      trend: "up",
      trendValue: 100,
      description: "Significant increase compared to last month.",
    };
  }

  const trendValue =
    current !== null && previous !== null
      ? ((current - previous) / previous) * 100
      : 0;
  return {
    trend: trendValue >= 0 ? "up" : "down",
    trendValue: Math.abs(trendValue).toFixed(1),
    description:
      trendValue >= 0
        ? `Increased by ${Math.abs(trendValue).toFixed(1)}% compared to last month.`
        : `Decreased by ${Math.abs(trendValue).toFixed(1)}% compared to last month.`,
  };
}
