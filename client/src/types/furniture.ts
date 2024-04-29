
interface Furniture {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  colors: string[]; // Assuming colors are represented as strings
  image: string;
  [key: string]: any; // used for dynamic keys (mapping)
};

const initialFurniture: Furniture = {
  id: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  dimensions: {
      width: 0,
      height: 0,
      depth: 0,
  },
  material: '',
  colors: [],
    image: '',
};

export { Furniture, initialFurniture};

