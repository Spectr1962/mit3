"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const data = [
  { name: "Янв", value: 400 },
  { name: "Фев", value: 300 },
  { name: "Мар", value: 600 },
  { name: "Апр", value: 800 },
  { name: "Май", value: 700 },
];

export function DashboardOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Аналитика конверсий</CardTitle>
        <CardDescription>Динамика просмотров и выполнения целевых услуг</CardDescription>
      </CardHeader>
      <CardContent className="h-[240px] pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="conversion-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#10283b", border: "1px solid rgba(255,255,255,.12)", borderRadius: "8px" }} />
            <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#conversion-fill)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
