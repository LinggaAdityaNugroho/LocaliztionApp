import { Badge } from "../ui/badge";

export const ConditionBadge = ({
  kondisi,
  isConsumable,
}: {
  kondisi: string;
  isConsumable: boolean;
}) => {
  const currentCondition = isConsumable ? "Baik" : kondisi;
  const isBaik = currentCondition.toLowerCase() === "baik";

  return (
    <Badge
      variant="outline"
      className={`gap-2 px-3 py-1 rounded-lg font-semibold ${
        isBaik
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-orange-50 text-orange-700 border-orange-200"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${isBaik ? "bg-green-500" : "bg-orange-500"}`}
      />
      {currentCondition}
    </Badge>
  );
};
