// import SharedLayout from '../shared-layout'; // Remove this import
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // You might want to add admin-specific checks or context here later
  return <>{children}</>; // Render children directly
} 