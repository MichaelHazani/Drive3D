// TODO: Sound feedback
// TODO: Animation (fall from sky?)
// TODO: Intro screen
// TODO: Meshes for common file types
// TODO: finish file case switches

// Boilerplate
var camera, scene, renderer;
var effect, controls;
var element, container;
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var ray = new THREE.Vector2(0.0, 0.0);

// Programmatic
var wooferRaw;

var intersectWithArr = [];
// colladaLoader
var colladaLoader = new THREE.ColladaLoader(manager);
// colladaLoader.options.convertUpAxis = true;

var rayCastSphere;
var isPaused = false;
var folder, files = [];
var folderContainer = [];
var stareAtObject = false;
//allow for cleartimeout of stare function
var stareTimeout;
// current file path
var PATH = '';

//floor = hierarchy level (From the bottom);
var floor = 0;
//how high to go
var multiplier = 130;

var tl = new TimelineLite();



var manager = new THREE.LoadingManager();
manager.onProgress = function(item, loaded, total) {
    console.log(loaded / total * 100 + "%");
    document.getElementById("status").innerHTML = ("Loading the goodies<br /><br />" + Math.round(loaded / total * 100) + "%");
}

manager.onLoad = function() {
    // console.log("ready to go!");
    init();
    animate();
}

// Skybox
var imagePrefix = "images/skybox/new2/";
var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
var imageSuffix = ".png";
var skyGeometry = new THREE.BoxGeometry(5000, 5000, 5000);

var materialArray = [];
for (var i = 0; i < 6; i++)
    materialArray.push(new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader(manager).load(imagePrefix + directions[i] + imageSuffix),
        side: THREE.BackSide
    }));
var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);

// --------------------------------------------------------------------------------INIT---------------------------------------------------------------------





function init() {

    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);
    var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    // var WW = window.innerWidth;
    // var HH = window.innerHeight;
    // renderer.setSize( WW, HH );
    // renderer.setViewport( 0, 0, WW*DPR, HH*DPR );
    renderer.setPixelRatio(DPR);
    console.log(renderer);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 6000);
    camera.position.set(0, 20, 0);
    scene.add(camera);

    // controls = new THREE.OrbitControls(camera, element);
    // controls.rotateUp(Math.PI / 4);
    // controls.target.set(
    //     camera.position.x + 0.1,
    //     camera.position.y,
    //     camera.position.z
    // );
    // controls.noZoom = true;
    // controls.noPan = true;

    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 0;
    controls.lookSpeed = 0.25;
    controls.noFly = true;
    controls.lookVertical = true;

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
    window.addEventListener('keypress', function(key) {
        console.log(key);
        if (key.keyCode == 112) {
            isPaused = !isPaused;
        }
    }, true);


    // lights
    var light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    light.position.set(0, 10, 0);
    scene.add(light);
    var amlight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(amlight);


    // plane
    var texture = new THREE.TextureLoader().load(
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
    var geometry = new THREE.PlaneGeometry(500, 500);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = "plane";

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -3;
    // intersectWithArr.push(mesh);

    // scene.add(mesh);


    scene.add(skyBox);


    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);


    //helper BALL
    var sphereGeo = new THREE.SphereGeometry(1, 12, 30);
    sphereGeo.dynamic = true;
    var sphereMat = new THREE.MeshNormalMaterial();
    rayCastSphere = new THREE.Mesh(sphereGeo, sphereMat);
    rayCastSphere.position.set(0, 0, -40);
    rayCastSphere.name = "rayCastSphere";
    camera.add(rayCastSphere);


    //GO
    getFiles(PATH);

} //end init

function getFiles(folder) {
    stareAtObject = false;
    // Get Dropbox File Structure
    var dbx = new Dropbox({
        accessToken: 'jP-3gUxYcvgAAAAAAABlsZHqfu6yw81fpKwUNvrz509F7BndLSErAGguza6hHqUJ'
    });
    dbx.filesListFolder({
            path: folder
        })
        .then(function(response) {
            createfiles(response);
        }).then(function() {
            travel();
        })
        .catch(function(error) {
            console.log(error);
            var restart = new Promise(function() {
                // if error, delete all and init all
                PATH = '';
                floor = 0;
                var count = 0;
                for (folder in folderContainer) {
                    // console.log(folderContainer[folder]);
                    for (item in folderContainer[folder]) {
                        scene.remove(folderContainer[folder][item]);
                        console.log(count++);
                    }
                }
                folderContainer = [];
            });
            restart.then(getFiles(PATH));

        });

    function createfiles(response) {
        //circle vars
        var r = 80;
        var s = radians(0);
        var t = radians(50);
        var inc = radians(360 / response.entries.length);

        //where all files + text references go
        folderContainer.push([]);

        //create folder gfx
        for (entry in response.entries) {
            var xCord = r * Math.cos(s) * Math.sin(t);
            var yCord = r * Math.sin(s) * Math.sin(t) + (floor * multiplier);
            var zCord = r * Math.cos(t);
            makeModel(xCord, yCord, zCord, response.entries[entry]);
            createText(xCord, yCord, zCord, response.entries[entry]);
            t -= inc;
            // s+= 20;
        }

        function makeModel(xCord, yCord, zCord, entry) {

            switch (entry[".tag"]) {
                case "folder":
                    // console.log("folder");
                    colladaLoader.load('models/folder2.dae', function(colladaObj) {
                        var folderRaw = colladaObj.scene.children[0].children[0];
                        var folder = new THREE.Object3D();
                        folder.add(new THREE.Mesh(folderRaw.geometry, folderRaw.material));
                        folder.scale.set(10, 10, 10);
                        folder.name = entry.name;
                        folder.type = "folder";
                        folder.tier = floor;

                        // folder.path = response.entries[entry].path_lower;
                        folder.position.set(xCord, yCord, zCord);

                        // folder.lookAt(camera);

                        scene.add(folder);
                        files.push(folder);
                        intersectWithArr.push(folder);
                        // console.log(folderContainer);
                        folderContainer[folderContainer.length - 1].push(folder);
                        // console.log(folder);
                        tl.to(folder.position, 1, {
                            y: yCord,
                            timeScale: 6,
                            ease: Quad.easeOut
                        }, 0.8);
                    });
                    break;

                case "file":

                    // console.log(entry.path_lower);
                    var filename = entry.path_lower.split('.');
                    var filetype = filename[filename.length - 1];

                    // console.log("file");
                    colladaLoader.load('models/woofer.dae', function(colladaObj) {

                        var wooferRaw = colladaObj.scene;
                        wooferRaw.scale.set(0.4, 0.4, 0.4);
                        wooferRaw.rotation.x = (radians(270));
                        wooferRaw.position.set(xCord, yCord, zCord);
                        wooferRaw.name = entry.name;
                        wooferRaw.tier = floor;
                        wooferRaw.type = filetype;

                        scene.add(wooferRaw);
                        files.push(wooferRaw);
                        intersectWithArr.push(wooferRaw);
                        folderContainer[folderContainer.length - 1].push(wooferRaw);

                    });
                    break;


                default:
                    break;


            }
            //end makeModel
        }
        // create folder descriptions
        function createText(xCord, yCord, zCord, entry) {
            var loader = new THREE.FontLoader();
            loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
                var textGeo = new THREE.TextGeometry(entry.name, {
                    font: font,
                    size: 4,
                    height: 0.1,
                    curveSegments: 6,
                    bevelThickness: 1,
                    bevelSize: 0.1,
                    bevelEnabled: false
                });
                textGeo.computeBoundingBox();
                var mesh = new THREE.Mesh(textGeo, new THREE.MeshPhongMaterial({
                    color: 0x000000,
                    specular: 0xffffff
                }));
                var xMiddle = mesh.geometry.boundingBox.max.x / 2;
                textGeo.applyMatrix(new THREE.Matrix4().makeTranslation(xMiddle * -1, 0, 0));
                mesh.position.set(xCord, yCord + 25, zCord);
                mesh.tier = floor;
                mesh.lookAt(camera.position);
                scene.add(mesh);
                folderContainer[folderContainer.length - 1].push(mesh);
            });
        } // End TextGeometry
    }
    // stareAtObject = true;

} // end getFiles



function rayCast() {
    // Raycasting
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(ray, camera);
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(intersectWithArr, true);
    // console.log(intersects.length);

    if (intersects.length == 0) {
        stareAtObject = false;
        clearTimeout(stareTimeout);
        rayCastSphere.animate = false;
        rayCastSphere.scale.set(1, 1, 1);

        // console.log("staring at something? " + stareAtObject);

    } else if (intersects.length != 0 && intersects[0].object.name != "plane") {
        if (!stareAtObject) {
            var objectName = intersects[0].object.parent.name
            open(objectName);
            // console.log("staring at something? " + stareAtObject);
        }

    } else if (intersects.length != 0 && intersects[0].object.name == "plane" && floor > 0) {
        // stareAtObject = true;
        // console.log("staring at something? " + stareAtObject);
        if (!stareAtObject) {
          rayCastSphere.animate = false;
          rayCastSphere.scale.set(1, 1, 1);
            open();
        }
    }

}

function open(objectName) {
    // console.log("floor: " + floor);
    if (objectName != undefined) {
        stareAtObject = true;
        console.log("staring at " + objectName);

        rayCastSphere.animate = true;

        stareTimeout = setTimeout(function() {
            console.log("going up!");
            PATH += "/" + objectName;
            floor += 1;

            console.log("up! Path is: " + PATH);
            getFiles(PATH);
            // travel();


        }, 1500);
    } else {

        stareAtObject = true;
        console.log("starting at floor");
        rayCastSphere.animate = true;

        stareTimeout = setTimeout(function() {
            // remove file tier
            for (item in folderContainer[floor]) {
                scene.remove(folderContainer[floor][item]);
            }
            folderContainer.pop();

            //to avoid root="" situations
            if (PATH.indexOf('/') != -1) {
                var newPath = PATH.split('/');
                newPath.pop();
                newPath.pop();
                PATH = newPath;
            }

            floor -= 1;
            travel();
            stareAtObject = false;
        }, 2000);

    }
}


function travel() {
    // controls.target.set(0, floor * multiplier, 0);
    tl.to(camera.position, 1, {
        y: floor * multiplier,
        ease: Quad.easeOut
    });
}

// ----------------------------------------------------------------------------RENDER/ANIMATE------------------------------------------------------

function render(dt) {
    rayCast();

    effect.render(scene, camera);

    // renderer.render(scene, camera);
}

function animate(t) {

    for (file in files) {
        if (files[file].type != "folder") {
            files[file].rotation.z -= 0.01;
        } else {
            files[file].rotation.y -= 0.01;
        }
    }
    if (rayCastSphere.animate) {
        rayCastSphere.scale.x += 0.05;
        rayCastSphere.scale.y += 0.05;
        rayCastSphere.scale.z += 0.05;
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

    // renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    resize();
    camera.updateProjectionMatrix();
    if (!isPaused) {
        controls.update(dt);
    }
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
