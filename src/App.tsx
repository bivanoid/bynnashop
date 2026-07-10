import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import AdminGate from "./components/auth/AdminGate";
import RouteLoadingBar from "./components/layouts/RouteLoadingBar";
import FadeContent from "./animation/FadeContent";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Keranjang = lazy(() => import("./pages/keranjang/Keranjang"));
const KelolaProduk = lazy(() => import("./pages/kelola/KelolaProduk"));

function PageLoader() {
  return (
    <div
      className="startup_loading"
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        padding: 40,
        alignItems: "center"
      }}
    >
      <h1>Bynna's Shop</h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouteLoadingBar />
      <Suspense fallback={<PageLoader />}>
        <FadeContent>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/keranjang" element={<Keranjang />} />
            <Route
              path="/adminnyasabrina"
              element={
                <AdminGate>
                  <KelolaProduk />
                </AdminGate>
              }
            />
          </Routes>
        </FadeContent>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
