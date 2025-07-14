import Image, { type ImageProps } from "next/image";

import { Show } from "@forthtilliath/react-ui/show";
import { AnimatedText } from "@forthtilliath/shadcn-ui/components/blocks/animated-text";

import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <AnimatedText variant="circle" className="font-black text-3xl">
          <>BERLIX UI * BERLIX UI * </>
        </AnimatedText>

        <AnimatedText
          variant="reveal"
          className="font-medium text-2xl bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 bg-clip-text text-transparent"
          from="top"
          split="word"
          blur={3}
          delay={0.2}
          duration={1.2}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias,
          rem.
        </AnimatedText>

        <AnimatedText
          variant="ripple"
          className="uppercase text-8xl font-normal text-zinc-900 dark:text-zinc-50"
        >
          Labyrinth
        </AnimatedText>

        <AnimatedText
          variant="scramble"
          className="font-mono text-2xl uppercase"
        >
          Its over 9000!
        </AnimatedText>

        <AnimatedText
          variant="split"
          className="text-9xl font-semibold uppercase"
          topClassName="text-red-500"
          bottomClassName="text-zinc-950 dark:text-zinc-50"
        >
          Berlix UI
        </AnimatedText>

        <Show when={false}>
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              href="https://turborepo.com/docs?utm_source"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
          <button type="button" className={styles.secondary}>
            Open alert
          </button>
        </Show>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.com?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  );
}
