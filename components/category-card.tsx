import Link from "next/link";

interface CategoryCardProps {
  id: number;
  name: string;
  icon: string;
}

export function CategoryCard({ id, name, icon }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${name}`}>
      <div className="glass-card rounded-2xl p-6 text-center hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 relative z-10 animate-float-slow">
          {icon}
        </div>
        <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors relative z-10">
          {name}
        </h3>
      </div>
    </Link>
  );
}
