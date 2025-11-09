import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import config from '../config/config';

const WorkoutForm = () => {
  const { dispatch, editingWorkout } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [load, setLoads] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();

  // populate form when editingWorkout changes
  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title || "");
      setLoads(editingWorkout.load || "");
      setReps(editingWorkout.reps || "");
      setError(null);
      setEmptyFields([]);
    } else {
      // reset to create mode
      setTitle("");
      setLoads("");
      setReps("");
      setError(null);
      setEmptyFields([]);
    }
  }, [editingWorkout]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const workout = { title, load, reps };

    const response = await fetch(
      config.API_URL + "/api/workouts",
      {
        method: "POST",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
      return;
    }

    // success
    setTitle("");
    setReps("");
    setLoads("");
    setError(null);
    setEmptyFields([]);
    dispatch({ type: "CREATE_WORKOUT", payload: json });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user || !editingWorkout) return;

    const response = await fetch(
      config.API_URL + "/api/workouts/" + editingWorkout._id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, load, reps }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error || "Update failed");
      return;
    }

    // update in context and exit edit mode
    dispatch({ type: "UPDATE_WORKOUT", payload: json });
    dispatch({ type: "CLEAR_EDIT" });
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CLEAR_EDIT" });
  };

  const onSubmit = editingWorkout ? handleUpdate : handleCreate;

  return (
    <form className="create" onSubmit={onSubmit}>
      <h3>{editingWorkout ? "Update Workout" : "Add a New Workout"}</h3>
      <label>Workout Title:</label>
      <input
        type="text"
        className={emptyFields.includes("title") ? "error" : ""}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Loads(in kgs):</label>
      <input
        type="text"
        className={emptyFields.includes("loads") ? "error" : ""}
        onChange={(e) => setLoads(e.target.value)}
        value={load}
      />
      <label>Reps:</label>
      <input
        type="text"
        className={emptyFields.includes("reps") ? "error" : ""}
        onChange={(e) => setReps(e.target.value)}
        value={reps}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">{editingWorkout ? "Save Changes" : "Add Workout"}</button>
        {editingWorkout && (
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
