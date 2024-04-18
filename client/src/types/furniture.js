const Furniture = {
  name: '',
  description: '',
  category: '',
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
  isNew: false,
  sale: false,
  discount: 0,
};

export { Furniture };

// Do something like this:
// const docData = {
//     stringExample: "Hello world!",
//     booleanExample: true,
//     numberExample: 3.14159265,
//     dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
//     arrayExample: [5, true, "hello"],
//     nullExample: null,
//     objectExample: {
//         a: 5,
//         b: {
//             nested: "foo"
//         }
//     }
// };
