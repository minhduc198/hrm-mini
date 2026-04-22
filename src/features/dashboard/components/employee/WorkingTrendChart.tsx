import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { WorkingTrend } from "../../types";

interface WorkingTrendChartProps {
  trends: WorkingTrend[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WorkingTrend;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        <Typography variant="label-sm" className="text-slate-300 block mb-1">
          {data.label}
        </Typography>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <Typography variant="tiny" className="text-slate-400">
              Thực tế:
            </Typography>
            <Typography variant="tiny" className="text-emerald-400 font-bold">
              {data.total_hours}h
            </Typography>
          </div>
          <div className="flex justify-between gap-4">
            <Typography variant="tiny" className="text-slate-400">
              Mục tiêu:
            </Typography>
            <Typography variant="tiny" className="text-slate-300">
              {data.total_required_hours}h
            </Typography>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-700 pt-1 mt-1">
            <Typography variant="tiny" className="text-slate-400">
              Số ngày:
            </Typography>
            <Typography variant="tiny" className="text-slate-200">
              {data.days_present} ngày
            </Typography>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function WorkingTrendChart({ trends }: WorkingTrendChartProps) {
  return (
    <Card className="lg:col-span-2 shadow-sm border-none bg-slate-50/50 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <CardTitle className="text-md font-bold">
              Xu hướng làm việc (6 tháng)
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <Typography
                variant="tiny"
                className="text-[10px] text-muted-foreground"
              >
                Giờ làm việc
              </Typography>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full mt-4">
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  domain={[
                    0,
                    (dataMax: number) => {
                      const maxRequired = Math.max(
                        ...trends.map((t) => t.total_required_hours),
                        0,
                      );
                      return Math.max(dataMax, maxRequired, 40);
                    },
                  ]}
                />


                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.02)", radius: 8 }}
                />
                <Bar
                  dataKey="total_hours"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  animationDuration={1500}
                >
                  {trends.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="var(--primary)"
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <BarChart3 size={40} className="opacity-10" />
              <Typography variant="tiny" className="text-xs">
                Không có dữ liệu xu hướng
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
