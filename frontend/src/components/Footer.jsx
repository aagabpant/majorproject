const Footer = () => {
  let year = new Date().getFullYear();

  return (
    <footer>
      <p className="text-center bg-primary text-white py-3 mt-5">
        Finance Analyzer &copy; {year}
      </p>
    </footer>
  );
};

export default Footer;
