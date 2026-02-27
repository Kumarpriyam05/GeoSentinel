import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto flex w-full max-w-7xl justify-center px-5 py-12 lg:px-8">
        <div className="card-base w-full max-w-md">
          <h1 className="text-2xl font-semibold text-base-800">Sign in</h1>
          <p className="mt-1 text-sm text-base-500">Access your GeoSentinel workspace.</p>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <Input
              placeholder="Email"
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
              required
            />
            {error ? (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>
            ) : null}
            <Button className="w-full" loading={loading} type="submit">
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-sm text-base-500">
            New here?{" "}
            <Link className="font-medium text-accent-600 hover:text-accent-500" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
};

export default LoginPage;

