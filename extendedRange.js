// ==UserScript==
// @author         edocsil47
// @name           IITC: Pokemon GO Extended Range
// @version        0.0.-1
// @description    Adds circle for Pokemon GO spin range
// @run-at         document-end
// @id             total-conversion-build
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL      https://iitc.modos189.ru/build/release/total-conversion-build.meta.js
// @downloadURL    https://iitc.modos189.ru/build/release/total-conversion-build.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

// script based on IITC-CE script by jonatkins



(function() {
    'use strict';
    window.SPIN_RANGE = 80; // 80m interaction range for Pokemon GO
    window.pokestopAccessIndicator = null;
    window.SPIN_INDICATOR_COLOR = 'dodgerblue'; // color for spin range circle. More options here: https://www.w3schools.com/tags/ref_colornames.asp

    // draws link-range and hack/spin-range circles around the portal with the
    // given details. Clear them if parameter 'd' is null.
    window.setPortalIndicators = function(p) {

        if(portalRangeIndicator) map.removeLayer(portalRangeIndicator);
        portalRangeIndicator = null;
        if(portalAccessIndicator) map.removeLayer(portalAccessIndicator);
        portalAccessIndicator = null;
        // added line below
        if(pokestopAccessIndicator) map.removeLayer(pokestopAccessIndicator);
        pokestopAccessIndicator = null;

        // if we have a portal...

        if(p) {
            var coord = p.getLatLng();

            // range is only known for sure if we have portal details
            // TODO? render a min range guess until details are loaded..?

            var d = portalDetail.get(p.options.guid);
            if (d) {
                var range = getPortalRange(d);
                portalRangeIndicator = (range.range > 0
                                        ? L.geodesicCircle(coord, range.range, {
                    fill: false,
                    color: RANGE_INDICATOR_COLOR,
                    weight: 3,
                    dashArray: range.isLinkable ? undefined : "10,10",
                    interactive: false })
                                        : L.circle(coord, range.range, { fill: false, stroke: false, interactive: false })
                                       ).addTo(map);
            }

            portalAccessIndicator = L.circle(coord, HACK_RANGE,
                                             { fill: false, color: ACCESS_INDICATOR_COLOR, weight: 2, interactive: false }
                                            ).addTo(map);
            // added line below
            pokestopAccessIndicator = L.circle(coord, SPIN_RANGE,
                                             { fill: false, color: SPIN_INDICATOR_COLOR, weight: 2, interactive: false }
                                            ).addTo(map);
        }

    }

})();




