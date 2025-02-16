import { useState, useEffect } from "react";
import placeholderImage from "../assets/placeholder-image.jpg";

function checkImageExists(imageUrl, callback) {
  if (!imageUrl) return callback(null);

  fetch(imageUrl, { method: "HEAD" })
    .then((res) => {
      if (res.ok) {
        callback(imageUrl);
      } else {
        callback(null);
      }
    })
    .catch(() => callback(null));
}

function fetchOgImage(objectURL, setImageSrc) {
  fetch(
    `http://localhost:5000/fetch-image?url=${encodeURIComponent(objectURL)}`
  )
    .then((res) => res.json())
    .then((data) => {
      setImageSrc(data.imageUrl || "missing-image-placeholder.jpg");
    })
    .catch((error) => {
      console.error("Error fetching OG image:", error);
      setImageSrc("missing-image-placeholder.jpg");
    });
}

function constructVAHighResImage(baseUrl) {
  return baseUrl ? `${baseUrl}full/full/0/default.jpg` : null;
}

function ObjectCard({ object }) {
  const [imageSrc, setImageSrc] = useState(null);

  const vaHighResImage = constructVAHighResImage(
    object._images?._iiif_image_base_url
  );

  const primaryImage =
    object.primaryImage ||
    object.primaryImageSmall ||
    vaHighResImage ||
    object._images?._primary_thumbnail;

  const objectURL = object.objectURL || "#";
  const artistOrCulture =
    object.artistDisplayName ||
    object._primaryMaker?.name ||
    object.culture ||
    "Unknown";

  useEffect(() => {
    if (primaryImage) {
      checkImageExists(primaryImage, (validPrimary) => {
        if (validPrimary) {
          setImageSrc(validPrimary);
        } else {
          checkImageExists(object.primaryImageSmall, (validSmall) => {
            if (validSmall) {
              setImageSrc(validSmall);
            } else if (vaHighResImage) {
              setImageSrc(vaHighResImage);
            } else if (object._images?._primary_thumbnail) {
              setImageSrc(object._images._primary_thumbnail);
            } else if (object.objectURL) {
              fetchOgImage(object.objectURL, setImageSrc);
            }
          });
        }
      });
    } else if (object.objectURL) {
      fetchOgImage(object.objectURL, setImageSrc);
    }
  }, [object]);

  return (
    <div className="object-card">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={object._primaryTitle || object.title || "Artwork"}
          width="150"
        />
      ) : (
        <div className="no-image">
          <img src={placeholderImage} alt="No Image Available" width="150" />
          <div className="overlay">No Image Available</div>
        </div>
      )}
      <h3>{object._primaryTitle || object.title}</h3>
      <p>{artistOrCulture}</p>
      {object.objectID && <p>Met Object ID: {object.objectID}</p>}
    </div>
  );
}

export default ObjectCard;
