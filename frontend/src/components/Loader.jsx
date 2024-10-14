import "ldrs/cardio";

const Loader = ({ isLoading, color, size = 25 }) => {
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
