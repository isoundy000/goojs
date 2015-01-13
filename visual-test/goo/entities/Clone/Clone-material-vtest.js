require([
	'goo/renderer/Material',
	'goo/renderer/shaders/ShaderLib',
	'goo/shapes/Box',
	'goo/math/Vector3',
	'goo/renderer/TextureCreator',
	'lib/V'
], function (
	Material,
	ShaderLib,
	Box,
	Vector3,
	TextureCreator,
	V
	) {
	'use strict';

	V.describe('Cloning materials');

	var goo = V.initGoo();
	var world = goo.world;

	V.addOrbitCamera(new Vector3(5, Math.PI / 2, 0));
	V.addLights();


	var textureCreator = new TextureCreator();

	var texture = textureCreator.loadTexture2D('../../../resources/check.png', {}, createClones);
	var originalMaterial = new Material(ShaderLib.uber);
	originalMaterial.setTexture('DIFFUSE_MAP', texture);

	world.createEntity(new Box(), originalMaterial, [0, 0, 0]).addToWorld();

	function createClones() {
		// cloning is delayed until the first texture loads
		// original texture gets updated by the texture creator
		// but the clones can not
		// it's just a matter of cloning at the right moment

		var clonedMaterial1 = originalMaterial.clone();
		clonedMaterial1.uniforms.materialDiffuse = [1, 0, 0, 1];

		var clonedMaterial2 = originalMaterial.clone();
		clonedMaterial2.uniforms.materialDiffuse = [0, 0, 1, 1];

		world.createEntity(new Box(), clonedMaterial1, [-2, 0, 0]).addToWorld();
		world.createEntity(new Box(), clonedMaterial2, [ 2, 0, 0]).addToWorld();


		setTimeout(function () {
			originalMaterial;
			clonedMaterial1;
//			debugger;
		}, 1000);
	}


	V.process();
});