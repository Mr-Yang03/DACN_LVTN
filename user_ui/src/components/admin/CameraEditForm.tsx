import React, { useEffect, useState } from "react";
import axios from "axios";

interface Camera {
  _id: string;
  Title: string;
  Code: string;
  Location: {
    type: string;
    coordinates: [number, number];
  };
  SnapshotUrl: string | null;
  CamType: string;
  Publish: string;
  CamStatus: string;
  PTZ: string;
  Angle: number;
  DisplayName: string;
  VideoUrl: string | null;
  District: string | null;
}

interface CameraEditFormProps {
  cameraId: string;
  onSave: () => void;
}

const CameraEditForm: React.FC<CameraEditFormProps> = ({ cameraId, onSave }) => {
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    // Fetch camera data by cameraId
    axios
      .get(`/api/cameras/${cameraId}`)
      .then((response) => setCamera(response.data))
      .catch((error) => console.error("Error fetching camera data", error));
  }, [cameraId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (camera) {
      setCamera({
        ...camera,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (camera) {
      axios
        .put(`/api/cameras/${camera._id}`, camera)
        .then(() => {
          alert("Camera updated successfully");
          onSave(); // Refresh camera list or navigate back
        })
        .catch((error) => {
          console.error("Error updating camera", error);
        });
    }
  };

  if (!camera) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input
        type="text"
        name="Title"
        value={camera.Title}
        onChange={handleInputChange}
      />
      <br />
      <label>Code:</label>
      <input
        type="text"
        name="Code"
        value={camera.Code}
        onChange={handleInputChange}
      />
      <br />
      <label>Location Latitude:</label>
      <input
        type="number"
        name="latitude"
        value={camera.Location.coordinates[1]}
        onChange={(e) =>
          setCamera({
            ...camera,
            Location: {
              ...camera.Location,
              coordinates: [
                camera.Location.coordinates[0],
                parseFloat(e.target.value),
              ],
            },
          })
        }
      />
      <br />
      <label>Location Longitude:</label>
      <input
        type="number"
        name="longitude"
        value={camera.Location.coordinates[0]}
        onChange={(e) =>
          setCamera({
            ...camera,
            Location: {
              ...camera.Location,
              coordinates: [
                parseFloat(e.target.value),
                camera.Location.coordinates[1],
              ],
            },
          })
        }
      />
      <br />
      <label>Camera Status:</label>
      <input
        type="text"
        name="CamStatus"
        value={camera.CamStatus}
        onChange={handleInputChange}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  );
};

export default CameraEditForm;
