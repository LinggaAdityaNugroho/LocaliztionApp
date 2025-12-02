import { MyInputForm } from "../../molecules/Form";
import { MyButton, MyButtonIcon } from "../../atoms/Button";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { loginService } from "../../../services/auth.service";

export function FormLogin() {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const { ok, data } = await loginService(email, password);

  //   if (!ok) {
  //     alert(data.message || "Login gagal");
  //     return;
  //   }

  //   localStorage.setItem("token", data.access_token);
  //   navigate("/dashboard");
  // };

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
          onClick={() => {
            navigate("/dashboard");
          }}
        />
        <MyButtonIcon
          titleButton="Masuk dengan email Polines"
          icon={faGoogle}
          size="lg"
          variant="destructive"
        />
      </div>
    </form>
  );
}
