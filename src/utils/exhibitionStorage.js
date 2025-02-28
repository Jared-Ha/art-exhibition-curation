const EXHIBITIONS_KEY = "exhibitions";

export const getExhibitions = () => {
  const storedExhibitions =
    JSON.parse(localStorage.getItem(EXHIBITIONS_KEY)) || [];

  if (storedExhibitions.length === 0) {
    const dummyExhibition = [
      {
        id: "test-exhibition",
        name: "Test Exhibition",
        objects: [
          {
            id: "object-123",
            title: "Starry Night",
            artist: "Vincent van Gogh",
            image:
              "https://images.metmuseum.org/CRDImages/ep/original/DT2163.jpg",
          },
        ],
      },
    ];
    localStorage.setItem(EXHIBITIONS_KEY, JSON.stringify(dummyExhibition));
    return dummyExhibition;
  }

  return storedExhibitions;
};

export const saveExhibitions = (exhibitions) => {
  localStorage.setItem(EXHIBITIONS_KEY, JSON.stringify(exhibitions));
};

export const addToExhibition = (exhibitionName, object) => {
  const exhibitions = getExhibitions();
  let exhibition = exhibitions.find((ex) => ex.name === exhibitionName);

  if (!exhibition) {
    // Create new exhibition if it doesn't exist
    exhibition = {
      id: `exhibition-${Date.now()}`,
      name: exhibitionName,
      objects: [],
    };
    exhibitions.push(exhibition);
  }

  const objectId = object.objectID || object.systemNumber || object.id;

  if (!objectId) {
    console.error("⚠️ Object has no valid ID:", object);
    return;
  }

  const isDuplicate = exhibition.objects.some((obj) => obj.id === objectId);

  if (!isDuplicate) {
    const objectData = {
      ...object,
      id: objectId,
    };

    exhibition.objects.push(objectData);
    saveExhibitions(exhibitions);
    console.log(`✅ Added object to exhibition: ${exhibitionName}`, objectData);
  } else {
    console.warn("⚠️ Object already exists in the exhibition.");
  }
};

export const deleteExhibition = (exhibitionId) => {
  let exhibitions = getExhibitions();
  exhibitions = exhibitions.filter(
    (exhibition) => exhibition.id !== exhibitionId
  );
  saveExhibitions(exhibitions);
};
