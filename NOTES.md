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
- Space Dust Racing UE4 Arcade Vehicle Physics Tour https://www.youtube.com/watch?v=LG1CtlFRmpU
- motion blur https://www.clicktorelease.com/tmp/threejs/mblur/
- google IO demo https://www.clicktorelease.com/code/io15/

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

# PRESENTATION NOTES

- what is three.js
- setup
- basic usage (canvas, scene, mash, lights)
- quaternion
  - Inscription on Broom Bridge (Dublin) regarding the discovery of Quaternions multiplication by Sir William Rowan Hamilton https://upload.wikimedia.org/wikipedia/commons/d/d5/Inscription_on_Broom_Bridge_%28Dublin%29_regarding_the_discovery_of_Quaternions_multiplication_by_Sir_William_Rowan_Hamilton.jpg
  - formula
  - gimbal lock (gif animation)
  - `const quaternion = new Quaternion().setFromAxisAngle(new Vector3( 0, 1, 0 ), Math.PI / 2);`
- react-three-fiber
- exporting models
- physics engine
- three.js dev-tools plugin
- demo
