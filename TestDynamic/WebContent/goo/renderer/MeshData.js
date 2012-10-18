define([ 'goo/renderer/BufferData', 'goo/renderer/Util' ], function(BufferData, Util) {
	function MeshData(dataMap, vertexCount, indexCount) {
		this._primitiveCounts = [];
		this._dataMap = dataMap;
		this._dataViews = {};

		this._indexLengths = null;
		this._indexModes = [ 'Triangles' ];

		this.rebuildData(vertexCount, indexCount);
	}

	MeshData.prototype.rebuildData = function(vertexCount, indexCount) {
		this._vertexCount = vertexCount;
		this._limitVertexCount = this._vertexCount;
		this._indexCount = indexCount || 0;

		this.vertexData = new BufferData(new ArrayBuffer(this._dataMap.vertexByteSize * this._vertexCount),
				'ArrayBuffer');

		if (this._indexCount > 0) {
			var indices;
			if (this._vertexCount < 256) { // 2^8
				indices = new Int8Array(this._indexCount);
			} else if (this._vertexCount < 65536) { // 2^16
				indices = new Int16Array(this._indexCount);
			} else { // 2^32
				indices = new Int32Array(this._indexCount);
			}
			this.indexData = new BufferData(indices, 'ElementArrayBuffer');
		}

		this.generateDataViews();
	};

	MeshData.prototype.generateDataViews = function() {
		this._dataViews = {};
		var data = this.vertexData.data;
		var view;
		var offset = 0;
		for ( var i in this._dataMap.descriptors) {
			var d = this._dataMap.descriptors[i];
			d.offset = offset;
			var length = this._vertexCount * d.count;
			offset += length * Util.getByteSize(d.type);
			switch (d.type) {
				case 'Byte':
					view = new Int8Array(data, d.offset, length);
					break;
				case 'UnsignedByte':
					view = new Uint8Array(data, d.offset, length);
					break;
				case 'Short':
					view = new Int16Array(data, d.offset, length);
					break;
				case 'UnsignedShort':
					view = new Uint16Array(data, d.offset, length);
					break;
				case 'Int':
					view = new Int32Array(data, d.offset, length);
					break;
				case 'UnsignedInt':
					view = new Uint32Array(data, d.offset, length);
					break;
				case 'Float':
					view = new Float32Array(data, d.offset, length);
					break;
				case 'Double':
					view = new Float64Array(data, d.offset, length);
					break;
				case 'HalfFloat':
					// XXX: Support?
				default:
					console.log("Unsupported DataType: " + d.type);
					return;
			}

			this._dataViews[d.attributeName] = view;
		}
	};

	MeshData.prototype.getAttributeBuffer = function(attributeName) {
		return this._dataViews[attributeName];
	};

	MeshData.prototype.getIndexData = function() {
		return this.indexData;
	};

	MeshData.prototype.getIndexBuffer = function() {
		return this.indexData.data;
	};

	MeshData.prototype.getIndexLengths = function() {
		return this._indexLengths;
	};

	MeshData.prototype.getIndexModes = function() {
		return this._indexModes;
	};

	MeshData.POSITION = 'POSITION';
	MeshData.NORMAL = 'NORMAL';
	MeshData.COLOR = 'COLOR';
	MeshData.TEXCOORD0 = 'TEXCOORD0';
	MeshData.TEXCOORD1 = 'TEXCOORD1';

	MeshData.WEIGHTS = 'WEIGHTS';
	MeshData.JOINTIDS = 'JOINTIDS';

	return MeshData;
});