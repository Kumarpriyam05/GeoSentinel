import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto flex w-full max-w-7xl justify-center px-5 py-12 lg:px-8">
        <div className="card-base w-full max-w-md">
          <h1 className="text-2xl font-semibold text-base-800">Create account</h1>
          <p className="mt-1 text-sm text-base-500">Start tracking devices in real time.</p>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              placeholder="Work email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              minLength={8}
              required
            />
            {error ? (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>
            ) : null}
            <Button className="w-full" loading={loading} type="submit">
              Register
            </Button>
          </form>

          <p className="mt-4 text-sm text-base-500">
            Already have an account?{" "}
            <Link className="font-medium text-accent-600 hover:text-accent-500" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
};

export default RegisterPage;

