import React, { createContext, useState, useContext } from "react";

// Définition du type de contexte
interface DataListContextType {
  dataList: any[]; // Type de dataList à ajuster selon votre structure
  setDataList: React.Dispatch<React.SetStateAction<any[]>>;
}

// Création du contexte avec une valeur par défaut
const DataListContext = createContext<DataListContextType>({
  dataList: [],
  setDataList: () => {},
});

// Composant Provider pour le contexte
export const DataListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataList, setDataList] = useState<any[]>([]); // Initialisation de dataList avec un tableau vide

  return (
    <DataListContext.Provider value={{ dataList, setDataList }}>
      {children}
    </DataListContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useDataList = () => {
  return useContext(DataListContext);
};
