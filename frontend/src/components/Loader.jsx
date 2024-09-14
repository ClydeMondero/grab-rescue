import "ldrs/cardio";

const Loader = ({ isLoading }) => {
  return (
    <div aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <l-cardio size="25" color="#fff">
          {" "}
        </l-cardio>
      )}
    </div>
  );
};

export default Loader;
