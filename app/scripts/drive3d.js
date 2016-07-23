// TODO: Skybox
// TODO: Sound feedback
// TODO: Animation (fall from sky?)
// TODO: Raycasting


var camera, scene, renderer;
var effect, controls;
var element, container;
var clock = new THREE.Clock();
var folder, folders = [];
init();
animate();

// --------------------------------------------------------------------------------INIT---------------------------------------------------------------------

function init() {
    renderer = new THREE.WebGLRenderer({alpha: true});
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    camera.position.set(0, 10, 0);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);


    var light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
light.position.set(0,10,0);
    scene.add(light);
    var amlight = new THREE.AmbientLight(0xffffff, 1);
// light.position.set(0,20,0);
    scene.add(amlight);


    var texture = THREE.ImageUtils.loadTexture(
        'images/textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshPhongMaterial({
        color: 0x222222,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
    });

    var geometry = new THREE.PlaneGeometry(1000, 1000);

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

// load folder mesh
var colladaLoader = new THREE.ColladaLoader();
colladaLoader.options.convertUpAxis = true;
colladaLoader.load('models/folder2.dae', function(colladaObj) {
folder = colladaObj.scene.children[0];
folder.scale.set(10,10,10);
folder.rotateX(radians(90));
folder.rotateY(radians(340));
});

// Get Dropbox File Structure
var dbx = new Dropbox({ accessToken: 'jP-3gUxYcvgAAAAAAABlsZHqfu6yw81fpKwUNvrz509F7BndLSErAGguza6hHqUJ' });
dbx.filesListFolder({path: ''})
  .then(function(response) {
    createFolders(response);
  })
  .catch(function(error) {
    console.log(error);
  });

  function createFolders(response){
    // console.log(response);
    // var mockObject = {entries: [0,1,2,3,4,5,6,7,8,9,10,11], names: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']};

    function createText(x,y,z,text) {
      // //load text
      var loader = new THREE.FontLoader();
      loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
      var textGeo = new THREE.TextGeometry( text, {
              font: font,
              size: 4,
              height: 1,
              curveSegments: 6,
              bevelThickness: 1,
              bevelSize: 0.1,
              bevelEnabled: false
          });
          textGeo.computeBoundingBox();
          var mesh = new THREE.Mesh( textGeo, new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff } ) );
          var xMiddle = mesh.geometry.boundingBox.max.x/2;
          textGeo.applyMatrix(new THREE.Matrix4().makeTranslation(xMiddle * -1,0,0));
          mesh.position.set(x,y+25,z);
          mesh.lookAt( camera.position );
          scene.add( mesh );
      });
      // // End TextGeometry

    }

    var r = 80;
    var s = radians(0);
    var t = radians(50);
    var inc = radians(360 / response.entries.length);

    for (entry in response.entries) {
      var xCord = r * Math.cos(s) * Math.sin(t);
      var yCord = r * Math.sin(s) * Math.sin(t) + 20;
      var zCord = r * Math.cos(t);

    // var entrySphere = new THREE.Mesh(new THREE.SphereGeometry(6,13,100), new THREE.MeshNormalMaterial({side: THREE.DoubleSide}));
    // entrySphere.position.set(xCord, yCord, zCord);
var newFolder= folder.clone();

    newFolder.position.set(xCord, yCord, zCord);

    // newFolder.lookAt(camera);
    folders.push(newFolder);
    scene.add(newFolder);
    // newFolder.rotation.set(0,radians(45),0);


    createText(xCord,yCord,zCord,response.entries[entry].name);

    // initDistance += 20;
    t -= inc;
    // s+= 20;
    }

//end init
  }

// ----------------------------------------------------------------------------RENDER/ANIMATE------------------------------------------------------

function render(dt) {
    effect.render(scene, camera);
    // renderer.render(scene, camera);
}

function animate(t) {

for (folder in folders) {
  folders[folder].rotation.z+=0.01;

}


    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}


// --------------------------------------------------------------------------------HELPERS------------------------------------------------------------

//convert degrees to radians
function radians(degree) {
  return degree * Math.PI / 180;
}


function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    resize();
    camera.updateProjectionMatrix();
    controls.update(dt);
}

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}
