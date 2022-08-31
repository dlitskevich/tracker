function applyWebGlBg(container) {
  'use strict';

  if (!container) {
    console.error('applyWebGlBg: no container');
    return;
  }

  // 'To actually be able to display anything with Three.js, we need three things:
  // A scene, a camera, and a renderer so we can render the scene with the camera.'
  // - https://threejs.org/docs/#Manual/Introduction/Creating_a_scene
  var scene, camera, renderer;

  var THREE = window.THREE,
    HEIGHT,
    WIDTH,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    geometry,
    particleCount,
    i,
    h,
    color,
    size,
    materials = [],
    mouseX = 0,
    mouseY = 0,
    windowHalfX,
    windowHalfY,
    cameraZ,
    fogHex,
    fogDensity,
    parameters = {},
    parameterCount,
    particles;

  init();
  animate();

  function init() {
    console.log('applyWebGlBg.init', container);
    WIDTH = container.clientWidth;
    HEIGHT = container.clientHeight;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 1;
    farPlane = 3000;

    /* 	fieldOfView — Camera frustum vertical field of view.
        aspectRatio — Camera frustum aspect ratio.
        nearPlane — Camera frustum near plane.
        farPlane — Camera frustum far plane.

        - https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

        In geometry, a frustum (plural: frusta or frustums)
        is the portion of a solid (normally a cone or pyramid)
        that lies between two parallel planes cutting it. - wikipedia.		*/

    cameraZ = farPlane / 3; /*	So, 1000? Yes! move on!	*/
    fogHex = 0x000000; /* As black as your heart.	*/
    fogDensity = 0.0007; /* So not terribly dense?	*/

    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = cameraZ;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogHex, fogDensity);

    geometry = new THREE.Geometry(); /*	NO ONE SAID ANYTHING ABOUT MATH! UGH!	*/

    particleCount = 20000; /* Leagues under the sea */
    for (i = 0; i < particleCount; i++) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2000 - 1000;
      vertex.y = Math.random() * 2000 - 1000;
      vertex.z = Math.random() * 2000 - 1000;

      geometry.vertices.push(vertex);
    }

    parameters = [
      [[1, 1, 0.5], 5],
      [[0.95, 1, 0.5], 4],
      [[0.9, 1, 0.5], 3],
      [[0.85, 1, 0.5], 2],
      [[0.8, 1, 0.5], 1],
    ];

    parameterCount = parameters.length;

    for (i = 0; i < parameterCount; i++) {
      color = parameters[i][0];
      size = parameters[i][1];

      materials[i] = new THREE.PointCloudMaterial({
        size: size,
      });

      particles = new THREE.PointCloud(geometry, materials[i]);

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      scene.add(particles);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio); /*	Probably 1; unless you're fancy.	*/
    renderer.setSize(WIDTH, HEIGHT);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    /* Event Listeners */
    function onDocumentMouseMove(e) {
      mouseX = e.clientX - windowHalfX;
      mouseY = e.clientY - windowHalfY;
    }

    function onDocumentTouch(e) {
      if (e.touches.length === 1) {
        e.preventDefault();
        mouseX = e.touches[0].pageX - windowHalfX;
        mouseY = e.touches[0].pageY - windowHalfY;
      }
    }

    function onWindowResize() {
      WIDTH = container.clientWidth;
      // HEIGHT = container.clientHeight;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;

      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(WIDTH, HEIGHT);
    }

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouch, false);
    document.addEventListener('touchmove', onDocumentTouch, false);
  }

  function animate() {
    requestAnimationFrame(animate);

    var time = Date.now() * 0.00005;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    for (i = 0; i < scene.children.length; i++) {
      var object = scene.children[i];

      if (object instanceof THREE.PointCloud) {
        object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
      }
    }

    for (i = 0; i < materials.length; i++) {
      color = parameters[i][0];
      h = ((360 * (color[0] + time)) % 360) / 360;
      materials[i].color.setHSL(h, color[1], color[2]);
    }

    renderer.render(scene, camera);
  }
}
