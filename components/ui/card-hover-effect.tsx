import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

import { useState } from "react";

export const HoverEffect = ({
    items,
    className,
  }: {
    items: {
      title: string;
      description: string;
      username: string;
      avatar: string;
    }[];
    className?: string;
  }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
    return (
      <div
        className={cn(
          "grid md:grid-cols-3 grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 w-[90%] md:w-[80%] mx-auto gap-2 mt-8 text-left",
          className
        )}
      >
        {items.map((item, idx) => (
          <div
            key={item.title}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
                {hoveredIndex === idx && (
                <motion.span
                    className="absolute inset-0 h-full w-full bg-gray-100 dark:bg-muted/30 block  rounded-xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                    }}
                    exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                    }}
                />
                )}
          </AnimatePresence>
  
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  width={40}
                  height={40}
                  src={item.avatar}
                  alt={item.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm font-semibold line-clamp-1">
                  @{item.username}
                </div>
              </div>
              <p className="text-lg font-semibold line-clamp-1">{item.title}</p>
              <p className="text-sm mt-1 line-clamp-3 dark:text-white/80 text-black/80">{item.description}</p>
            </Card>
          </div>
        ))}
      </div>
    );
  };
  

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border cursor-pointer dark:border-gray-700 dark:bg-muted/20 shadow-md",
        className
      )}
    >
      <div className="relative z-10">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};