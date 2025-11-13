import { MyInputForm } from "../../molecules/Form";
import { MyButton, MyButtonIcon } from "../../atoms/Button";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

export function FormLogin() {
  const navigate = useNavigate();

  return (
    <form action="" className="flex flex-col gap-6">
      <MyInputForm
        label="Email"
        type="email"
        placeholder="youremail@example.com"
      />
      <MyInputForm label="Password" type="password" placeholder="password" />
      <div className="flex flex-col gap-4">
        <MyButton
          titleButton="Login"
          size="lg"
          onClick={() => navigate("/dashboard")}
        />
        <MyButtonIcon
          titleButton="Masuk dengan email Polines"
          icon={faGoogle}
          size="lg"
          variant="outline"
        />
      </div>
    </form>
  );
}
