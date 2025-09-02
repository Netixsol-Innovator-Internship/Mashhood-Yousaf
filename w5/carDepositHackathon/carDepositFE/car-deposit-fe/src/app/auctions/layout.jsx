import ProtectedRoute from "../../components/ProtectedRoute";
import BlueClrHeader from '../../components/BlueClrHeader';
export default function Layout({ children }) {
  return (
    <>
      <BlueClrHeader />
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
