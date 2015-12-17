goo.AmmoSystem=function(t){"use strict";function o(o){t.call(this,"AmmoSystem",["AmmoComponent","TransformComponent"]),this.settings=o||{},this.fixedTime=1/(this.settings.stepFrequency||60),this.maxSubSteps=this.settings.maxSubSteps||5;var e=new Ammo.btDefaultCollisionConfiguration,n=new Ammo.btCollisionDispatcher(e),a=new Ammo.btDbvtBroadphase,s=new Ammo.btSequentialImpulseConstraintSolver;this.ammoWorld=new Ammo.btDiscreteDynamicsWorld(n,a,s,e);var i=this.settings.gravity;null==i&&(i=-9.81),this.ammoWorld.setGravity(new Ammo.btVector3(0,i,0))}return o.prototype=Object.create(t.prototype),o.prototype.inserted=function(t){t.ammoComponent?(t.ammoComponent.initialize(t),this.ammoWorld.addRigidBody(t.ammoComponent.body)):console.log("Warning: missing entity.ammoComponent")},o.prototype.deleted=function(t){t.ammoComponent&&this.ammoWorld.removeRigidBody(t.ammoComponent.body)},o.prototype.process=function(t,o){this.ammoWorld.stepSimulation(o,this.maxSubSteps,this.fixedTime);for(var e=0;e<t.length;e++){var n=t[e];n.ammoComponent.mass>0&&n.ammoComponent.copyPhysicalTransformToVisual(n,o)}},o}(goo.System),goo.calculateTriangleMeshShape=function(){"use strict";return function(t,o){o=o||[1,1,1];for(var e=4,n=!0,a=n?4:2,s=n?"i32":"i16",i=t.meshDataComponent.meshData,r=i.dataViews.POSITION,m=Ammo.allocate(e*r.length,"float",Ammo.ALLOC_NORMAL),h=0,l=r.length;l>h;h++)Ammo.setValue(m+h*e,o[h%3]*r[h],"float");for(var d=i.indexData.data,u=Ammo.allocate(a*d.length,s,Ammo.ALLOC_NORMAL),h=0,l=d.length;l>h;h++)Ammo.setValue(u+h*a,d[h],s);var p=new Ammo.btIndexedMesh;p.set_m_numTriangles(i.indexCount/3),p.set_m_triangleIndexBase(u),p.set_m_triangleIndexStride(3*a),p.set_m_numVertices(i.vertexCount),p.set_m_vertexBase(m),p.set_m_vertexStride(3*e);var c=new Ammo.btTriangleIndexVertexArray;return c.addIndexedMesh(p,2),new Ammo.btBvhTriangleMeshShape(c,!0,!0)}}(),goo.AmmoComponent=function(t,o,e,n,a,s,i,r,m,h,l,d){"use strict";function u(t){o.apply(this,arguments),this.settings=t=t||{},d.defaults(t,{mass:0,useBounds:!1,useWorldBounds:!1,useWorldTransform:!1,linearFactor:new Ammo.btVector3(1,1,1),isTrigger:!1,onInitializeBody:null,scale:null,translation:null,rotation:null}),this.mass=t.mass,this.useBounds=t.useBounds,this.useWorldBounds=t.useWorldBounds,this.useWorldTransform=t.useWorldTransform,this.linearFactor=t.linearFactor,this.onInitializeBody=t.onInitializeBody,this.isTrigger=t.isTrigger,this.scale=t.scale,this.translation=t.translation,this.rotation=t.rotation,this.type="AmmoComponent",this.ammoTransform=new Ammo.btTransform,this.gooQuaternion=new e,this.shape=void 0}return u.prototype=Object.create(o.prototype),u.prototype.constructor=u,u.prototype.getAmmoShapefromGooShape=function(t,o){var e,r=[Math.abs(o.scale.x),Math.abs(o.scale.y),Math.abs(o.scale.z)];if(this.scale&&(r=[Math.abs(this.scale.x),Math.abs(this.scale.y),Math.abs(this.scale.z)]),t.meshDataComponent&&t.meshDataComponent.meshData){var m=t.meshDataComponent.meshData;if(m instanceof a)e=new Ammo.btBoxShape(new Ammo.btVector3(m.xExtent*r[0],m.yExtent*r[1],m.zExtent*r[2]));else if(m instanceof i)e=new Ammo.btSphereShape(m.radius*r[0]);else if(m instanceof s)e=new Ammo.btBoxShape(new Ammo.btVector3(m.xExtent,m.yExtent,.01));else if(this.useBounds||this.mass>0){t.meshDataComponent.computeBoundFromPoints();var d=t.meshDataComponent.modelBound;d instanceof h?e=new Ammo.btBoxShape(new Ammo.btVector3(d.xExtent*r[0],d.yExtent*r[1],d.zExtent*r[2])):d instanceof l&&(e=new Ammo.btSphereShape(d.radius*r[0]))}else e=n(t,r)}else for(var e=new Ammo.btCompoundShape,u=t.transformComponent.children,p=0;p<u.length;p++){var c=this.getAmmoShapefromGooShape(u[p].entity,o),f=new Ammo.btTransform;f.setIdentity();var g=u[p].transform.translation;f.setOrigin(new Ammo.btVector3(g.x,g.y,g.z)),e.addChildShape(f,c)}return e},u.prototype.getAmmoShapefromGooShapeWorldBounds=function(o){var e,n=t.getTotalBoundingBox(o);return this.center=n.center,e=new Ammo.btBoxShape(new Ammo.btVector3(n.xExtent,n.yExtent,n.zExtent))},u.prototype.initialize=function(t){var o=t.transformComponent.transform;this.useWorldTransform&&(o=t.transformComponent.worldTransform);var e=this.translation||o.translation,n=this.rotation||o.rotation,a=new Ammo.btTransform;a.setIdentity(),a.setOrigin(new Ammo.btVector3(e.x,e.y,e.z)),this.gooQuaternion.fromRotationMatrix(n);var s=this.gooQuaternion;if(a.setRotation(new Ammo.btQuaternion(s.x,s.y,s.z,s.w)),this.useWorldBounds?(t._world.process(),this.shape=this.getAmmoShapefromGooShapeWorldBounds(t,o),this.difference=this.center.clone().sub(o.translation).negate()):this.shape=this.getAmmoShapefromGooShape(t,o),!1===this.isTrigger){var i=new Ammo.btDefaultMotionState(a),r=new Ammo.btVector3(0,0,0);0!==this.mass&&this.shape.calculateLocalInertia(this.mass,r);var m=new Ammo.btRigidBodyConstructionInfo(this.mass,i,this.shape,r);this.localInertia=r,this.body=new Ammo.btRigidBody(m),this.body.setLinearFactor(this.linearFactor),this.onInitializeBody&&this.onInitializeBody(this.body)}},u.prototype.showBounds=function(o){var e,n=t.getTotalBoundingBox(o),s=new r(m.simpleLit);s.wireframe=!0,n.xExtent?e=o._world.createEntity(new a(2*n.xExtent,2*n.yExtent,2*n.zExtent),s):n.radius&&(e=o._world.createEntity(new i(12,12,n.radius),s)),e.transformComponent.setTranslation(n.center),e.addToWorld(),this.bv=e},u.prototype.setPhysicalTransform=function(t){var o=t.translation;this.ammoTransform.setIdentity(),this.ammoTransform.setOrigin(new Ammo.btVector3(o.x,o.y,o.z)),this.gooQuaternion.fromRotationMatrix(t.rotation);var e=this.gooQuaternion;this.ammoTransform.setRotation(new Ammo.btQuaternion(e.x,e.y,e.z,e.w)),this.body.setWorldTransform(this.ammoTransform)},u.prototype.copyPhysicalTransformToVisual=function(t){var o=t.transformComponent;if(this.body){this.body.getMotionState().getWorldTransform(this.ammoTransform);var e=this.ammoTransform.getRotation();this.gooQuaternion.setDirect(e.x(),e.y(),e.z(),e.w()),o.transform.rotation.copyQuaternion(this.gooQuaternion);var n=this.ammoTransform.getOrigin();o.setTranslation(n.x(),n.y(),n.z()),this.settings.showBounds&&(this.bv||this.showBounds(t),this.bv.transformComponent.transform.rotation.copy(o.transform.rotation),this.bv.transformComponent.setTranslation(o.transform.translation)),this.difference&&o.addTranslation(this.difference)}},u}(goo.EntityUtils,goo.Component,goo.Quaternion,goo.calculateTriangleMeshShape,goo.Box,goo.Quad,goo.Sphere,goo.Material,goo.ShaderLib,goo.BoundingBox,goo.BoundingSphere,goo.ObjectUtils),"function"==typeof require&&(define("goo/addons/ammopack/AmmoSystem",[],function(){return goo.AmmoSystem}),define("goo/addons/ammopack/calculateTriangleMeshShape",[],function(){return goo.calculateTriangleMeshShape}),define("goo/addons/ammopack/AmmoComponent",[],function(){return goo.AmmoComponent}));