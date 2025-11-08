import { MyInputForm } from "../../molecules/Form";

export function FormRegister() {
  return (
    <form action="" className="flex flex-col gap-6">
      <MyInputForm label="Email" type="email" />
      <MyInputForm label="Password" type="password" />
    </form>
  );
}
