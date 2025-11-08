import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

type Props = {
  label: string;
  //   value: string;
  type?: string;
};

export function MyInputForm({ label, type }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input type={type} />
    </div>
  );
}
