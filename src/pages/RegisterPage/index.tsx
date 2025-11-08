import { AuthLayout } from "../../layouts/AuthForm";
import { FormRegister } from "../../components/organism/FormRegister";
export function RegisterPage() {
  return (
    <AuthLayout
      titleCard="SignUp"
      descriptionContent="Enter your email below to login"
      titleButtonEmail="SignUp"
      titleButtonPolines="Masuk dengan email Polines"
    >
      <FormRegister />
    </AuthLayout>
  );
}
