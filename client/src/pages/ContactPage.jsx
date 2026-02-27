import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8">
        <div className="card-base">
          <h1 className="text-3xl font-semibold text-base-800">Contact</h1>
          <p className="mt-3 text-sm text-base-500">Reach the GeoSentinel team for product demos or enterprise plans.</p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
              Thanks for reaching out. We will get back to you soon.
            </div>
          ) : (
            <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
              <Input placeholder="Your name" required />
              <Input placeholder="Work email" required type="email" />
              <textarea
                className="input-base min-h-32 resize-y"
                placeholder="How can we help?"
                required
              />
              <div>
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          )}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
};

export default ContactPage;

