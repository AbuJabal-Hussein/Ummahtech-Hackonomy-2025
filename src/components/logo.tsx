import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  textClassName?: string;
};

export default function Logo({ className, textClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Leaf className="h-6 w-6 text-primary" />
      <span className={cn("text-xl font-bold text-primary font-headline", textClassName)}>
        Barakah Ledger
      </span>
    </Link>
  );
}
