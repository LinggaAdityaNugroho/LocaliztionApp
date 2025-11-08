import { Button } from "../../ui/button";

type Props = {
  titleButton: string;
};

export function MyButton({ titleButton }: Props) {
  return <Button>{titleButton}</Button>;
}
