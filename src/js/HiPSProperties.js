// Copyright 2013 - UDS/CNRS
// The Aladin Lite program is distributed under the terms
// of the GNU General Public License version 3.
//
// This file is part of Aladin Lite.
//
//    Aladin Lite is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, version 3 of the License.
//
//    Aladin Lite is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    The GNU General Public License is available in COPYING file
//    along with Aladin Lite.
//



/******************************************************************************
 * Aladin Lite project
 * 
 * File ImageSurvey
 * 
 * Authors: Thomas Boch & Matthieu Baumann [CDS]
 * 
 *****************************************************************************/
import { Utils } from "./Utils";
import { HiPSDefinition } from "./HiPSDefinition.js";
import { MocServer } from "./MocServer.js";

export let HiPSProperties = {};

HiPSProperties.fetchFromID = async function(ID) {
    // Use the MOCServer to retrieve the properties
    const params = {
        get: "record",
        fmt: "json",
        ID: "*" + ID + "*",
    };

    let metadata = await Utils.loadFromUrls(MocServer.MIRRORS_HTTPS, {
        data: params,
        dataType: 'json'
    });

    // We get the property here
    // 1. Ensure there is exactly one survey matching
    if (!metadata || metadata.length == 0) {
        throw 'No surveys matching have been found for the id: ' + ID;
    } else {
        let result;

        if (metadata.length > 1) {
            let matching = metadata.find((m) => m.ID === ID);
            if (matching) {
                result = matching;
            } else {
                result = metadata[0];
                console.warn("Multiple surveys are matching, please choose one. The chosen one is: " + result);
            }
        } else {
            // Exactly one matching
            result = metadata[0];
        }
        return result;
    }
}

HiPSProperties.fetchFromUrl = async function(urlOrId) {
    try {
        urlOrId = new URL(urlOrId);
    } catch (e) {
        // Relative path test
        try {
            urlOrId = Utils.getAbsoluteURL(urlOrId)

            urlOrId = new URL(urlOrId);
        } catch(e) {
            throw e;
        }
    }

    // Fetch the properties of the survey
    const HiPSServiceUrl = urlOrId.toString();
    
    let url = HiPSServiceUrl;
    // Use the url for retrieving the HiPS properties
    // remove final slash
    if (url.slice(-1) === '/') {
        url = url.substr(0, url.length - 1);
    }
    url = url + '/properties';

    // make URL absolute
    url = Utils.getAbsoluteURL(url);
    // fix for HTTPS support --> will work for all HiPS served by CDS
    url = Utils.fixURLForHTTPS(url)

    let init = {};
    if (Utils.requestCORSIfNotSameOrigin(url)) {
        init = { mode: 'cors' };
    }

    let result = fetch(url, init)
        .then((response) => {
            if (response.status == 404) {
                return Promise.reject("Url points to nothing")
            } else {
                return response.text();
            }
        })
        .then(
            (response) => new Promise((resolve, reject) => {
                // We get the property here
                let metadata = HiPSDefinition.parseHiPSProperties(response);
                // 1. Ensure there is exactly one survey matching
                if (metadata && Object.keys(metadata).length > 0) {
                    // Set the service url if not found
                    if (!metadata.hips_frame || !metadata.hips_order) {
                        reject('Bad properties: do not contain the mandatory frame or order info')
                    } else {
                        metadata.hips_service_url = HiPSServiceUrl;
                        resolve(metadata);
                    }
                } else {
                    reject('No surveys matching at this url: ' + rootURL);
                }
            })
        )

    return result;
}

HiPSProperties.getFasterMirrorUrl = function (metadata) {
    const pingHiPSServiceUrl = (hipsServiceUrl) => {
        hipsServiceUrl = Utils.fixURLForHTTPS(hipsServiceUrl);

        const controller = new AbortController()

        let startRequestTime = Date.now();
        const maxTime = 500;
        // 5 second timeout:
        const timeoutId = setTimeout(() => controller.abort(), maxTime)
        const promise = fetch(hipsServiceUrl + '/properties', { cache: 'no-store', signal: controller.signal, mode: "cors" }).then(response => {
            const duration = Date.now() - startRequestTime;//the time needed to do the request
            // completed request before timeout fired
            clearTimeout(timeoutId)
            // Resolve with the time duration of the request
            return { duration: duration, baseUrl: hipsServiceUrl, validRequest: true };
        }).catch((e) => {
            return { duration: maxTime, baseUrl: hipsServiceUrl, validRequest: false };
        });

        return promise;
    };

    // Get all the possible hips_service_url urls
    let promises = [];
    let urls = [metadata.hips_service_url];

    promises.push(pingHiPSServiceUrl(metadata.hips_service_url));

    let numHiPSServiceURL = 1;
    while (metadata.hasOwnProperty("hips_service_url_" + numHiPSServiceURL.toString())) {
        const key = "hips_service_url_" + numHiPSServiceURL.toString();

        let curUrl = metadata[key];
        promises.push(pingHiPSServiceUrl(curUrl))
        numHiPSServiceURL += 1;

        urls.push(curUrl)
    }

    return Promise.all(promises)
        .then((responses) => {
            // filter the ones that failed to not choose them
            // it may be a cors issue at this point
            let validResponses = responses.filter((resp) => { return resp.validRequest === true; });

            const getRandomIntInclusive = function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            validResponses.sort((r1, r2) => {
                return r1.duration - r2.duration;
            });

            //console.log(validResponses)

            if (validResponses.length >= 2) {
                const isSecondUrlOk = ((validResponses[1].duration - validResponses[0].duration) / validResponses[0].duration) < 0.20;

                if (isSecondUrlOk) {
                    return validResponses[getRandomIntInclusive(0, 1)].baseUrl;
                } else {
                    return validResponses[0].baseUrl;
                }
            } else if (validResponses.length === 1) {
                return validResponses[0].baseUrl;
            } else {
                // no valid response => we return an error
                return Promise.reject('Survey not found. All mirrors urls have been tested:' + urls)
            }
        })
        .then((url) => Utils.fixURLForHTTPS(url))
}
