import { useMemo } from "react";

function useFormattedCreator(creator:string) {
    return creator
      ? creator.charAt(0).toUpperCase() + creator.slice(1).toLowerCase()
      : "";

}

export default useFormattedCreator;
