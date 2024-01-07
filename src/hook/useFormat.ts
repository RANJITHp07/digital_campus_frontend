import { useMemo } from "react";

function useFormattedCreator(creator:string) {
  const formattedCreator = useMemo(() => {
    return creator
      ? creator.charAt(0).toUpperCase() + creator.slice(1).toLowerCase()
      : "";
  }, [creator]);

  return formattedCreator;
}

export default useFormattedCreator;
