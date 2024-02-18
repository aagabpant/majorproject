import myimage from "../assets/images/istockphoto-172989638-612x612.jpg";
import myimage1 from "../assets/images/homepage.jpg";
import "./image.css"; // Import the custom CSS file
import ai from "../assets/images/ai.jpg";
function Image() {
  const imageStyle = {
    width: "100%", // Set width to 100%
    height: "auto",
  };

  return (
    <div className="image-container">
      {" "}
      {/* Wrap the image with a div */}
      <img src={ai} alt="bgimage" style={imageStyle} />
    </div>
  );
}

export default Image;
