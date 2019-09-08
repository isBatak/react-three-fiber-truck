import {
  MeshBasicMaterial,
  SphereGeometry,
  BoxGeometry,
  PlaneGeometry,
  CylinderGeometry,
  Plane,
  Mesh,
  Geometry,
  Vector3,
  Face3,
} from 'three';
import {
  Vec3,
  Sphere,
  Box,
  ConvexPolyhedron,
  Heightfield,
  Shape,
} from 'cannon';

/**
 * Adds Three.js primitives into the scene where all the Cannon bodies and shapes are.
 * @class CannonDebugRenderer
 * @param {THREE.Scene} scene
 * @param {World} world
 * @param {object} [options]
 */
export class DebugRenderer {
  private options;
  private scene;
  private world;
  private meshes;
  private material: MeshBasicMaterial;
  private sphereGeometry: SphereGeometry;
  private boxGeometry: BoxGeometry;
  private planeGeometry: PlaneGeometry;
  private cylinderGeometry: CylinderGeometry;
  private tmpVec0 = new Vec3();
  private tmpVec1 = new Vec3();
  private tmpVec2 = new Vec3();
  private tmpQuat0 = new Vec3();

  constructor(scene, world, options = {}) {
    this.options = options;
    this.scene = scene;
    this.world = world;
    this.meshes = [];
    this.material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.sphereGeometry = new SphereGeometry(1);
    this.boxGeometry = new BoxGeometry(1, 1, 1);
    this.planeGeometry = new PlaneGeometry(10, 10, 10, 10);
    this.cylinderGeometry = new CylinderGeometry(1, 1, 10, 10);
  }

  public update() {
    const { bodies } = this.world;
    // var meshes = this.meshes;
    var shapeWorldPosition = this.tmpVec0;
    var shapeWorldQuaternion = this.tmpQuat0;

    var meshIndex = 0;

    for (var i = 0; i !== bodies.length; i++) {
      var body = bodies[i];

      for (var j = 0; j !== body.shapes.length; j++) {
        var shape = body.shapes[j];

        this.updateMesh(meshIndex, body, shape);

        var mesh = this.meshes[meshIndex];

        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);

          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

          // Copy to meshes
          mesh.position.copy(shapeWorldPosition);
          mesh.quaternion.copy(shapeWorldQuaternion);
        }

        meshIndex++;
      }
    }

    for (var i = meshIndex; i < this.meshes.length; i++) {
      var mesh = this.meshes[i];
      if (mesh) {
        this.scene.remove(mesh);
      }
    }

    this.meshes.length = meshIndex;
  }

  private updateMesh(index, body, shape) {
    var mesh = this.meshes[index];
    if (!this.typeMatch(mesh, shape)) {
      if (mesh) {
        this.scene.remove(mesh);
      }
      mesh = this.meshes[index] = this.createMesh(shape);
    }
    this.scaleMesh(mesh, shape);
  }

  private typeMatch(mesh, shape) {
    if (!mesh) {
      return false;
    }
    var geo = mesh.geometry;
    return (
      (geo instanceof SphereGeometry && shape instanceof Sphere) ||
      (geo instanceof BoxGeometry && shape instanceof Box) ||
      (geo instanceof PlaneGeometry && shape instanceof Plane) ||
      (geo.id === shape.geometryId && shape instanceof ConvexPolyhedron) ||
      // (geo.id === shape.geometryId && shape instanceof Trimesh) ||
      (geo.id === shape.geometryId && shape instanceof Heightfield)
    );
  }

  private createMesh(shape) {
    let mesh;

    switch (shape.type) {
      case Shape.types.SPHERE:
        mesh = new Mesh(this.sphereGeometry, this.material);
        break;

      case Shape.types.BOX:
        mesh = new Mesh(this.boxGeometry, this.material);
        break;

      case Shape.types.PLANE:
        mesh = new Mesh(this.planeGeometry, this.material);
        break;

      case Shape.types.CONVEXPOLYHEDRON:
        // Create mesh
        var geo = new Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
          var v = shape.vertices[i];
          geo.vertices.push(new Vector3(v.x, v.y, v.z));
        }

        for (var i = 0; i < shape.faces.length; i++) {
          var face = shape.faces[i];

          // add triangles
          var a = face[0];
          for (var j = 1; j < face.length - 1; j++) {
            var b = face[j];
            var c = face[j + 1];
            geo.faces.push(new Face3(a, b, c));
          }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();

        mesh = new Mesh(geo, this.material);
        shape.geometryId = geo.id;
        break;

      // case Shape.types.TRIMESH:
      //   var geometry = new Geometry();
      //   var v0 = this.tmpVec0;
      //   var v1 = this.tmpVec1;
      //   var v2 = this.tmpVec2;
      //   for (var i = 0; i < shape.indices.length / 3; i++) {
      //     shape.getTriangleVertices(i, v0, v1, v2);
      //     geometry.vertices.push(
      //       new Vector3(v0.x, v0.y, v0.z),
      //       new Vector3(v1.x, v1.y, v1.z),
      //       new Vector3(v2.x, v2.y, v2.z)
      //     );
      //     var j = geometry.vertices.length - 3;
      //     geometry.faces.push(new Face3(j, j + 1, j + 2));
      //   }
      //   geometry.computeBoundingSphere();
      //   geometry.computeFaceNormals();
      //   mesh = new Mesh(geometry, material);
      //   shape.geometryId = geometry.id;
      //   break;

      case Shape.types.HEIGHTFIELD:
        var geometry = new Geometry();

        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
          for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
            for (var k = 0; k < 2; k++) {
              shape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy(shape.pillarConvex.vertices[0]);
              v1.copy(shape.pillarConvex.vertices[1]);
              v2.copy(shape.pillarConvex.vertices[2]);
              v0.vadd(shape.pillarOffset, v0);
              v1.vadd(shape.pillarOffset, v1);
              v2.vadd(shape.pillarOffset, v2);
              geometry.vertices.push(
                new Vector3(v0.x, v0.y, v0.z),
                new Vector3(v1.x, v1.y, v1.z),
                new Vector3(v2.x, v2.y, v2.z)
              );
              var i = geometry.vertices.length - 3;
              geometry.faces.push(new Face3(i, i + 1, i + 2));
            }
          }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new Mesh(geometry, this.material);
        shape.geometryId = geometry.id;
        break;
    }

    if (mesh) {
      this.scene.add(mesh);
    }

    return mesh;
  }

  private scaleMesh(mesh, shape) {
    switch (shape.type) {
      case Shape.types.SPHERE:
        var radius = shape.radius;
        mesh.scale.set(radius, radius, radius);
        break;

      case Shape.types.BOX:
        mesh.scale.copy(shape.halfExtents);
        mesh.scale.multiplyScalar(2);
        break;

      case Shape.types.CONVEXPOLYHEDRON:
        mesh.scale.set(1, 1, 1);
        break;

      // case Shape.types.TRIMESH:
      //   mesh.scale.copy(shape.scale);
      //   break;

      case Shape.types.HEIGHTFIELD:
        mesh.scale.set(1, 1, 1);
        break;
    }
  }
}
