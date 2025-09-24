'use client'
import Link from "next/link";
import { isLoggedIn, logout } from "../app/utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Don't render anything on the server or before client hydration
    return null;
  }

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.link}>
        Home
      </Link>
      {!isLoggedIn() && (
        <>
          <Link href="/login" style={styles.link}>
            Login
          </Link>
          <Link href="/signup" style={styles.link}>
            Signup
          </Link>
        </>
      )}
      {isLoggedIn() && (
        <button onClick={logout} style={styles.button}>
          Logout
        </button>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    padding: "15px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  button: {
    background: "none",
    border: "1px solid #fff",
    color: "#fff",
    cursor: "pointer",
    padding: "5px 10px",
  },
};
