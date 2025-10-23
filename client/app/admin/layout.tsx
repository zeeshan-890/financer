import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Financer",
    description: "Admin panel for monitoring requests and analytics",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
