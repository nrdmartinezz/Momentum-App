import PropTypes from "prop-types";
import "../src/styles/index.css";
import Providers from "../src/components/Providers";

export const metadata = {
  title: "Momentum",
  description: "Focus timer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
