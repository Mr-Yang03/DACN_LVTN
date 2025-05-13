import React from "react";

interface CardStatisticProps {
  title: string;
  value: React.ReactNode;
  description: string;
  icon: React.ReactNode;
}

const CardStatistic: React.FC<CardStatisticProps> = ({ title, value, description, icon }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-1/4 m-2" data-v0-t="card">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </div>
    </div>
  );
};

export default CardStatistic;
