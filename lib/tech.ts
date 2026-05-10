import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiFastapi,
  SiPython,
  SiTailwindcss,
  SiVercel,
  SiFlydotio,
  SiTypescript,
  SiReact,
  SiPostgresql,
  SiOpencv,
  SiNumpy,
  SiFramer,
} from "react-icons/si";

export type TechId =
  | "nextjs"
  | "fastapi"
  | "python"
  | "tailwind"
  | "vercel"
  | "fly"
  | "typescript"
  | "react"
  | "postgres"
  | "opencv"
  | "numpy"
  | "framer";

export const TECH: Record<TechId, { label: string; icon: IconType }> = {
  nextjs: { label: "next.js", icon: SiNextdotjs },
  fastapi: { label: "fastapi", icon: SiFastapi },
  python: { label: "python", icon: SiPython },
  tailwind: { label: "tailwind", icon: SiTailwindcss },
  vercel: { label: "vercel", icon: SiVercel },
  fly: { label: "fly.io", icon: SiFlydotio },
  typescript: { label: "typescript", icon: SiTypescript },
  react: { label: "react", icon: SiReact },
  postgres: { label: "postgres", icon: SiPostgresql },
  opencv: { label: "opencv", icon: SiOpencv },
  numpy: { label: "numpy", icon: SiNumpy },
  framer: { label: "framer motion", icon: SiFramer },
};
