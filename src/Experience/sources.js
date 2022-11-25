export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg',
    ],
  },
  {
    name: 'grassColorTexture',
    type: 'texture',
    path: 'textures/dirt/color.jpg',
  },
  {
    name: 'grassNormalTexture',
    type: 'texture',
    path: 'textures/dirt/normal.jpg',
  },
  {
    name: 'bookModel',
    type: 'gltfModel',
    path: 'models/Book/book.gltf',
  },
  // {
  //   name: 'cameraModel',
  //   type: 'gltfModel',
  //   path: 'models/Camera/camera-followpath.gltf',
  // },
];
