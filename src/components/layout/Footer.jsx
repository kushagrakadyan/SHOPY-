import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/products" },
      { label: "Browse stores", to: "/stores" },
      { label: "Become a vendor", to: "/register/vendor" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Create account", to: "/register" },
      { label: "Order tracking", to: "/account/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SHOPy", to: "/" },
      { label: "Vendor dashboard", to: "/vendor" },
      { label: "Platform overview", to: "/admin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <div className="container-shopy grid grid-cols-2 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-500">
            One storefront platform, hundreds of independent shops. SHOPy gives vendors the
            tools to sell and customers a single place to discover them.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="eyebrow mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink-600 hover:text-ink-950">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100 py-6">
        <div className="container-shopy flex flex-col items-center justify-between gap-3 text-xs text-ink-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SHOPy. Built for the Zaalima Development internship.</p>
          <p>Frontend demo — data shown is illustrative mock data.</p>
        </div>
      </div>
    </footer>
  );
}
