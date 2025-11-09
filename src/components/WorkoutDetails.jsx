import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import config from '../config/config';

//date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) return;
    const response = await fetch(
      config.API_URL + "/api/workouts/" + workout._id,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  const handleEdit = () => {
    dispatch({ type: 'SET_EDIT', payload: workout });
  };

  // editing handled by the central WorkoutForm; clicking edit sets the
  // `editingWorkout` in context so the form on the right is populated.

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load(kgs):</strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps:</strong>
        {workout.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      <div className="icon-actions">
        <span className="material-symbols-outlined" onClick={handleDelete}>
          delete
        </span>
        <span className="material-symbols-outlined" onClick={handleEdit}>
          edit
        </span>
      </div>
    </div>
  );
};

export default WorkoutDetails;
