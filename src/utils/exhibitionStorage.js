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
    exhibition = {
      id: `exhibition-${Date.now()}`,
      name: exhibitionName,
      objects: [],
    };
    exhibitions.push(exhibition);
  }

  const objectId = object.objectID || object.record?.systemNumber || object.id;

  if (!objectId) {
    return { text: "Object has no ID", type: "error" };
  }

  const isDuplicate = exhibition.objects.some((obj) => obj.id === objectId);

  let result;
  if (!isDuplicate) {
    const objectData = {
      ...object,
      id: objectId,
    };
    exhibition.objects.push(objectData);
    saveExhibitions(exhibitions);
    result = {
      text: `Added to your exhibition: "${exhibitionName}"`,
      type: "success",
    };
  } else {
    result = {
      text: `Object already exists in the exhibition: "${exhibitionName}"`,
      type: "error",
    };
  }
  return result;
};

export const deleteExhibition = (exhibitionId) => {
  let exhibitions = getExhibitions();
  exhibitions = exhibitions.filter(
    (exhibition) => exhibition.id !== exhibitionId
  );
  saveExhibitions(exhibitions);
};
