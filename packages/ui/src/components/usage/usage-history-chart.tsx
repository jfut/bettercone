/**
 * Usage History Chart Component
 * Visualize usage trends over time using Recharts
 * 
 * Three-Tier Pattern:
 * - Tier 1 (Self-Contained): Auto-fetches via AuthUIContext
 * - Tier 2 (Agnostic): Custom authClient prop
 * - Tier 3 (Presentational): Manual data prop (backward compatible)
 */

"use client";

import { useContext, useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { AuthUIContext } from "../../lib/auth-ui-provider";

export interface UsageHistoryEntry {
  date: string;
  value: number;
}

export interface UsageHistoryChartClassNames {
  base?: string;
  header?: string;
  title?: string;
  description?: string;
  content?: string;
  controls?: string;
  button?: string;
  badge?: string;
  skeleton?: string;
}

export interface UsageHistoryChartLocalization {
  USAGE_HISTORY: string;
  USAGE_HISTORY_DESCRIPTION: string;
  LAST_7_DAYS: string;
  LAST_30_DAYS: string;
  LAST_90_DAYS: string;
  LAST_YEAR: string;
  ALL_TIME: string;
  LINE: string;
  BAR: string;
  AREA: string;
  TREND_UP: string;
  TREND_DOWN: string;
  NO_DATA: string;
  LOADING: string;
}

const defaultLocalization: UsageHistoryChartLocalization = {
  USAGE_HISTORY: "Usage History",
  USAGE_HISTORY_DESCRIPTION: "Track your usage trends over time",
  LAST_7_DAYS: "7D",
  LAST_30_DAYS: "30D",
  LAST_90_DAYS: "90D",
  LAST_YEAR: "1Y",
  ALL_TIME: "All",
  LINE: "Line",
  BAR: "Bar",
  AREA: "Area",
  TREND_UP: "Trending up",
  TREND_DOWN: "Trending down",
  NO_DATA: "No data available",
  LOADING: "Loading usage history...",
};

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";
type ChartType = "line" | "bar" | "area";

export interface UsageHistoryChartProps {
  /** 
   * Historical usage data
   * Tier 3 (Presentational): Required if not using authClient or context
   */
  data?: UsageHistoryEntry[];
  
  /**
   * Better Auth client instance
   * Tier 2 (Agnostic): Provide custom authClient with usageTracking plugin
   */
  authClient?: any;
  
  /**
   * Organization ID - defaults to active organization
   * Used when fetching data via context or authClient
   */
  organizationId?: string;
  
  /** Metric type to track (default: "api_calls") */
  metric?: string;
  
  /** Time range to display */
  timeRange?: TimeRange;
  
  /** Chart visualization type */
  chartType?: ChartType;
  
  /** Show time range controls */
  showTimeRangeControls?: boolean;
  
  /** Show chart type controls */
  showChartTypeControls?: boolean;
  
  /** Optional CSS class name */
  className?: string;
  
  /** CSS class names for specific parts */
  classNames?: UsageHistoryChartClassNames;
  
  /** Localization strings */
  localization?: Partial<UsageHistoryChartLocalization>;
}

const chartConfig = {
  value: {
    label: "Usage",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

/**
 * UsageHistoryChart Component
 * 
 * Three-Tier Pattern:
 * 1. Self-Contained: <UsageHistoryChart /> - Auto-fetches via AuthUIContext
 * 2. Agnostic: <UsageHistoryChart authClient={custom} /> - Custom backend
 * 3. Presentational: <UsageHistoryChart data={[...]} /> - Manual data
 * 
 * @example
 * // Tier 1: Self-Contained (Context-based)
 * <AuthUIProvider authClient={authClient}>
 *   <UsageHistoryChart />
 * </AuthUIProvider>
 * 
 * @example
 * // Tier 2: Agnostic (Custom client)
 * <UsageHistoryChart authClient={customAuthClient} />
 * 
 * @example
 * // Tier 3: Presentational (Manual data)
 * <UsageHistoryChart data={[
 *   { date: "2024-01-01", value: 100 },
 *   { date: "2024-01-02", value: 150 }
 * ]} />
 */
export function UsageHistoryChart({
  data: dataProp,
  authClient: authClientProp,
  organizationId,
  metric = "api_calls",
  timeRange: timeRangeProp = "30d",
  chartType: chartTypeProp = "line",
  showTimeRangeControls = true,
  showChartTypeControls = false,
  className,
  classNames,
  localization: localizationProp,
}: UsageHistoryChartProps) {
  const localization = { ...defaultLocalization, ...localizationProp };
  const context = useContext(AuthUIContext);
  
  // State
  const [historyData, setHistoryData] = useState<UsageHistoryEntry[] | undefined>(dataProp);
  const [isPending, setIsPending] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>(timeRangeProp);
  const [chartType, setChartType] = useState<ChartType>(chartTypeProp);
  
  // Determine which authClient to use (context or prop)
  const authClient = authClientProp || context?.authClient;
  
  // Filter data based on time range
  const getFilteredData = (data: UsageHistoryEntry[] | undefined): UsageHistoryEntry[] | undefined => {
    if (!data || data.length === 0) return data;
    
    const now = new Date();
    const daysMap: Record<TimeRange, number | null> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
      "all": null,
    };
    
    const days = daysMap[timeRange];
    if (days === null) return data; // Return all data for "all"
    
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return data.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
  };
  
  // Tier 1 & 2: Fetch from authClient with plugin
  useEffect(() => {
    // Skip if manual data provided (Tier 3)
    if (dataProp) {
      setHistoryData(getFilteredData(dataProp));
      return;
    }
    
    // Skip if no authClient or no plugin
    if (!authClient || !(authClient as any).usageTracking) {
      return;
    }
    
    const fetchHistory = async () => {
      setIsPending(true);
      try {
        const result = await (authClient as any).usageTracking.getUsageHistory({
          organizationId,
          limit: timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : timeRange === "1y" ? 365 : undefined,
        });
        
        if (result?.history) {
          const formattedData = result.history.map((entry: any) => ({
            date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : entry.date,
            value: entry.value || 0,
          }));
          setHistoryData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch usage history:", error);
        setHistoryData([]);
      } finally {
        setIsPending(false);
      }
    };
    
    fetchHistory();
  }, [authClient, organizationId, timeRange, dataProp]);
  
  // Calculate trend
  const trend = historyData && historyData.length > 1
    ? historyData[historyData.length - 1].value - historyData[0].value
    : 0;
  
  return (
    <Card className={cn(className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className={classNames?.title}>{localization.USAGE_HISTORY}</CardTitle>
            <CardDescription className={classNames?.description}>
              {localization.USAGE_HISTORY_DESCRIPTION}
            </CardDescription>
          </div>
          {trend !== 0 && !isPending && historyData && historyData.length > 0 && (
            <Badge variant={trend > 0 ? "default" : "secondary"} className={classNames?.badge}>
              {trend > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {localization.TREND_UP}
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {localization.TREND_DOWN}
                </>
              )}
            </Badge>
          )}
        </div>
        
        {(showTimeRangeControls || showChartTypeControls) && (
          <div className={cn("flex flex-wrap gap-2", classNames?.controls)}>
            {showTimeRangeControls && (
              <div className="flex gap-1">
                {(["7d", "30d", "90d", "1y", "all"] as TimeRange[]).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={classNames?.button}
                  >
                    {range === "7d" && localization.LAST_7_DAYS}
                    {range === "30d" && localization.LAST_30_DAYS}
                    {range === "90d" && localization.LAST_90_DAYS}
                    {range === "1y" && localization.LAST_YEAR}
                    {range === "all" && localization.ALL_TIME}
                  </Button>
                ))}
              </div>
            )}
            
            {showChartTypeControls && (
              <div className="flex gap-1">
                {(["line", "bar", "area"] as ChartType[]).map((type) => (
                  <Button
                    key={type}
                    variant={chartType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType(type)}
                    className={classNames?.button}
                  >
                    {type === "line" && localization.LINE}
                    {type === "bar" && localization.BAR}
                    {type === "area" && localization.AREA}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className={classNames?.content}>
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className={cn("h-8 w-full", classNames?.skeleton)} />
            <Skeleton className={cn("h-8 w-full", classNames?.skeleton)} />
            <Skeleton className={cn("h-8 w-full", classNames?.skeleton)} />
            <Skeleton className={cn("h-8 w-full", classNames?.skeleton)} />
          </div>
        ) : !historyData || historyData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            {localization.NO_DATA}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            {chartType === "bar" ? (
              <BarChart accessibilityLayer data={historyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
              </BarChart>
            ) : chartType === "area" ? (
              <AreaChart accessibilityLayer data={historyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Area
                  dataKey="value"
                  type="monotone"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart accessibilityLayer data={historyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
