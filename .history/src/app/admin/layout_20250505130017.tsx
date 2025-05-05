import SharedLayout from '../shared-layout';
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // You might want to add admin-specific checks or context here later
  return <SharedLayout>{children}</SharedLayout>;
} 