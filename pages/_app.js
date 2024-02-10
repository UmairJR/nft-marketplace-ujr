// import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./components/Dashboard";
import { Web3Provider } from "./utils/Web3Provider";

export default function MyApp({ Component, pageProps }) {
  return <Dashboard {...pageProps} />
}
