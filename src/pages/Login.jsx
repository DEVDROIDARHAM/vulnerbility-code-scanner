import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import Navbar from "../components/layout/Navbar";

const Login = () => {
  return (
    <>
      <Navbar />
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to access your security dashboard"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;
