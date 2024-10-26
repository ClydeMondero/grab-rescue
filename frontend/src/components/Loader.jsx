import { cardio } from "ldrs";
cardio.register();

const Loader = ({ isLoading, color, size = 50 }) => {
  const loaderColor = color ? color : "#fff";

  return (
    <div aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <l-cardio size={size} color={loaderColor}>
          {" "}
        </l-cardio>
      )}
    </div>
  );
};

export default Loader;
