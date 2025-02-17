import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExhibitions } from "../utils/exhibitionStorage";

function SingleExhibition() {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);

  useEffect(() => {
    const exhibitions = getExhibitions();
    const foundExhibition = exhibitions.find((ex) => ex.id === id);
    setExhibition(foundExhibition || null);
  }, [id]);

  if (!exhibition) return <p>Exhibition not found.</p>;

  return (
    <section>
      <h2>{exhibition.name}</h2>
      <p>{exhibition.objects.length} items</p>

      <div className="exhibition-grid">
        {exhibition.objects.map((object) => (
          <div key={object.id} className="object-card">
            <img
              src={object.primaryImage || object.image}
              alt={object.title}
              width="150"
            />
            <h3>{object.title}</h3>
            <p>{object.artistDisplayName || "Unknown Artist"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SingleExhibition;
