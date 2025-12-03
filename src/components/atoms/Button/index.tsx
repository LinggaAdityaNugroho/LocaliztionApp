import { Button } from "../../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ButtonSize = "default" | "sm" | "lg" | "icon" | "circle";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "circle"
  | "link";

type Props = {
  titleButton?: string;
  icon?: IconDefinition;
  size?: ButtonSize;
  variant?: ButtonVariant;
  onClick?: () => void;
  classsName?: string;
};

export function MyButton({
  titleButton,
  size = "default",
  variant = "default",
  onClick,
  classsName,
}: Props) {
  return (
    <Button
      size={size}
      variant={variant}
      onClick={onClick}
      className={classsName}
      type="submit"
    >
      {titleButton}
    </Button>
  );
}

export function MyButtonIcon({
  titleButton,
  icon,
  size = "default",
  variant = "default",
  onClick,
}: Props) {
  return (
    <Button
      size={size}
      variant={variant}
      className="flex items-center gap-2"
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {titleButton}
    </Button>
  );
}
