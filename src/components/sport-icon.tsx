import { Activity, CircleDot, Goal, Trophy, Volleyball } from "lucide-react";
import type { Sport } from "@/types/tournament";
export function SportIcon({ icon, size = 24 }: { icon: Sport["icon"]; size?: number }) {
  const props = { size, strokeWidth: 1.9 };
  if (icon === "futsal") return <Goal {...props} />;
  if (icon === "volei") return <Volleyball {...props} />;
  if (icon === "basquete") return <CircleDot {...props} />;
  if (icon === "handebol") return <Activity {...props} />;
  return <Trophy {...props} />;
}
