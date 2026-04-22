"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Clock, 
  Briefcase, 
  AlertCircle 
} from "lucide-react";
import { TodayOverview } from "../../types";

interface AdminStatCardsProps {
  today?: TodayOverview;
}

export function AdminStatCards({ today }: AdminStatCardsProps) {
  const cards = [
    {
      icon: <Users className="text-blue-600" />,
      label: "Tổng nhân sự",
      value: today?.total_employees || 0,
      bgColor: "bg-blue-50",
    },
    {
      icon: <UserCheck className="text-emerald-600" />,
      label: "Đã chấm công",
      value: today?.present || 0,
      bgColor: "bg-emerald-50",
    },
    {
      icon: <UserMinus className="text-rose-600" />,
      label: "Vắng mặt",
      value: today?.absent || 0,
      bgColor: "bg-rose-50",
    },
    {
      icon: <Briefcase className="text-violet-600" />,
      label: "Đang nghỉ phép",
      value: today?.on_leave || 0,
      bgColor: "bg-violet-50",
    },
    {
      icon: <Clock className="text-amber-600" />,
      label: "Đi muộn",
      value: today?.late || 0,
      bgColor: "bg-amber-50",
    },
    {
      icon: <AlertCircle className="text-orange-600" />,
      label: "Về sớm",
      value: today?.early_leave || 0,
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", card.bgColor)}>
              {card.icon}
            </div>
            <div>
              <Typography variant="h4" className="text-2xl font-black text-slate-900">
                {card.value}
              </Typography>
              <Typography variant="tiny" className="text-slate-500 font-medium block mt-0.5">
                {card.label}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
