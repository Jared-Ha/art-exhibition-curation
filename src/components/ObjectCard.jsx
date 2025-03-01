import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../assets/placeholder-image.jpg";
import AddToExhibitionModal from "./AddToExhibitionModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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

function ObjectCard({ object, exhibitions, onAddToExhibition }) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const [selectedExhibition, setSelectedExhibition] = useState("");
  const [addedConfirmationMessage, setAddedConfirmationMessage] = useState("");

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
      state: { object, imageSrc },
    });
  };

  const localAddToExhibition = () => {
    if (!newExhibitionName.trim() && !selectedExhibition) return;
    const exhibitionName = newExhibitionName.trim() || selectedExhibition;
    if (!exhibitionName) return;

    const objectData = {
      ...object,
      image: imageSrc || placeholderImage,
    };

    const result = onAddToExhibition(exhibitionName, objectData);
    setAddedConfirmationMessage(result);

    setShowModal(false);
    setNewExhibitionName("");
    setSelectedExhibition("");

    setTimeout(() => setAddedConfirmationMessage(null), 3000);
  };

  return (
    <div className="object-card">
      {isLoading ? (
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : imageSrc ? (
        <div className="clickable-image">
          <img
            src={imageSrc}
            alt={object._primaryTitle || object.title || "Artwork"}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      ) : (
        <div className="no-image">
          <img src={placeholderImage} alt="No Image Available" width="150" />
          <div className="overlay">No Image Available</div>
        </div>
      )}
      <h3>{object._primaryTitle || object.title}</h3>
      <p>{artistOrCulture}</p>
      <p>
        <strong>Date:</strong>{" "}
        {object.objectDate ||
          object.objectBeginDate ||
          object.record?.productionDates?.[0]?.date?.text ||
          "Unknown"}
      </p>
      {object.objectID && <p>Met Object ID: {object.objectID}</p>}
      {object.systemNumber && <p>V&A System Number: {object.systemNumber}</p>}

      {addedConfirmationMessage && (
        <div
          className={`added-confirmation-message ${addedConfirmationMessage.type}`}
        >
          {addedConfirmationMessage.text}
        </div>
      )}

      <button onClick={() => setShowModal(true)}>Add to Exhibition</button>

      <AddToExhibitionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        newExhibitionName={newExhibitionName}
        setNewExhibitionName={setNewExhibitionName}
        selectedExhibition={selectedExhibition}
        setSelectedExhibition={setSelectedExhibition}
        exhibitions={exhibitions}
        onSave={localAddToExhibition}
      />
    </div>
  );
}

export default ObjectCard;
