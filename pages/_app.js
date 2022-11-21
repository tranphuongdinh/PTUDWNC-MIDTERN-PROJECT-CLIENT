import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "../context/authContext";
import "../styles/globals.css";
import { GOOGLE_CLIENT_ID } from "../sysconfig";

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthContextProvider>
          <Head>
            <title>App</title>
          </Head>
          <div className="wrapper">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <Component {...pageProps} />
          </div>
        </AuthContextProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
