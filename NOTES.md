# LINKS

- Ctrl + E - edge marks
  - https://blender.stackexchange.com/questions/10580/what-are-the-colored-highlighted-edges-in-edit-mode
- UVs helpers
  - https://github.com/c30ra/uv-align-distribute
  - https://www.grafixfather.com/uvpackmaster-2-pro-for-blender/
  - https://www.downloadpirate.com/asset-management-2-3-8-for-blender-2-8-full-version/
- GLTF docs
  - https://docs.blender.org/manual/en/2.80/addons/io_scene_gltf2.html
- glTF Settings for AO
  - https://github.com/KhronosGroup/glTF-Blender-IO/blob/master/addons/io_scene_gltf2/blender/imp/gltf2_blender_map_occlusion.py#L51

# TOOLS

- npx gltf-pipeline -i input.gltf -o output.gltf -d --draco.compressionLevel=10

# TODOS

- move physics to workers [react-hooks-worker](https://github.com/dai-shi/react-hooks-worker)
- use DRACO loader
  ```
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    loader.setDRACOLoader(dracoLoader);
  });
  ```
