import "../assets/styles/Footer.css";

export default function Footer() {
  return (
    <div className="d-flex justify-content-center text-white p-2 mt-3 footer bg-dark">
      <a
        href="/privacy-policy"
        className="mx-2 text-decoration-none text-white"
      >
        Privacy Policy
      </a>
      <a href="/zlg-rules" className="mx-5 text-decoration-none text-white">
        Rules
      </a>
    </div>
  );
}
