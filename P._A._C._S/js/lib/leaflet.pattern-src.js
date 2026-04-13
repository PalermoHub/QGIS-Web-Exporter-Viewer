/*
 Leaflet.pattern, Provides tools to set the backgrounds of vector shapes in Leaflet to be patterns.
 https://github.com/teastman/Leaflet.pattern
 (c) 2015, Tyler Eastman
*/
(function (window, document, undefined) {/*
 * L.Pattern is the base class for fill patterns for leaflet Paths.
 */

L.Pattern = L.Class.extend({
	// L.Mixin.Events is deprecated since Leaflet 1.0; L.Evented is used instead.
	includes: [L.Evented.prototype || L.Mixin.Events],

	options: {
		x: 0,
		y: 0,
		width: 8,
		height: 8,
		patternUnits: 'userSpaceOnUse',
		patternContentUnits: 'userSpaceOnUse'
		// angle: <0 - 360>
		// patternTransform: <transform-list>
	},

	_addShapes: L.Util.falseFn,
	_update: L.Util.falseFn,

	initialize: function (options) {
		this._shapes = {};
		L.setOptions(this, options);
	},

	onAdd: function (map) {
        this._map = map.target ? map.target : map;
        this._map._initDefRoot();

		// Create the DOM Object for the pattern.
		this._initDom();

		// Any shapes that were added before this was added to the map need to have their onAdd called.
		for (var i in this._shapes) {
			this._shapes[i].onAdd(this);
		}

		// Call any children that want to add their own shapes.
		this._addShapes();

		// Add the DOM Object to the DOM Tree
		this._addDom();
		this.redraw();

		if (this.getEvents) {
            this._map.on(this.getEvents(), this);
		}
		this.fire('add');
        this._map.fire('patternadd', {pattern: this});
	},

	onRemove: function () {
		this._removeDom();
	},

	redraw: function () {
		if (this._map) {
			this._update();
			for (var i in this._shapes) {
				this._shapes[i].redraw();
			}
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);
		if (this._map) {
			this._updateStyle();
			this.redraw();
		}
		return this;
	},

	addTo: function (map) {
		map.addPattern(this);
		return this;
	},

	remove: function () {
		return this.removeFrom(this._map);
	},

	removeFrom: function (map) {
		if (map) {
			map.removePattern(this);
		}
		return this;
	}
});

L.Map.addInitHook(function () {
	this._patterns = {};
});

L.Map.include({
	addPattern: function (pattern) {
		var id = L.stamp(pattern);
		if (this._patterns[id]) { return pattern; }
		this._patterns[id] = pattern;

		this.whenReady(pattern.onAdd, pattern);
		return this;
	},

	removePattern: function (pattern) {
		var id = L.stamp(pattern);
		if (!this._patterns[id]) { return this; }

		if (this._loaded) {
			pattern.onRemove(this);
		}

		if (pattern.getEvents) {
			this.off(pattern.getEvents(), pattern);
		}

		delete this._patterns[id];

		if (this._loaded) {
			this.fire('patternremove', {pattern: pattern});
			pattern.fire('remove');
		}

		pattern._map = null;
		return this;
	},

	hasPattern: function (pattern) {
		return !!pattern && (L.stamp(pattern) in this._patterns);
	}
});



L.Pattern.SVG_NS = 'http://www.w3.org/2000/svg';

L.Pattern = L.Pattern.extend({
	_createElement: function (name) {
		return document.createElementNS(L.Pattern.SVG_NS, name);
	},

	_initDom: function () {
		this._dom = this._createElement('pattern');
		if (this.options.className) {
			L.DomUtil.addClass(this._dom, this.options.className);
		}
		this._updateStyle();
	},

	_addDom: function () {
		this._map._defRoot.appendChild(this._dom);
	},

	_removeDom: function () {
		L.DomUtil.remove(this._dom);
	},

	_updateStyle: function () {
		var dom = this._dom,
			options = this.options;

		if (!dom) { return; }

		dom.setAttribute('id', L.stamp(this));
		dom.setAttribute('x', options.x);
		dom.setAttribute('y', options.y);
		dom.setAttribute('width', options.width);
		dom.setAttribute('height', options.height);
		dom.setAttribute('patternUnits', options.patternUnits);
		dom.setAttribute('patternContentUnits', options.patternContentUnits);

		if (options.patternTransform || options.angle) {
			var transform = options.patternTransform ? options.patternTransform + " " : "";
			transform += options.angle ?  "rotate(" + options.angle + ") " : "";
			dom.setAttribute('patternTransform', transform);
		}
		else {
			dom.removeAttribute('patternTransform');
		}

		for (var i in this._shapes) {
			this._shapes[i]._updateStyle();
		}
	}
});

L.Map.include({
	_initDefRoot: function () {
        if (!this._defRoot) {
            var svgContainer = null;

            // Strategia 1: usa il renderer SVG standard (Leaflet 1.x)
            if (typeof this.getRenderer === 'function') {
                try {
                    var renderer = this.getRenderer(this);
                    if (renderer && renderer._container) {
                        svgContainer = renderer._container;
                    }
                } catch(e) {}
            }

            // Strategia 2: cerca il pane overlay-pane e il suo <svg> direttamente
            if (!svgContainer) {
                try {
                    var pane = this.getPane('overlayPane') || this.getPanes().overlayPane;
                    if (pane) {
                        svgContainer = pane.querySelector('svg');
                        if (!svgContainer) {
                            // Crea un SVG nascosto nel pane come fallback
                            svgContainer = L.Pattern.prototype._createElement('svg');
                            svgContainer.setAttribute('xmlns', L.Pattern.SVG_NS);
                            svgContainer.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
                            pane.appendChild(svgContainer);
                        }
                    }
                } catch(e) {}
            }

            // Strategia 3: pathRoot legacy (Leaflet <1.0)
            if (!svgContainer) {
                if (!this._pathRoot) {
                    if (typeof this._initPathRoot === 'function') this._initPathRoot();
                }
                svgContainer = this._pathRoot;
            }

            this._defRoot = L.Pattern.prototype._createElement('defs');
            if (svgContainer) {
                svgContainer.appendChild(this._defRoot);
            } else {
                // Fallback finale: inserisce nel body
                document.body.appendChild(this._defRoot);
            }
        }
    }
});

if (L.SVG) {
    L.SVG.include({
        _superUpdateStyle: L.SVG.prototype._updateStyle,

        _updateStyle: function (layer) {
            this._superUpdateStyle(layer);

            if (layer.options.fill && layer.options.fillPattern) {
                layer._path.setAttribute('fill', 'url(#' + L.stamp(layer.options.fillPattern) + ")");
            }
        }
    });
}
else {
    L.Path.include({
        _superUpdateStyle: L.Path.prototype._updateStyle,

        _updateStyle: function () {
            this._superUpdateStyle();

            if (this.options.fill && this.options.fillPattern) {
                this._path.setAttribute('fill', 'url(#' + L.stamp(this.options.fillPattern) + ")");
            }
        }
    });
}


/*
 * L.StripePattern is an implementation of Pattern that creates stripes.
 */

L.StripePattern = L.Pattern.extend({

	options: {
		weight: 4,
		spaceWeight: 4,
		color: '#000000',
		spaceColor: '#ffffff',
		opacity: 1.0,
		spaceOpacity: 0.0
	},

	_addShapes: function () {
		this._stripe = new L.PatternPath({
			stroke: true,
			weight: this.options.weight,
			color: this.options.color,
			opacity: this.options.opacity
		});

		this._space = new L.PatternPath({
			stroke: true,
			weight: this.options.spaceWeight,
			color: this.options.spaceColor,
			opacity: this.options.spaceOpacity
		});

		this.addShape(this._stripe);
		this.addShape(this._space);

		this._update();
	},

	_update: function () {
		this._stripe.options.d = 'M0 ' + this._stripe.options.weight / 2 + ' H ' + this.options.width;
		this._space.options.d = 'M0 ' + (this._stripe.options.weight + this._space.options.weight / 2) + ' H ' + this.options.width;
	},

	setStyle: L.Pattern.prototype.setStyle
});

L.stripePattern = function (options) {
	return new L.StripePattern(options);
};

/*
 * L.PatternShape is the base class that is used to define the shapes in Patterns.
 */

L.PatternShape = L.Class.extend({

	options: {
		stroke: true,
		color: '#3388ff',
		weight: 3,
		opacity: 1,
		lineCap: 'round',
		lineJoin: 'round',
		// dashArray: null
		// dashOffset: null

		// fill: false
		// fillColor: same as color by default
		fillOpacity: 0.2,
		fillRule: 'evenodd',
		// fillPattern: L.Pattern
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	// Called when the parent Pattern get's added to the map,
	// or when added to a Pattern that is already on the map.
	onAdd: function (pattern) {
		this._pattern = pattern;
		if (this._pattern._dom) {
			this._initDom();  // This function is implemented by it's children.
			this._addDom();
		}
	},

	addTo: function (pattern) {
		pattern.addShape(this);
		return this;
	},

	redraw: function () {
		if (this._pattern) {
			this._updateShape();  // This function is implemented by it's children.
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);
		if (this._pattern) {
			this._updateStyle();
		}
		return this;
	},

	setShape: function (shape) {
        this.options = L.extend({}, this.options, shape);
		this._updateShape();
	},
});

L.Pattern.include({
	addShape: function (shape) {
		var id = L.stamp(shape);
		if (this._shapes[id]) { return shape; }
		this._shapes[id] = shape;
		shape.onAdd(this);
	}
});



L.PatternShape.SVG_NS = 'http://www.w3.org/2000/svg';

L.PatternShape = L.PatternShape.extend({
	_createElement: function (name) {
		return document.createElementNS(L.PatternShape.SVG_NS, name);
	},

	_initDom: L.Util.falseFn,
	_updateShape: L.Util.falseFn,

	_initDomElement: function (type) {
		this._dom = this._createElement(type);
		if (this.options.className) {
			L.DomUtil.addClass(this._dom, this.options.className);
		}
		this._updateStyle();
	},

	_addDom: function () {
		this._pattern._dom.appendChild(this._dom);
	},

	_updateStyle: function () {
		var dom = this._dom,
			options = this.options;

		if (!dom) { return; }

		if (options.stroke) {
			dom.setAttribute('stroke', options.color);
			dom.setAttribute('stroke-opacity', options.opacity);
			dom.setAttribute('stroke-width', options.weight);
			dom.setAttribute('stroke-linecap', options.lineCap);
			dom.setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				dom.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				dom.removeAttribute('stroke-dasharray');
			}

			if (options.dashOffset) {
				dom.setAttribute('stroke-dashoffset', options.dashOffset);
			} else {
				dom.removeAttribute('stroke-dashoffset');
			}
		} else {
			dom.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			if (options.fillPattern) {
				dom.setAttribute('fill', 'url(#' + L.stamp(options.fillPattern) + ")");
			}
			else {
				dom.setAttribute('fill', options.fillColor || options.color);
			}
			dom.setAttribute('fill-opacity', options.fillOpacity);
			dom.setAttribute('fill-rule', options.fillRule || 'evenodd');
		} else {
			dom.setAttribute('fill', 'none');
		}

		dom.setAttribute('pointer-events', options.pointerEvents || (options.interactive ? 'visiblePainted' : 'none'));
	}
});



/*
 * L.PatternPath is the implementation of PatternShape for adding Paths
 */

L.PatternPath = L.PatternShape.extend({
//	options: {
		// d: <svg path code>
//	},

	_initDom: function () {
		this._initDomElement('path');
	},

	_updateShape: function () {
        if (!this._dom) { return; }
		this._dom.setAttribute('d', this.options.d);
	}
});

/*
 * L.PatternCircle is the implementation of PatternShape for adding Circles
 */

L.PatternCircle = L.PatternShape.extend({
	options: {
        x: 0,
        y: 0,
        radius: 0
	},

	_initDom: function () {
		this._initDomElement('circle');
	},

	_updateShape: function () {
        if (!this._dom) { return; }
		this._dom.setAttribute('cx', this.options.x);
		this._dom.setAttribute('cy', this.options.y);
		this._dom.setAttribute('r', this.options.radius);
	}
});

/*
 * L.PatternRect is the implementation of PatternShape for adding Rectangles
 */

L.PatternRect = L.PatternShape.extend({
	options: {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        // rx: x radius for rounded corners
        // ry: y radius for rounded corners
	},

	_initDom: function () {
		this._initDomElement('rect');
	},

	_updateShape: function () {
        if (!this._dom) { return; }
		this._dom.setAttribute('x', this.options.x);
		this._dom.setAttribute('y', this.options.y);
		this._dom.setAttribute('width', this.options.width);
		this._dom.setAttribute('height', this.options.height);
        if (this.options.rx) { this._dom.setAttribute('rx', this.options.rx); }
		if (this.options.ry) { this._dom.setAttribute('ry', this.options.ry); }
	}
});


/*
 * Leaflet.pattern - Hatch & Composite Patterns Extension
 * Provides QGIS-compatible hatch, crosshatch, dot and composite patterns.
 *
 * Pattern equivalents:
 *   L.HatchPattern      → QGIS "Riempimento a pattern lineare" (single direction)
 *   L.CrossHatchPattern → QGIS "Riempimento semplice / Diagonale X"
 *   L.DotPattern        → QGIS "Riempimento a pattern puntuale"
 *   L.CompositePattern  → Any combination of lines + dots in one tile
 *
 * IMPORTANT: width/height of the SVG <pattern> element are written to the DOM
 * inside _initDom() → _updateStyle(), which runs BEFORE _addShapes()/_update().
 * Therefore all classes override initialize() to pre-sync tile dimensions from
 * their own spacing option so the DOM gets the right values on first render.
 */


/*
 * L.HatchPattern
 * Parallel lines at any angle.
 *
 * Options:
 *   weight    {Number}  Line stroke width in px         (default: 1)
 *   color     {String}  Line color                      (default: '#000000')
 *   opacity   {Number}  Line opacity 0–1                (default: 1)
 *   spaceSize {Number}  Spacing between line centers px (default: 8)
 *   angle     {Number}  Rotation in degrees             (default: 45)
 *
 * Usage:
 *   var hatch = L.hatchPattern({ spaceSize: 6, weight: 1, angle: 45 });
 *   hatch.addTo(map);
 *   L.polygon(latlngs, { fillPattern: hatch, fill: true }).addTo(map);
 */
L.HatchPattern = L.Pattern.extend({

    options: {
        weight: 1,
        color: '#000000',
        opacity: 1.0,
        spaceSize: 8,
        angle: 45
        // dashArray:  e.g. '4,3'  — trattini SVG (opzionale)
        // dashOffset: e.g. '2'    — sfasamento trattini (opzionale)
    },

    initialize: function (options) {
        L.Pattern.prototype.initialize.call(this, options);
        // Sync tile dimensions before _updateStyle() writes them to the DOM.
        this.options.width  = this.options.spaceSize;
        this.options.height = this.options.spaceSize;
    },

    _addShapes: function () {
        this._line = new L.PatternPath({
            stroke: true,
            fill: false,
            weight: this.options.weight,
            color: this.options.color,
            opacity: this.options.opacity,
            lineCap: 'square'
        });
        this.addShape(this._line);
        this._update();
    },

    _update: function () {
        if (!this._line) { return; }
        var s = this.options.spaceSize;
        this._line.options.d          = 'M 0,' + (s / 2) + ' L ' + s + ',' + (s / 2);
        this._line.options.weight     = this.options.weight;
        this._line.options.color      = this.options.color;
        this._line.options.opacity    = this.options.opacity;
        this._line.options.dashArray  = this.options.dashArray  || null;
        this._line.options.dashOffset = this.options.dashOffset || null;
    },

    setStyle: function (style) {
        L.setOptions(this, style);
        this.options.width  = this.options.spaceSize;
        this.options.height = this.options.spaceSize;
        if (this._map) {
            this._updateStyle();
            this.redraw();
        }
        return this;
    }
});

L.hatchPattern = function (options) {
    return new L.HatchPattern(options);
};


/*
 * L.CrossHatchPattern
 * Two perpendicular sets of lines in one tile (crosshatch).
 * Set angle: 45 for the classic QGIS "Diagonale X" look.
 * Set angle: 0  for plain grid (horizontal + vertical lines).
 *
 * Options: identical to L.HatchPattern
 *
 * Usage:
 *   var cross = L.crossHatchPattern({ spaceSize: 8, weight: 1, angle: 45 });
 */
L.CrossHatchPattern = L.Pattern.extend({

    options: {
        weight: 1,
        color: '#000000',
        opacity: 1.0,
        spaceSize: 8,
        angle: 45
        // dashArray:  e.g. '4,3'
        // dashOffset: e.g. '2'
    },

    initialize: function (options) {
        L.Pattern.prototype.initialize.call(this, options);
        this.options.width  = this.options.spaceSize;
        this.options.height = this.options.spaceSize;
    },

    _addShapes: function () {
        this._path = new L.PatternPath({
            stroke: true,
            fill: false,
            weight: this.options.weight,
            color: this.options.color,
            opacity: this.options.opacity,
            lineCap: 'square'
        });
        this.addShape(this._path);
        this._update();
    },

    _update: function () {
        if (!this._path) { return; }
        var s    = this.options.spaceSize;
        var half = s / 2;
        this._path.options.d =
            'M 0,' + half + ' L ' + s + ',' + half +
            ' M ' + half + ',0 L ' + half + ',' + s;
        this._path.options.weight     = this.options.weight;
        this._path.options.color      = this.options.color;
        this._path.options.opacity    = this.options.opacity;
        this._path.options.dashArray  = this.options.dashArray  || null;
        this._path.options.dashOffset = this.options.dashOffset || null;
    },

    setStyle: function (style) {
        L.setOptions(this, style);
        this.options.width  = this.options.spaceSize;
        this.options.height = this.options.spaceSize;
        if (this._map) {
            this._updateStyle();
            this.redraw();
        }
        return this;
    }
});

L.crossHatchPattern = function (options) {
    return new L.CrossHatchPattern(options);
};


/*
 * L.DotPattern
 * Grid of circular dots, optionally in offset (brick-style) rows.
 *
 * Options:
 *   radius     {Number}  Dot radius in px          (default: 2)
 *   color      {String}  Dot fill color            (default: '#000000')
 *   opacity    {Number}  Dot fill opacity 0–1      (default: 1)
 *   spacing    {Number}  Distance between centers  (default: 10)
 *   offsetRows {Boolean} Stagger alternate rows    (default: false)
 *   angle      {Number}  Pattern rotation degrees  (default: 0)
 *
 * Usage (simple grid):
 *   var dots = L.dotPattern({ spacing: 10, radius: 2 });
 *
 * Usage (offset / brick layout):
 *   var dots = L.dotPattern({ spacing: 10, radius: 2, offsetRows: true });
 */
L.DotPattern = L.Pattern.extend({

    options: {
        radius: 2,
        color: '#000000',
        opacity: 1.0,
        spacing: 10,
        offsetRows: false,
        angle: 0
    },

    initialize: function (options) {
        L.Pattern.prototype.initialize.call(this, options);
        var s = this.options.spacing;
        this.options.width  = s;
        this.options.height = this.options.offsetRows ? s * 2 : s;
    },

    _addShapes: function () {
        var s    = this.options.spacing;
        var r    = this.options.radius;
        var base = {
            stroke: false,
            fill: true,
            fillColor: this.options.color,
            fillOpacity: this.options.opacity,
            radius: r
        };

        if (this.options.offsetRows) {
            this._dot1 = new L.PatternCircle(L.extend({}, base, { x: 0,     y: 0 }));
            this._dot2 = new L.PatternCircle(L.extend({}, base, { x: s / 2, y: s }));
            this.addShape(this._dot1);
            this.addShape(this._dot2);
        } else {
            this._dot1 = new L.PatternCircle(L.extend({}, base, { x: s / 2, y: s / 2 }));
            this.addShape(this._dot1);
        }

        this._update();
    },

    _update: function () {
        if (!this._dot1) { return; }
        var s = this.options.spacing;
        var r = this.options.radius;

        this._dot1.options.radius      = r;
        this._dot1.options.fillColor   = this.options.color;
        this._dot1.options.fillOpacity = this.options.opacity;

        if (this.options.offsetRows) {
            this._dot1.options.x = 0;
            this._dot1.options.y = 0;
            if (this._dot2) {
                this._dot2.options.x          = s / 2;
                this._dot2.options.y          = s;
                this._dot2.options.radius      = r;
                this._dot2.options.fillColor   = this.options.color;
                this._dot2.options.fillOpacity = this.options.opacity;
            }
        } else {
            this._dot1.options.x = s / 2;
            this._dot1.options.y = s / 2;
        }
    },

    setStyle: function (style) {
        L.setOptions(this, style);
        var s = this.options.spacing;
        this.options.width  = s;
        this.options.height = this.options.offsetRows ? s * 2 : s;
        if (this._map) {
            this._updateStyle();
            this.redraw();
        }
        return this;
    }
});

L.dotPattern = function (options) {
    return new L.DotPattern(options);
};


/*
 * L.CompositePattern
 * Combine arbitrary shapes (paths, circles, rects) into one SVG pattern tile.
 *
 * Options:
 *   width   {Number}  Tile width px    (required)
 *   height  {Number}  Tile height px   (required)
 *   angle   {Number}  Rotation degrees (default: 0)
 *   shapes  {Array}   Array of shape descriptors (type: 'path'|'circle'|'rect')
 *
 * Usage:
 *   var pattern = L.compositePattern({
 *     width: 10, height: 10, angle: 45,
 *     shapes: [
 *       { type: 'path', d: 'M 0,5 L 10,5',
 *         stroke: true, color: '#000', weight: 1, opacity: 1, fill: false },
 *       { type: 'circle', x: 5, y: 5, radius: 1.5,
 *         stroke: false, fill: true, fillColor: '#000', fillOpacity: 1 }
 *     ]
 *   });
 *   pattern.addTo(map);
 *   L.polygon(coords, { fill: true, fillPattern: pattern }).addTo(map);
 */
L.CompositePattern = L.Pattern.extend({

    options: {
        shapes: []
    },

    _addShapes: function () {
        var self = this;
        (this.options.shapes || []).forEach(function (shapeOpts) {
            var type = shapeOpts.type || 'path';
            var opts = L.extend({}, shapeOpts);
            delete opts.type;

            var shape;
            if (type === 'circle') {
                shape = new L.PatternCircle(opts);
            } else if (type === 'rect') {
                shape = new L.PatternRect(opts);
            } else {
                shape = new L.PatternPath(opts);
            }
            self.addShape(shape);
        });
    },

    setStyle: L.Pattern.prototype.setStyle
});

L.compositePattern = function (options) {
    return new L.CompositePattern(options);
};

}(window, document));