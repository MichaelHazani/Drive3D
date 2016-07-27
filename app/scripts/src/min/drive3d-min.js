function init(){function e(n){n.alpha&&(controls=new THREE.DeviceOrientationControls(camera,!0),controls.connect(),controls.update(),element.addEventListener("click",fullscreen,!1),window.removeEventListener("deviceorientation",e,!0))}renderer=new THREE.WebGLRenderer({alpha:!0}),element=renderer.domElement,container=document.getElementById("example"),container.appendChild(element);var n=window.devicePixelRatio?window.devicePixelRatio:1;renderer.setPixelRatio(n),console.log(renderer),effect=new THREE.StereoEffect(renderer),scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(90,1,.001,6e3),camera.position.set(0,10,0),scene.add(camera),controls=new THREE.FirstPersonControls(camera),controls.movementSpeed=0,controls.lookSpeed=.25,controls.noFly=!0,controls.lookVertical=!0,window.addEventListener("deviceorientation",e,!0),window.addEventListener("keypress",function(e){console.log(e),112==e.keyCode&&(isPaused=!isPaused)},!0);var t=new THREE.HemisphereLight(16777215,0,1);t.position.set(0,10,0),scene.add(t);var r=new THREE.AmbientLight(16777215,1);scene.add(r);var a=(new THREE.TextureLoader).load("images/textures/patterns/checker.png");a.wrapS=THREE.RepeatWrapping,a.wrapT=THREE.RepeatWrapping,a.repeat=new THREE.Vector2(50,50),a.anisotropy=renderer.getMaxAnisotropy();var o=new THREE.MeshPhongMaterial({color:2236962,specular:16777215,shininess:20,shading:THREE.FlatShading,map:a}),i=new THREE.PlaneGeometry(500,500),s=new THREE.Mesh(i,o);s.name="plane",intersectWithArr.push(s),s.rotation.x=-Math.PI/2,s.position.y=-3,scene.add(s),scene.add(skyBox),window.addEventListener("resize",resize,!1),setTimeout(resize,1);var l=new THREE.SphereGeometry(1,12,30);l.dynamic=!0;var c=new THREE.MeshNormalMaterial;rayCastSphere=new THREE.Mesh(l,c),rayCastSphere.position.set(0,0,-40),rayCastSphere.name="rayCastSphere",camera.add(rayCastSphere),getFiles(PATH)}function getFiles(e){function n(e){function n(e,n,t,r){colladaLoader.load("models/folder2.dae",function(a){var o=a.scene.children[0].children[0],i=new THREE.Object3D;i.add(new THREE.Mesh(o.geometry,o.material)),i.scale.set(10,10,10),i.name=r.name,i.tier=floor,i.position.set(e,n,t),scene.add(i),folders.push(i),intersectWithArr.push(i),folderContainer[folderContainer.length-1].push(i),tl.to(i.position,1,{y:n,timeScale:6,ease:Quad.easeOut},.8)})}function t(e,n,t,r){var a=new THREE.FontLoader;a.load("fonts/helvetiker_regular.typeface.json",function(a){var o=new THREE.TextGeometry(r.name,{font:a,size:4,height:.1,curveSegments:6,bevelThickness:1,bevelSize:.1,bevelEnabled:!1});o.computeBoundingBox();var i=new THREE.Mesh(o,new THREE.MeshPhongMaterial({color:0,specular:16777215})),s=i.geometry.boundingBox.max.x/2;o.applyMatrix((new THREE.Matrix4).makeTranslation(-1*s,0,0)),i.position.set(e,n+25,t),i.tier=floor,i.lookAt(camera.position),scene.add(i),folderContainer[folderContainer.length-1].push(i)})}var r=80,a=radians(0),o=radians(50),i=radians(360/e.entries.length);folderContainer.push([]);for(entry in e.entries){var s=r*Math.cos(a)*Math.sin(o),l=r*Math.sin(a)*Math.sin(o)+floor*multiplier,c=r*Math.cos(o);n(s,l,c,e.entries[entry]),t(s,l,c,e.entries[entry]),o-=i}}stareAtObject=!1;var t=new Dropbox({accessToken:"jP-3gUxYcvgAAAAAAABlsZHqfu6yw81fpKwUNvrz509F7BndLSErAGguza6hHqUJ"});t.filesListFolder({path:e}).then(function(e){n(e)}).then(function(){travel()})["catch"](function(n){console.log(n);var t=new Promise(function(){PATH="",floor=0;var n=0;for(e in folderContainer)for(item in folderContainer[e])scene.remove(folderContainer[e][item]),console.log(n++);folderContainer=[]});t.then(getFiles(PATH))})}function rayCast(){raycaster.setFromCamera(ray,camera);var e=raycaster.intersectObjects(intersectWithArr,!0);if(0!=e.length&&"plane"!=e[0].object.name){if(!stareAtObject){var n=e[0].object.parent.name;open(n)}}else 0==e.length?(stareAtObject=!1,clearTimeout(stareTimeout),rayCastSphere.animate=!1,rayCastSphere.scale.set(1,1,1)):0!=e.length&&"plane"==e[0].object.name&&floor>0&&(stareAtObject||open())}function open(e){void 0!=e?(stareAtObject=!0,console.log("staring at "+e),rayCastSphere.animate=!0,stareTimeout=setTimeout(function(){console.log("going up!"),PATH+="/"+e,floor+=1,console.log("up! Path is: "+PATH),getFiles(PATH)},1500)):(stareAtObject=!0,console.log("starting at floor"),rayCastSphere.animate=!0,stareTimeout=setTimeout(function(){for(item in folderContainer[floor])scene.remove(folderContainer[floor][item]);if(folderContainer.pop(),-1!=PATH.indexOf("/")){var e=PATH.split("/");e.pop(),e.pop(),PATH=e}floor-=1,travel(),stareAtObject=!1},2e3))}function travel(){tl.to(camera.position,1,{y:floor*multiplier,ease:Quad.easeOut})}function render(e){rayCast(),effect.render(scene,camera)}function animate(e){for(folder in folders)folders[folder].rotation.y-=.01;rayCastSphere.animate&&(rayCastSphere.scale.x+=.05,rayCastSphere.scale.y+=.05,rayCastSphere.scale.z+=.05),requestAnimationFrame(animate),update(clock.getDelta()),render(clock.getDelta())}function radians(e){return e*Math.PI/180}function resize(){var e=container.offsetWidth,n=container.offsetHeight;camera.aspect=e/n,camera.updateProjectionMatrix(),effect.setSize(e,n)}function update(e){resize(),camera.updateProjectionMatrix(),isPaused||controls.update(e)}function fullscreen(){container.requestFullscreen?container.requestFullscreen():container.msRequestFullscreen?container.msRequestFullscreen():container.mozRequestFullScreen?container.mozRequestFullScreen():container.webkitRequestFullscreen&&container.webkitRequestFullscreen()}var camera,scene,renderer,effect,controls,element,container,clock=new THREE.Clock,raycaster=new THREE.Raycaster,ray=new THREE.Vector2(0,0),intersectWithArr=[],colladaLoader=new THREE.ColladaLoader(manager),rayCastSphere,isPaused=!1,folder,folders=[],folderContainer=[],stareAtObject=!1,stareTimeout,PATH="",floor=0,multiplier=130,tl=new TimelineLite,manager=new THREE.LoadingManager;manager.onProgress=function(e,n,t){console.log(n/t*100+"%"),document.getElementById("status").innerHTML="Loading the goodies<br /><br />"+Math.round(n/t*100)+"%"},manager.onLoad=function(){console.log("ready to go!"),init(),animate()};for(var imagePrefix="images/skybox/new2/",directions=["xpos","xneg","ypos","yneg","zpos","zneg"],imageSuffix=".png",skyGeometry=new THREE.BoxGeometry(5e3,5e3,5e3),materialArray=[],i=0;6>i;i++)materialArray.push(new THREE.MeshBasicMaterial({map:new THREE.TextureLoader(manager).load(imagePrefix+directions[i]+imageSuffix),side:THREE.BackSide}));var skyMaterial=new THREE.MeshFaceMaterial(materialArray),skyBox=new THREE.Mesh(skyGeometry,skyMaterial);