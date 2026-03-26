import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";
import Navbar from "../components/layout/Navbar";

const Signup = () => {
  return (
    <>
      <Navbar />
      <AuthLayout
        title="Create your account"
        subtitle="Start scanning your code for vulnerabilities"
      >
        <SignupForm />
      </AuthLayout>
    </>
  );
};

export default Signup;
