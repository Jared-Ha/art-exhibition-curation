import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function fetchMetOgImage(objectURL, setImageSrc, setIsLoading) {
  setIsLoading(true);
  fetch(
    `http://localhost:5000/fetch-image?url=${encodeURIComponent(objectURL)}`
  )
    .then((res) => res.json())
    .then((data) => {
      setImageSrc(data.imageUrl || null);
    })
    .catch(() => {
      setImageSrc(null);
    })
    .finally(() => {
      setIsLoading(false);
    });
}

function constructVAHighResImage(baseUrl) {
  return baseUrl ? `${baseUrl}full/full/0/default.jpg` : null;
}

function ObjectCard({ object }) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const vaHighResImage = constructVAHighResImage(
    object._images?._iiif_image_base_url
  );

  const primaryImage =
    object.primaryImage ||
    object.primaryImageSmall ||
    vaHighResImage ||
    object._images?._primary_thumbnail;

  const artistOrCulture =
    object.artistDisplayName ||
    object._primaryMaker?.name ||
    object.culture ||
    "Unknown";

  useEffect(() => {
    let isMounted = true;

    if (primaryImage) {
      setIsLoading(true);

      checkImageExists(primaryImage, (validPrimary) => {
        if (!isMounted) return;

        if (validPrimary) {
          setImageSrc(validPrimary);
          setIsLoading(false);
        } else {
          checkImageExists(object.primaryImageSmall, (validSmall) => {
            if (!isMounted) return;

            if (validSmall) {
              setImageSrc(validSmall);
              setIsLoading(false);
            } else if (vaHighResImage) {
              setImageSrc(vaHighResImage);
              setIsLoading(false);
            } else if (object._images?._primary_thumbnail) {
              setImageSrc(object._images._primary_thumbnail);
              setIsLoading(false);
            } else if (object.objectURL) {
              fetchMetOgImage(object.objectURL, setImageSrc, setIsLoading);
            } else {
              setIsLoading(false);
            }
          });
        }
      });
    } else if (object.objectURL) {
      fetchMetOgImage(object.objectURL, setImageSrc, setIsLoading);
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [object]);

  const handleClick = () => {
    navigate(`/object/${object.objectID || object.systemNumber}`, {
      state: { imageSrc },
    });
  };

  return (
    <div
      className="object-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : imageSrc ? (
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
      {object.systemNumber && <p>V&A System Number: {object.systemNumber}</p>}
    </div>
  );
}

export default ObjectCard;
