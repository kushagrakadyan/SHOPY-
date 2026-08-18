import { Link } from "react-router-dom";
import Badge from "../common/Badge.jsx";
import { formatCompactNumber } from "../../utils/format.js";

export default function StoreCard({ store }) {
  return (
    <Link to={`/stores/${store.slug}`} className="card group block overflow-hidden">
      <div className="relative h-32 overflow-hidden bg-ink-100">
        <img src={store.banner} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="relative px-5 pb-5">
        <img src={store.logo} alt="" className="-mt-7 h-14 w-14 rounded-xl border-4 border-white bg-white shadow-soft" />
        <h3 className="mt-3 font-semibold text-ink-950">{store.name}</h3>
        <p className="text-sm text-ink-500">{store.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {store.rating}
          </Badge>
          <span className="text-xs text-ink-400">{formatCompactNumber(store.followers)} followers</span>
        </div>
      </div>
    </Link>
  );
}
