// ==UserScript==
// @id           pogoExtendedRange
// @name         IITC Plugin: Pokemon GO Extended Range
// @category     Tweaks
// @version      0.2.0
// @namespace    https://github.com/edocsil47/IITCPogoExtendedRange
// @downloadURL  https://github.com/edocsil47/IITCPogoExtendedRange/raw/master/extendedRange.user.js
// @homepageURL  https://github.com/edocsil47/IITCPogoExtendedRange
// @description  Adds second circle for the new 80m Pokestop and Gym interaction range
// @author       edocsil47
// @include      https://intel.ingress.com/*
// @match        https://intel.ingress.com/*
// @grant        none
// ==/UserScript==

/* globals dialog */

// Wrapper function that will be stringified and injected into the document. Because of this, normal closure rules do not apply here.
function wrapper(plugin_info) {
	// Make sure that window.plugin exists. IITC defines it as a no-op function, and other plugins assume the same.
	if (typeof window.plugin !== "function") window.plugin = function () {};

	// Name of the IITC build for first-party plugins
	plugin_info.buildName = "pogoExtendedRange";

	// Datetime-derived version of the plugin
	plugin_info.dateTimeVersion = "2020-06-16-01";

	// ID/name of the plugin
	plugin_info.pluginId = "pogoExtendedRange";

	window.stopSpinIndicator = null;
    window.SPIN_RANGE = 80;
    window.SPIN_INDICATOR_COLOR = 'yellow';

	// The entry point for this plugin.
	function setup() {
		window.addHook(
		  "portalSelected",
		  window.drawExtendedSpinRange
		);
	}

	window.drawExtendedSpinRange = function (guid) {
		if (guid && guid.selectedPortalGuid) {
            p = window.portals[guid.selectedPortalGuid]
            if (stopSpinIndicator) {
                window.map.removeLayer(stopSpinIndicator);
            }
            stopSpinIndicator = null;
            if (p) {
                var coord = new LatLng(p._latlng.lat, p._latlng.lng);
                stopSpinIndicator = L.circle(coord, SPIN_RANGE, { fill: false, color: SPIN_INDICATOR_COLOR, weight: 2, interactive: false } ).addTo(map);
            }
        }
	};

	setup.info = plugin_info; //add the script info data to the function as a property

	// if IITC has already booted, immediately run the 'setup' function
	if (window.iitcLoaded) {
        setup();
	} else {
        if (!window.bootPlugins) {
            window.bootPlugins = [];
        }
        window.bootPlugins.push(setup);
	}
}

function LatLng(lat, lng, alt) {
	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	// @property lat: Number
	// Latitude in degrees
	this.lat = +lat;

	// @property lng: Number
	// Longitude in degrees
	this.lng = +lng;

	// @property alt: Number
	// Altitude in meters (optional)
	if (alt !== undefined) {
		this.alt = +alt;
	}
}

(function () {
	const plugin_info = {};
	if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
        plugin_info.script = {
            version: GM_info.script.version,
            name: GM_info.script.name,
            description: GM_info.script.description
        };
	}
	// Greasemonkey. It will be quite hard to debug
	if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
        // inject code into site context
        const script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(plugin_info) + ');'));
        (document.body || document.head || document.documentElement).appendChild(script);
	} else {
        // Tampermonkey, run code directly
        wrapper(plugin_info);
	}
})();
