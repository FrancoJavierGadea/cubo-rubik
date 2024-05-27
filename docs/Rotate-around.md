

```js
rotate(mesh, angle, axis, point){

    const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);

    mesh.applyQuaternion(q);

    mesh.position.sub(point);
    mesh.position.applyQuaternion(q);
    mesh.position.add(point);
}
```

```js
rotate(mesh, angle, axis){

    mesh.position.applyAxisAngle(axis, angle);

    mesh.rotateOnWorldAxis(axis, angle);
}
```

```js
applyAxisAngle( axis, angle ) {

    return this.applyQuaternion( _quaternion.setFromAxisAngle( axis, angle ) );
}
```