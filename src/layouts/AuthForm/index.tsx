import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

type Props = {
  titleCard: string;
  descriptionContent: string;
  titleButtonEmail: string;
  titleButtonPolines: string;
  children: React.ReactNode;
};

export function AuthLayout({
  titleCard,
  descriptionContent,
  titleButtonEmail,
  titleButtonPolines,
  children,
}: Props) {
  return (
    <div>
      <Card className="px-4 py-2">
        <CardHeader>
          <CardTitle>
            <h1>{titleCard}</h1>
          </CardTitle>
          <CardDescription>
            <p>{descriptionContent}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <div className="flex flex-col gap-2">
            <Button size={"lg"}>{titleButtonEmail}</Button>
            <Button size={"lg"} variant={"outline"}>
              <FontAwesomeIcon icon={faGoogle} /> {titleButtonPolines}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
