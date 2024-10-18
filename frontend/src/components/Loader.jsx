import "ldrs/cardio";

const Loader = ({ isLoading, color, size = 50 }) => {
  const loaderColor = color ? color : "#fff";

  //FIXME: loader not showing in production
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
