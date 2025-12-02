import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";

type Props = {
  titleCard: string;
  descriptionContent: string;
  children: React.ReactNode;
};

export function AuthLayout({ titleCard, descriptionContent, children }: Props) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="px-4 py-6 w-md">
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-left text-lg">{titleCard}</p>
          </CardTitle>
          <CardDescription>
            <p className="text-left text-base font-normal">
              {descriptionContent}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
