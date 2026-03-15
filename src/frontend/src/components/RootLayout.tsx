import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
