import Image, { type ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src"> {
  srcLight: string;
  srcDark: string;
}

export const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};
