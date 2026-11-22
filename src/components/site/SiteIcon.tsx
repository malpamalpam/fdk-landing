'use client';

import type { LucideProps } from 'lucide-react';
import {
  Briefcase,
  Laptop,
  Building2,
  Globe,
  Users,
  Sparkles,
  GraduationCap,
  School,
  Building,
  Languages,
  Plane,
  Sun,
  Code2,
  Palette,
  Layout,
  Film,
  Gamepad2,
  ShieldOff,
  Percent,
  FileCheck,
  Calculator,
  Scale,
  DoorOpen,
  MessageCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Briefcase,
  Laptop,
  Building2,
  Globe,
  Users,
  Sparkles,
  GraduationCap,
  School,
  Building,
  Languages,
  Plane,
  Sun,
  Code2,
  Palette,
  Layout,
  Film,
  Gamepad2,
  ShieldOff,
  Percent,
  FileCheck,
  Calculator,
  Scale,
  DoorOpen,
  MessageCircle,
};

export default function SiteIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
