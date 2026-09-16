import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storeService } from "../../services/storeService.js";
import { PageLoader } from "../../components/common/Loader.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import Modal from "../../components/common/Modal.jsx";
import Button from "../../components/common/Button.jsx";
import { formatDate } from "../../utils/format.js";
import { useToast } from "../../components/common/Toast.jsx";

const statusTones = { active: "success", pending: "warning", suspended: "danger" };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reviewing, setReviewing] = useState(null);
  const { showToast } = useToast();

  function load() {
    storeService.all().then((data) => {
      setStores(data);
      setStatus("succeeded");
    });
  }

  useEffect(load, []);

  async function handleApprove(store) {
    await storeService.updateStatus(store.id, "active");
    showToast(`${store.name} approved`);
    setReviewing(null);
    load();
  }

  async function handleSuspend(store) {
    await storeService.updateStatus(store.id, "suspended");
    showToast(`${store.name} suspended`, "info");
    setReviewing(null);
    load();
  }

  const columns = [
    {
      key: "name",
      header: "Store",
      render: (s) => (
        <div className="flex items-center gap-3">
          <img src={s.logo} alt="" className="h-9 w-9 rounded-lg" />
          <div>
            <p className="font-medium text-ink-900">{s.name}</p>
            <p className="text-xs text-ink-400">{s.location}</p>
          </div>
        </div>
      ),
    },
    { key: "rating", header: "Rating", render: (s) => `${s.rating} (${s.reviewCount})` },
    { key: "createdAt", header: "Joined", render: (s) => formatDate(s.createdAt) },
    { key: "status", header: "Status", render: (s) => <Badge tone={statusTones[s.status]}>{s.status}</Badge> },
    {
      key: "actions",
      header: "",
      render: (s) => (
        <div className="flex items-center gap-3">
          <Link to={`/stores/${s.slug}`} className="text-xs font-medium text-ink-600 hover:text-ink-950">View</Link>
          <button onClick={() => setReviewing(s)} className="text-xs font-medium text-ink-600 hover:text-ink-950">Manage</button>
        </div>
      ),
    },
  ];

  if (status === "loading") return <PageLoader label="Loading stores" />;

  return (
    <div>
      <h1 className="text-xl font-bold">Store management</h1>
      <p className="mt-1 text-sm text-ink-500">Review, approve or suspend vendor storefronts.</p>

      <div className="card mt-5 overflow-hidden">
        <Table columns={columns} rows={stores} />
      </div>

      <Modal
        open={Boolean(reviewing)}
        onClose={() => setReviewing(null)}
        title={reviewing?.name}
        footer={
          reviewing?.status === "pending" ? (
            <>
              <Button variant="outline" onClick={() => setReviewing(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => handleApprove(reviewing)}>Approve store</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setReviewing(null)}>Close</Button>
              {reviewing?.status === "active" && <Button variant="danger" onClick={() => handleSuspend(reviewing)}>Suspend store</Button>}
              {reviewing?.status === "suspended" && <Button variant="primary" onClick={() => handleApprove(reviewing)}>Reinstate store</Button>}
            </>
          )
        }
      >
        {reviewing && (
          <div className="space-y-2 text-sm">
            <p className="text-ink-600">{reviewing.description}</p>
            <p><span className="text-ink-500">Categories: </span>{reviewing.categories.join(", ")}</p>
            <p><span className="text-ink-500">Contact: </span>{reviewing.contact.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
