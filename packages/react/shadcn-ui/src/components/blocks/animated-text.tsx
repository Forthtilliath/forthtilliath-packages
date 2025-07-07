"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

// https://berlix.vercel.app/docs/text-split

interface BaseProps {
  variant: "circle" | "reveal" | "ripple" | "scramble" | "split";
  children?: React.ReactNode;
  className?: string;
}

type PropsCircle = BaseProps & {
  variant: "circle";
  duration?: number;
};
type PropsReveal = BaseProps & {
  variant: "reveal";
  blur?: number;
  delay?: number;
  duration?: number;
  from?: "top" | "bottom";
  split?: "word" | "letter";
};
type PropsRipple = BaseProps & {
  maxScale?: number;
  falloff?: number;
};
type PropsScramble = BaseProps & {
  speed?: number;
  characterSet?: string;
};
type PropsSplit = BaseProps & {
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
};

type TextAnimatedProps<T> = Omit<T, "variant" | "children"> & {
  text: string;
};
type Props =
  | PropsCircle
  | PropsReveal
  | PropsRipple
  | PropsScramble
  | PropsSplit;

export function AnimatedText({ variant, children: text, ...props }: Props) {
  if (typeof text !== "string") {
    throw new Error("TextAnimated must have a string child");
  }
  switch (variant) {
    case "circle": {
      return <TextCircle text={text} {...props} />;
    }
    case "reveal":
      return <TextReveal text={text} {...props} />;
    case "ripple":
      return <TextRipple text={text} {...props} />;
    case "scramble":
      return <TextScramble text={text} {...props} />;
    case "split":
      return <TextSplit text={text} {...props} />;
    default:
      return null;
  }
}

export function TextCircle({
  text,
  duration = 20,
  className,
}: TextAnimatedProps<PropsCircle>) {
  const letters = Array.from(text);

  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration,
        ease: "linear",
      }}
      className={cn(
        "relative rounded-full w-[200px] h-[200px] text-zinc-900 dark:text-zinc-50 font-semibold text-center text-2xl",
        className
      )}
    >
      {letters.map((letter, i) => {
        const angle = (360 / letters.length) * i;

        const factor = Number((Math.PI / letters.length).toFixed(0));
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${String(angle)}deg) translate3d(${String(x)}px, ${String(y)}px, 0)`;

        return (
          <span key={i} className="absolute inset-0" style={{ transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}

export const TextReveal = ({
  text,
  className,
  blur = 10,
  delay = 0.1,
  duration = 1,
  from = "bottom",
  split = "word",
}: TextAnimatedProps<PropsReveal>) => {
  const segments = split === "word" ? text.split(" ") : text.split(/(?=.)/);

  return (
    <div>
      {segments.map((c, index) => (
        <motion.span
          key={`${c}-${String(index)}`}
          initial={{
            opacity: 0,
            y: from === "bottom" ? "50%" : "-50%",
            filter: `blur(${String(blur)}px)`,
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: index * delay,
            duration,
            ease: [0.18, 0.89, 0.82, 1.04],
          }}
          className={cn(
            "inline-flex leading-none",
            split === "word" ? "mr-[0.2em]" : "",
            className
          )}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
      <div className="sr-only">{text}</div>
    </div>
  );
};

export function TextRipple({
  text,
  className,
  maxScale = 2,
  falloff = 0.3,
}: TextAnimatedProps<PropsRipple>) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chars = text.split("");

  const getScaleY = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    return Math.max(1, maxScale - distance * falloff);
  };

  return (
    <div className={cn("relative font-bold text-2xl", className)}>
      {chars.map((s, index) => (
        <motion.span
          onMouseEnter={() => {
            setHoveredIndex(index);
          }}
          onMouseLeave={() => {
            setHoveredIndex(null);
          }}
          className="inline-block origin-bottom leading-[0.7]"
          animate={{ scaleY: getScaleY(index) }}
          key={`${s}-${String(index)}`}
        >
          {s === " " ? "\u00A0" : s}
        </motion.span>
      ))}
    </div>
  );
}

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomChar(charSet: string) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

export const TextScramble = ({
  text: textInput,
  speed = 50,
  characterSet = DEFAULT_CHARS,
  className,
  ...motionProps
}: TextAnimatedProps<PropsScramble>) => {
  const [text, setText] = useState(textInput);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      let scrambled = "";

      for (let i = 0; i < textInput.length; i++) {
        if (i < step) {
          scrambled += textInput[i] ?? "";
        } else if (textInput[i] === " ") {
          scrambled += " ";
        } else {
          scrambled += getRandomChar(characterSet) ?? "";
        }
      }

      setText(scrambled);
      step++;

      if (step > textInput.length) {
        clearInterval(interval);
        setText(textInput);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [textInput, speed, characterSet]);

  return (
    <motion.span className={className} {...motionProps}>
      {text}
    </motion.span>
  );
};

export function TextSplit({
  text,
  className,
  topClassName,
  bottomClassName,
  maxMove = 50,
  falloff = 0.3,
}: TextAnimatedProps<PropsSplit>) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getOffset = (index: number) => {
    if (hoverIndex === null) return 0;
    const distance = Math.abs(index - hoverIndex);
    return Math.max(0, maxMove * (1 - distance * falloff));
  };

  return (
    <div
      className={cn("relative flex items-center justify-center ", className)}
    >
      {text.split("").map((char, index) => {
        const offset = getOffset(index);
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <div
            key={`${char}-${String(index)}`}
            className="relative flex flex-col h-[1em] w-auto leading-none"
            onMouseEnter={() => {
              setHoverIndex(index);
            }}
            onMouseLeave={() => {
              setHoverIndex(null);
            }}
          >
            <motion.span
              initial={false}
              animate={{
                y: `-${String(offset)}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", topClassName)}
            >
              {displayChar}
            </motion.span>

            <motion.span
              initial={false}
              animate={{ y: `${String(offset)}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", bottomClassName)}
            >
              <span className="block -translate-y-1/2">{displayChar}</span>
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
