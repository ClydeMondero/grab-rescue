import "ldrs/cardio";

const Loader = ({ isLoading, color }) => {
  const loaderColor = color ? color : "#fff";

  return (
    <div aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <l-cardio size="25" color={loaderColor}>
          {" "}
        </l-cardio>
      )}
    </div>
  );
};

export default Loader;
